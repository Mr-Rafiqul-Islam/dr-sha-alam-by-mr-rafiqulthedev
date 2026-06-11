import { validateSSLPayment } from "../../lib/sslPayment.js";
import db from "../../lib/db.js";
import SSLCommerzPayment from "sslcommerz-lts";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// -----------------------------------------------------------
// Start Payment (Frontend → Backend)
// -----------------------------------------------------------
export const startPayment = async (req, res) => {
    try {
        const {
            doctorId,
            userId,
            name,
            phone,
            gender,
            location,
            appointmentDate,
            siteRef,
        } = req.body;

        const tranId = "TRX-" + Date.now();
        const amount = 100; // in taka

        const data = {
            total_amount: amount,
            currency: "BDT",
            tran_id: tranId,
            success_url: `${process.env.BACKEND_URL}/api/v1/payment/success?tranId=${tranId}`,
            fail_url: `${process.env.BACKEND_URL}/api/v1/payment/fail?tranId=${tranId}`,
            cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/cancel?tranId=${tranId}`,
            ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/ipn`,

            shipping_method: 'Courier',

            product_name: "Doctor Appointment",
            product_category: "Healthcare",
            product_profile: "general",

            cus_name: name,
            cus_email: "customer@example.com",
            cus_add1: location,
            cus_city: "Dhaka",
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: "Bangladesh",
            cus_phone: phone,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',

            value_a: doctorId,
            value_b: userId || null,
            value_c: Buffer.from(JSON.stringify({
                name,
                phone,
                gender,
                location,
                appointmentDate,
                siteRef,
                transactionId: tranId
            })).toString("base64"),
        };

        // Save initial payment
        await db.payment.create({
            data: {
                tranId,
                userId: userId || null,
                doctorId,
                amount,
                status: "PENDING",
            },
        });

        // Initiate payment
        const store_id = process.env.STORE_ID;
        const store_passwd = process.env.STORE_PASSWORD;
        const is_live = false;
        // const api = await initiateSSLPayment(data);
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        const apiResponse = await sslcz.init(data);
        const GatewayPageURL = apiResponse?.GatewayPageURL;

        if (!GatewayPageURL) {
            console.log("❌ GatewayPageURL missing:", apiResponse);
            return res.status(500).json({
                success: false,
                message: "Failed to get payment URL",
            });
        }


        return res.json({
            success: true,
            url: GatewayPageURL,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Payment init failed" });
    }
};

// -----------------------------------------------------------
// 2Payment Success (SSL → Backend)
// -----------------------------------------------------------
export const paymentSuccess = async (req, res) => {

    try {
        const { tranId, val_id } = req.query;
        const isDev = process.env.NODE_ENV !== "production";

        if (!tranId) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=no_tranId`);
        }

        const payment = await db.payment.findUnique({ where: { tranId } });

        if (!payment) {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=invalid_transaction`);
        }

        // If already processed
        if (payment.status === "SUCCESS") {
            return res.redirect(`${process.env.FRONTEND_URL}/thank-you?appointmentId=${payment.appointmentId}`);
        }

        let validator;

        // -------------------------------------------------------
        // DEV MODE → SKIP VALIDATION (localhost)
        // -------------------------------------------------------
        if (isDev) {
            console.log("⚠ DEV MODE: Skipping SSL validation");

            validator = {
                status: "VALID",
                value_a: payment.doctorId,
                value_b: payment.userId,
                value_c: payment.rawData, // optional fallback
            };
        } else {
            // -------------------------------------------------------
            // PRODUCTION MODE → REAL SSL VALIDATION
            // -------------------------------------------------------
            if (!val_id) {
                return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=missing_val_id`);
            }

            try {
                validator = await validateSSLPayment(val_id);
            } catch (err) {
                return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=validation_error`);
            }

            if (validator.status !== "VALID" && validator.status !== "VALIDATED") {
                return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=validation_failed`);
            }
        }

        // Parse appointment data
        let appointmentData;
        try {
            appointmentData = JSON.parse(Buffer.from(validator.value_c, "base64").toString());
        } catch (err) {
            appointmentData = {
                name: "Unknown",
                phone: "8801650156155",
                gender: "Other",
                location: "N/A",
                problem: "PLID",
                appointmentDate: new Date("2025-11-21T00:00:00.000Z"),
                siteRef: "DOCTOR_SHA_ALAM",
                serialNumber: 1,
                transactionId: "DEV_NO_TRANSACTION_ID2",
                attendTime: "M10",
            };
        }

        // -----------------------------------------------------------
        // Date Validation: Past date OR today is not allowed
        // -----------------------------------------------------------
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const userDate = new Date(appointmentData.appointmentDate)
        userDate.setHours(0, 0, 0, 0);

        // If userDate <= today → reject
        if (userDate <= today) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment-failed?error=today_or_past_date_not_allowed`
            );
        }


        // -----------------------------------------------
        // NEW FEATURE: Daily Serial + Batch Attend Time
        // -----------------------------------------------

        // Convert appointment date properly
        const selectedDate = new Date(appointmentData.appointmentDate);

        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);

        // Count how many appointments already exist for that doctor on that date
        const todayCount = await db.appointment.count({
            where: {
                doctorId: payment.doctorId,
                appointmentDate: {
                    gte: dayStart,
                    lte: dayEnd,
                },
            },
        });

        const serialNumber = todayCount + 1;

        // Batch Logic
        let attendTime;

        if (serialNumber >= 1 && serialNumber <= 60) {
            attendTime = "M10";    // সকাল ১০ টা batch
        } else if (serialNumber >= 61 && serialNumber <= 120) {
            attendTime = "A3";     // বিকাল ৩ টা batch
        } else {
            attendTime = "OTHER";  // optional fallback
        }


        const newAppointment = await db.appointment.create({
            data: {
                userId: payment.userId,
                doctorId: payment.doctorId,
                ...appointmentData,
                appointmentDate: new Date(appointmentData.appointmentDate),
                status: "CONFIRMED",
            },
        });


        // Update payment
        await db.payment.update({
            where: { tranId },
            data: {
                status: "SUCCESS",
                valId: val_id || "DEV_NO_VAL_ID",
                appointmentId: newAppointment.id,
            },
        });

        // Send SMS
        const ApiKey = process.env.NOVOCOM_API_KEY;
        const ClientId = process.env.NOVOCOM_CLIENT_ID;
        const SenderId = process.env.NOVOCOM_SENDER_ID;

        const attendTimeText =
            attendTime === "M10"
                ? "সকাল ১০ টা"
                : attendTime === "A3"
                    ? "বিকাল ৩ টা"
                    : "নির্ধারিত সময়";

        const Message = encodeURIComponent(
            `চেম্বার: TruCare Healing Centre
সিদ্দিক টাওয়ার (৫ম তলা, লিফট এর- ৪), ৪৯ মহাখালী, ঢাকা।
(স্কয়ার ফার্মাসিউটিক্যালস হেড অফিসের পাশের ভবন)

রোগীর নাম: ${appointmentData.name}
আপনার সিরিয়াল নং: ${serialNumber}
উপস্থিতি সময়ঃ ${attendTimeText}

যোগাযোগ: ০৯৬১৩-৬৬৮৮৬৬, ০১৭০১ ৩১৩০০১-০২`
        );


        const MobileNumbers = appointmentData.phone;

        const url = `https://sms.novocom-bd.com/api/v2/SendSMS?` +
            `ApiKey=${ApiKey}&ClientId=${ClientId}&SenderId=${SenderId}` +
            `&Message=${Message}&MobileNumbers=${MobileNumbers}&Is_Unicode=True`;

        await axios.get(url);


        return res.redirect(
            `${process.env.FRONTEND_URL}/thank-you?appointmentId=${newAppointment.id}`
        );

    } catch (error) {
        console.error(error);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=server_error`);
    }
};


// -----------------------------------------------------------
//  Payment Fail
// -----------------------------------------------------------
export const paymentFail = async (req, res) => {
    const { tranId } = req.query;

    await db.payment.update({
        where: { tranId },
        data: { status: "FAILED" },
    });

    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};

// -----------------------------------------------------------
// Payment Cancel
// -----------------------------------------------------------
export const paymentCancel = async (req, res) => {
    const { tranId } = req.query;

    await db.payment.update({
        where: { tranId },
        data: { status: "CANCELLED" },
    });

    res.redirect(`${process.env.FRONTEND_URL}/payment-cancelled`);
};

// -----------------------------------------------------------
// IPN Callback (Highly Recommended)
// -----------------------------------------------------------
export const paymentIPN = async (req, res) => {
    console.log("IPN DATA:", req.body);
    res.status(200).send("IPN RECEIVED");
};
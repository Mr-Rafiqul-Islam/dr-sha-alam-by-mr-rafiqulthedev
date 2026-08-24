import type { Request, Response } from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import { prisma } from "../../config/db.js";
import { sendCapiEvent } from "../../lib/metaCapi.js";
import {
  AppointmentValidationError,
} from "../../modules/appointment/appointment.utils.js";
import {
  buildPaymentAppointmentPayloadWithSlotValidation,
  createPendingPaymentWithAppointment,
  fulfillSuccessfulPayment,
  getBackendUrl,
  getAdminUrl,
  handlePaymentCancelSync,
  handlePaymentFailSync,
  resolveBookingConsultationFee,
  resolveDoctorId,
  validateSslOrThrow,
} from "../../modules/payment/payment.service.js";

type PaymentBrowserMeta = {
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
};

function parseBodyString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
}

function buildBookingSuccessUrl(appointmentId: string, tranId: string): string {
  return `${getAdminUrl()}/booking-success?appointmentId=${encodeURIComponent(appointmentId)}&tranId=${encodeURIComponent(tranId)}`;
}

async function sendPurchaseCapiEvent(params: {
  payment: {
    tranId: string;
    currency: string;
    amount: number;
    meta: unknown;
    appointmentId: string | null;
  };
}): Promise<void> {
  if (!params.payment.appointmentId) {
    return;
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.payment.appointmentId },
    select: { phone: true, email: true },
  });

  const meta = params.payment.meta as PaymentBrowserMeta | null;

  void sendCapiEvent({
    eventName: "Purchase",
    eventId: params.payment.tranId,
    eventTime: Math.floor(Date.now() / 1000),
    actionSource: "website",
    userData: {
      phone: appointment?.phone,
      email: appointment?.email ?? undefined,
      clientIpAddress: meta?.clientIp,
      clientUserAgent: meta?.userAgent,
      fbc: meta?.fbc,
      fbp: meta?.fbp,
    },
    customData: {
      currency: params.payment.currency,
      value: params.payment.amount,
    },
  });
}

function routeQueryString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
    return value[0].trim();
  }
  return undefined;
}

function routeBodyString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
}

function redirectPaymentFailed(res: Response, error: string) {
  return res.redirect(`${getAdminUrl()}/payment-failed?error=${encodeURIComponent(error)}`);
}

function logPaymentProviderStatus(
  handler: string,
  tranId: string | undefined,
  payload: unknown,
) {
  const provider =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  console.log(`[Payment ${handler}] Provider status:`, {
    tranId,
    status: provider.status,
    val_id: provider.val_id,
    amount: provider.amount,
    currency: provider.currency,
    tran_id: provider.tran_id,
  });
}

export async function startPayment(req: Request, res: Response) {
  try {
    const appointmentPayload = await buildPaymentAppointmentPayloadWithSlotValidation(req.body);

    const doctorId = await resolveDoctorId(
      typeof req.body.doctorId === "string" ? req.body.doctorId : undefined,
    );
    const amount = await resolveBookingConsultationFee({
      preferredTime: appointmentPayload.preferredTime,
      siteRef: appointmentPayload.siteRef,
    });
    const userId =
      typeof req.body.userId === "string" && req.body.userId.trim()
        ? req.body.userId.trim()
        : null;

    const tranId = `TRX-${Date.now()}`;
    const backendUrl = getBackendUrl();

    const sslData = {
      total_amount: amount,
      currency: "BDT",
      tran_id: tranId,
      success_url: `${backendUrl}/api/v1/payment/success?tranId=${encodeURIComponent(tranId)}`,
      fail_url: `${backendUrl}/api/v1/payment/fail?tranId=${encodeURIComponent(tranId)}`,
      cancel_url: `${backendUrl}/api/v1/payment/cancel?tranId=${encodeURIComponent(tranId)}`,
      ipn_url: `${backendUrl}/api/v1/payment/ipn`,
      shipping_method: "Courier",
      product_name: "Doctor Appointment",
      product_category: "Healthcare",
      product_profile: "general",
      cus_name: appointmentPayload.fullName,
      cus_email:
        typeof appointmentPayload.email === "string" && appointmentPayload.email
          ? appointmentPayload.email
          : "appointment@doctorshahalam.com",
      cus_add1: appointmentPayload.homeAddress,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: appointmentPayload.phoneNumber,
      ship_name: appointmentPayload.fullName,
      ship_add1: appointmentPayload.homeAddress,
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const browserContext: PaymentBrowserMeta = {
      clientIp:
        (typeof req.headers["x-forwarded-for"] === "string"
          ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
          : undefined) ?? req.ip,
      userAgent:
        parseBodyString(req.body.userAgent) ??
        (typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined),
      fbc:
        parseBodyString(req.body.fbc) ??
        (typeof req.cookies._fbc === "string" ? req.cookies._fbc : undefined),
      fbp:
        parseBodyString(req.body.fbp) ??
        (typeof req.cookies._fbp === "string" ? req.cookies._fbp : undefined),
    };

    await createPendingPaymentWithAppointment({
      payload: appointmentPayload,
      tranId,
      userId,
      doctorId,
      amount,
      meta: browserContext,
    });

    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isLive = process.env.SSL_IS_LIVE === "true";

    if (!storeId || !storePassword) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway is not configured",
      });
    }

    const sslcz = new SSLCommerzPayment(storeId, storePassword, isLive);
    const apiResponse = await sslcz.init(sslData);
    const gatewayPageUrl = apiResponse?.GatewayPageURL;

    if (!gatewayPageUrl) {
      console.error("GatewayPageURL missing:", apiResponse);
      return res.status(500).json({
        success: false,
        message: "Failed to get payment URL",
      });
    }

    return res.json({
      success: true,
      url: gatewayPageUrl,
      tranId,
      amount,
    });
  } catch (error) {
    if (error instanceof AppointmentValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Payment init failed:", error);
    return res.status(500).json({ success: false, message: "Payment init failed" });
  }
}

export async function paymentSuccess(req: Request, res: Response) {
  try {
    const tranId = routeQueryString(req.query.tranId);
    const valId = routeBodyString(req.body.val_id) ?? routeQueryString(req.query.val_id);

    if (!tranId) {
      return redirectPaymentFailed(res, "no_tranId");
    }

    const payment = await prisma.payment.findUnique({ where: { tranId } });
    if (!payment) {
      return redirectPaymentFailed(res, "invalid_transaction");
    }

    if (payment.status === "SUCCESS" && payment.appointmentId) {
      return res.redirect(
        buildBookingSuccessUrl(payment.appointmentId, tranId),
      );
    }

    const validator = await validateSslOrThrow(valId);
    logPaymentProviderStatus("success", tranId, validator);
    const result = await fulfillSuccessfulPayment(payment, {
      valId: valId ?? routeBodyString(validator.val_id),
      providerRaw: validator,
    });

    if (!result.appointmentId) {
      return redirectPaymentFailed(res, "slot_full");
    }

    if (!result.alreadyProcessed) {
      const updatedPayment = await prisma.payment.findUnique({
        where: { tranId },
      });

      if (updatedPayment) {
        await sendPurchaseCapiEvent({ payment: updatedPayment });
      }
    }

    return res.redirect(buildBookingSuccessUrl(result.appointmentId, tranId));
  } catch (error) {
    if (error instanceof AppointmentValidationError) {
      if (error.message.includes("future dates")) {
        return redirectPaymentFailed(res, "today_or_past_date_not_allowed");
      }
      if (error.message === "slot_full") {
        return redirectPaymentFailed(res, "slot_full");
      }
      if (error.message.includes("val_id") || error.message.includes("validation")) {
        return redirectPaymentFailed(res, "validation_failed");
      }
      return redirectPaymentFailed(res, "server_error");
    }

    console.error("Payment success handler failed:", error);
    return redirectPaymentFailed(res, "server_error");
  }
}

export async function paymentFail(req: Request, res: Response) {
  try {
    const tranId = routeQueryString(req.query.tranId);

    if (!tranId) {
      return redirectPaymentFailed(res, "no_tranId");
    }

    const payment = await prisma.payment.findUnique({ where: { tranId } });
    if (!payment) {
      return redirectPaymentFailed(res, "invalid_transaction");
    }

    logPaymentProviderStatus("fail", tranId, req.body);

    if (payment.status !== "SUCCESS") {
      await handlePaymentFailSync(payment, req.body);
    }

    return res.redirect(`${getAdminUrl()}/payment-failed`);
  } catch (error) {
    console.error("Payment fail handler failed:", error);
    return redirectPaymentFailed(res, "server_error");
  }
}

export async function paymentCancel(req: Request, res: Response) {
  try {
    const tranId = routeQueryString(req.query.tranId);

    if (!tranId) {
      return redirectPaymentFailed(res, "no_tranId");
    }

    const payment = await prisma.payment.findUnique({ where: { tranId } });
    if (!payment) {
      return redirectPaymentFailed(res, "invalid_transaction");
    }

    logPaymentProviderStatus("cancel", tranId, req.body);

    if (payment.status !== "SUCCESS") {
      await handlePaymentCancelSync(payment, req.body);
    }

    return res.redirect(`${getAdminUrl()}/payment-cancelled`);
  } catch (error) {
    console.error("Payment cancel handler failed:", error);
    return redirectPaymentFailed(res, "server_error");
  }
}

export async function paymentIPN(req: Request, res: Response) {
  try {
    const tranId =
      routeBodyString(req.body.tran_id) ?? routeBodyString(req.body.tranId);
    const valId = routeBodyString(req.body.val_id);

    if (!tranId) {
      return res.status(400).send("Missing tran_id");
    }

    const payment = await prisma.payment.findUnique({ where: { tranId } });
    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    const validator = await validateSslOrThrow(valId);
    logPaymentProviderStatus("ipn", tranId, validator);
    const result = await fulfillSuccessfulPayment(payment, {
      valId: valId ?? routeBodyString(validator.val_id),
      providerRaw: req.body,
    });

    if (!result.alreadyProcessed && result.appointmentId) {
      const updatedPayment = await prisma.payment.findUnique({
        where: { tranId },
      });

      if (updatedPayment) {
        await sendPurchaseCapiEvent({ payment: updatedPayment });
      }
    }

    return res.status(200).send("IPN PROCESSED");
  } catch (error) {
    console.error("Payment IPN failed:", error);
    return res.status(500).send("IPN ERROR");
  }
}

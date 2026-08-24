import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  AppointmentForm,
} from "../components/appointments/AppointmentForm";
import {
  BkashMerchantQr,
  DigitalPaymentModal,
  SslPaymentQr,
} from "../components/appointments/DigitalPaymentModal";
import { Button, Icon, PageHeader } from "../components/common";
import {
  useConfirmAdminBkashPaymentMutation,
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useStartAdminSslPaymentMutation,
} from "../store/api/appointmentsApi";
import { useGetPaymentSettingsQuery } from "../store/api/paymentSettingsApi";
import type { Appointment, AppointmentFormData } from "../types/appointment";
import {
  computeStaffDueAmount,
  resolveCreateFeeCategory,
  toCreateAppointmentPayload,
} from "../utils/appointment";
import { validateDiscountFormState } from "../utils/discount";
import { formatSerialDisplay } from "../utils/appointmentSerial";
import { useGetAppointmentRevenueFeesQuery } from "../store/api/appointmentRevenueApi";

function getApiErrorMessage(error: unknown, fallback = "Failed to create appointment"): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

export function CreateAppointmentPage() {
  const navigate = useNavigate();
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const [startSsl, { isLoading: isStartingSsl }] = useStartAdminSslPaymentMutation();
  const [confirmBkash, { isLoading: isConfirmingBkash }] =
    useConfirmAdminBkashPaymentMutation();
  const { data: feeData } = useGetAppointmentRevenueFeesQuery("DOCTOR_SHA_ALAM");
  const { data: paymentSettings } = useGetPaymentSettingsQuery();

  const [sslSession, setSslSession] = useState<{
    appointmentId: string;
    gatewayPageUrl: string;
    qrCode?: string;
    amount: number;
  } | null>(null);
  const [bkashAppointment, setBkashAppointment] = useState<Appointment | null>(null);

  const handledSslSuccessRef = useRef(false);
  const pollingId = sslSession?.appointmentId;
  const { data: polledAppointment } = useGetAppointmentQuery(pollingId ?? "", {
    skip: !pollingId,
    pollingInterval: pollingId ? 3000 : 0,
  });

  useEffect(() => {
    if (polledAppointment?.paymentStatus !== "SUCCESS" || !sslSession) {
      return;
    }
    if (handledSslSuccessRef.current) {
      return;
    }
    handledSslSuccessRef.current = true;
    toast.success("SSL payment received");
    navigate("/appointments");
  }, [navigate, polledAppointment?.paymentStatus, sslSession]);

  const handleSubmit = async (data: AppointmentFormData) => {
    const discountError = validateDiscountFormState(data.discount);
    if (discountError) {
      toast.error(discountError);
      return;
    }

    const feeCategory = resolveCreateFeeCategory(data.preferredTime);
    const categoryFee =
      feeCategory && feeData?.fees ? feeData.fees[feeCategory] : null;
    const dueAmount =
      categoryFee == null ? null : computeStaffDueAmount(categoryFee, data.discount);

    if (data.paymentChannel === "CASH") {
      if (dueAmount == null || data.collectedAmount == null) {
        toast.error("Enter the cash amount");
        return;
      }
      if (Math.round(data.collectedAmount * 100) !== Math.round(dueAmount * 100)) {
        toast.error(`Cash amount must equal ${dueAmount} BDT`);
        return;
      }
    }

    try {
      const appointment = await createAppointment(
        toCreateAppointmentPayload(data),
      ).unwrap();

      if (data.paymentChannel === "DIGITAL" && data.digitalMethod === "SSL") {
        try {
          const session = await startSsl(appointment.id).unwrap();
          handledSslSuccessRef.current = false;
          setSslSession({
            appointmentId: appointment.id,
            gatewayPageUrl: session.gatewayPageUrl,
            qrCode: session.qrCode,
            amount: session.amount,
          });
          toast.success(
            `Appointment created. Scan the SSL QR to collect ${session.amount} BDT.`,
          );
          return;
        } catch (error) {
          toast.error(
            getApiErrorMessage(
              error,
              "Appointment created but SSL session failed. Payment stays pending.",
            ),
          );
          navigate("/appointments");
          return;
        }
      }

      if (data.paymentChannel === "DIGITAL" && data.digitalMethod === "BKASH") {
        setBkashAppointment(appointment);
        toast.success("Appointment created. Confirm bKash after collection.");
        return;
      }

      toast.success(
        `Appointment created for ${appointment.name} (${formatSerialDisplay(
          appointment.effectiveSerialNumber ?? appointment.serialNumber,
        )})`,
      );
      navigate("/appointments");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const closeSslModal = () => {
    setSslSession(null);
    navigate("/appointments");
  };

  const closeBkashModal = () => {
    setBkashAppointment(null);
    navigate("/appointments");
  };

  const handleConfirmBkash = async () => {
    if (!bkashAppointment) {
      return;
    }

    try {
      await confirmBkash(bkashAppointment.id).unwrap();
      toast.success("bKash payment confirmed");
      closeBkashModal();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to confirm bKash payment"));
    }
  };

  return (
    <>
      <PageHeader
        title="Add New Appointment"
        subtitle="Enter patient details and preferred schedule."
        action={
          <Button
            variant="ghost"
            leftIcon={<Icon name="arrow_back" size={20} />}
            onClick={() => navigate("/appointments")}
            className="border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface hover:bg-surface-container-high"
          >
            Back to Appointments
          </Button>
        }
      />

      <div className="mx-auto max-w-2xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
        <AppointmentForm
          submitLabel="Create Appointment"
          isSubmitting={isLoading || isStartingSsl}
          onSubmit={handleSubmit}
        />
      </div>

      <DigitalPaymentModal
        open={Boolean(sslSession)}
        title="SSL Digital Payment"
        subtitle={
          sslSession
            ? `Amount ${sslSession.amount} BDT. Waiting for payment...`
            : undefined
        }
        onClose={closeSslModal}
      >
        {sslSession ? (
          <SslPaymentQr
            gatewayPageUrl={sslSession.gatewayPageUrl}
            qrCode={sslSession.qrCode}
          />
        ) : null}
      </DigitalPaymentModal>

      <DigitalPaymentModal
        open={Boolean(bkashAppointment)}
        title="bKash Digital Payment"
        subtitle="Confirm after the patient pays"
        onClose={closeBkashModal}
        footer={
          <Button
            type="button"
            onClick={() => void handleConfirmBkash()}
            disabled={isConfirmingBkash}
          >
            {isConfirmingBkash ? "Confirming..." : "Payment received"}
          </Button>
        }
      >
        <BkashMerchantQr uploadedUrl={paymentSettings?.bkashMerchantQrUrl} />
      </DigitalPaymentModal>
    </>
  );
}

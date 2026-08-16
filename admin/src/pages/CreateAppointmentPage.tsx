import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  AppointmentForm,
} from "../components/appointments/AppointmentForm";
import { Button, Icon, PageHeader } from "../components/common";
import { useCreateAppointmentMutation } from "../store/api/appointmentsApi";
import type { AppointmentFormData } from "../types/appointment";
import { toCreateAppointmentPayload } from "../utils/appointment";
import { validateDiscountFormState } from "../utils/discount";
import { formatSerialDisplay } from "../utils/appointmentSerial";

function getApiErrorMessage(error: unknown): string {
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

  return "Failed to create appointment";
}

export function CreateAppointmentPage() {
  const navigate = useNavigate();
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (data: AppointmentFormData) => {
    const discountError = validateDiscountFormState(data.discount);
    if (discountError) {
      toast.error(discountError);
      return;
    }

    try {
      const appointment = await createAppointment(
        toCreateAppointmentPayload(data),
      ).unwrap();

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
          isSubmitting={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

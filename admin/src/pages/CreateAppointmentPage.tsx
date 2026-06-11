import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AppointmentForm,
  type AppointmentFormData,
} from "../components/appointments/AppointmentForm";
import { Button, Icon, PageHeader } from "../components/common";

export function CreateAppointmentPage() {
  const navigate = useNavigate();

  const handleSubmit = (data: AppointmentFormData) => {
    console.log("New appointment:", data);
    toast.success("Appointment data captured — check console");
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
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

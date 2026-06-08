import { useState } from "react";
import { toast } from "react-toastify";
import {
  Avatar,
  Badge,
  Button,
  Icon,
  Modal,
  PageHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/common";
import {
  AppointmentForm,
  type AppointmentFormData,
} from "../components/appointments/AppointmentForm";
import { mockAppointments } from "../data/mockAppointments";

export function AppointmentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAppointment = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const timeLabel =
        data.preferredTime === "plid-9am"
          ? "9:00 AM"
          : data.preferredTime === "old-plid-4pm"
            ? "4:00 PM"
            : "5:00 PM";
      toast.success(
        `Appointment booked for ${data.patientName} on ${data.preferredDate} at ${timeLabel}`,
      );
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Recent Appointments"
        subtitle="Manage and track patient schedules."
        action={
          <Button
            leftIcon={<Icon name="add" size={18} />}
            fullWidthOnMobile
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Appointment
          </Button>
        }
      />

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Patient Information"
        subtitle="Fill in the patient details to book a new appointment."
      >
        <AppointmentForm
          onSubmit={handleAddAppointment}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-outline-variant/50 bg-surface/50 hover:bg-surface/50">
                <TableHead>Patient Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Symptoms/Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar initials={appointment.initials} size="sm" />
                      <span className="text-body-md font-medium text-on-surface">
                        {appointment.patientName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-body-md text-on-surface">
                        {appointment.phone}
                      </span>
                      <span className="text-label-sm text-on-surface-variant">
                        {appointment.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="neutral"
                      className="gap-2 px-3 py-1.5 rounded-md"
                    >
                      <Icon name="event" size={16} className="text-primary" />
                      {appointment.dateTime}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md text-on-surface-variant line-clamp-1 max-w-[200px] block">
                      {appointment.symptoms}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={appointment.status}>
                      {appointment.status === "pending" ? "Pending" : "Confirmed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="View appointment"
                      >
                        <Icon name="visibility" size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Edit appointment"
                      >
                        <Icon name="edit" size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-error hover:bg-error-container/50"
                        aria-label="Delete appointment"
                      >
                        <Icon name="delete" size={20} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={1}
          totalPages={3}
          totalItems={24}
          pageSize={3}
        />
      </div>
    </>
  );
}

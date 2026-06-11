import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Avatar,
  Badge,
  Button,
  DeleteConfirmationModal,
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
import { AppointmentFilters } from "../components/appointments/AppointmentFilters";
import { AppointmentStats } from "../components/appointments/AppointmentStats";
import { AppointmentViewModal } from "../components/appointments/AppointmentViewModal";
import {
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "../store/api/appointmentsApi";
import type { Appointment, AppointmentStatus } from "../types/appointment";
import {
  APPOINTMENT_STATUS_OPTIONS,
  filterAppointments,
  formatAppointmentDateTime,
  getInitials,
  getStatusBadgeVariant,
  getStatusLabel,
} from "../utils/appointment";

const PAGE_SIZE = 10;

export function AppointmentsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] =
    useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] =
    useState<Appointment | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | "">(
    "",
  );

  const { data: appointments = [], isLoading, isError, error } =
    useGetAppointmentsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();
  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();

  const filteredAppointments = filterAppointments(appointments, {
    search,
    date,
    todayOnly,
  });
  const totalItems = filteredAppointments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load appointments");
    }
  }, [isError, error]);

  const openStatusModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setSelectedStatus(appointment.status);
  };

  const closeStatusModal = () => {
    setEditingAppointment(null);
    setSelectedStatus("");
  };

  const closeDeleteModal = () => {
    setDeletingAppointment(null);
  };

  const openViewModal = (appointment: Appointment) => {
    setViewingAppointment(appointment);
  };

  const closeViewModal = () => {
    setViewingAppointment(null);
  };

  const handleStatusUpdate = async () => {
    if (!editingAppointment || !selectedStatus) return;

    try {
      await updateStatus({
        id: editingAppointment.id,
        status: selectedStatus,
      }).unwrap();
      toast.success("Appointment status updated successfully");
      closeStatusModal();
    } catch {
      toast.error("Failed to update appointment status");
    }
  };

  const handleDelete = async () => {
    if (!deletingAppointment) return;

    try {
      await deleteAppointment({ id: deletingAppointment.id }).unwrap();
      toast.success("Appointment deleted successfully");
      closeDeleteModal();
    } catch {
      toast.error("Failed to delete appointment");
    }
  };

  const handleTodayToggle = () => {
    setTodayOnly((current) => !current);
    setDate("");
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDate("");
    setTodayOnly(false);
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Recent Appointments"
        subtitle="Manage and track patient schedules."
        action={
          <Button
            leftIcon={<Icon name="add" size={20} />}
            onClick={() => navigate("/appointments/new")}
          >
            Add New Appointment
          </Button>
        }
      />

      {!isLoading && !isError && <AppointmentStats appointments={appointments} />}

      {!isLoading && !isError && (
        <AppointmentFilters
          search={search}
          date={date}
          todayOnly={todayOnly}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          onDateChange={(value) => {
            setDate(value);
            setTodayOnly(false);
            setCurrentPage(1);
          }}
          onTodayToggle={handleTodayToggle}
          onClear={handleClearFilters}
        />
      )}

      <Modal
        open={editingAppointment !== null}
        onClose={closeStatusModal}
        title="Update Status"
        subtitle={
          editingAppointment
            ? `Change status for ${editingAppointment.name}`
            : undefined
        }
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              Status
            </span>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as AppointmentStatus)
              }
              className="w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {APPOINTMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeStatusModal}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Status"}
            </Button>
          </div>
        </div>
      </Modal>

      <DeleteConfirmationModal
        open={deletingAppointment !== null}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Appointment"
        itemName={deletingAppointment?.name}
        isLoading={isDeleting}
      />

      <AppointmentViewModal
        appointment={viewingAppointment}
        onClose={closeViewModal}
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-on-surface-variant">
            <Icon
              name="progress_activity"
              size={32}
              className="animate-spin text-primary"
            />
            <p className="text-body-md">Loading appointments...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-on-surface-variant">
            <Icon name="error" size={32} className="text-error" />
            <p className="text-body-md">Failed to load appointments.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-outline-variant/50 bg-surface/50 hover:bg-surface/50">
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead>Problems</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-on-surface-variant"
                      >
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              initials={getInitials(appointment.name)}
                              size="sm"
                            />
                            <span className="text-body-md font-medium text-on-surface">
                              {appointment.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-body-md text-on-surface">
                              {appointment.phone}
                            </span>
                            <span className="text-label-sm text-on-surface-variant">
                              {appointment.email ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="neutral"
                            className="gap-2 px-3 py-1.5 rounded-md"
                          >
                            <Icon
                              name="event"
                              size={16}
                              className="text-primary"
                            />
                            {formatAppointmentDateTime(appointment)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface-variant line-clamp-1 max-w-[200px] block">
                            {appointment.problem ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(appointment.status)}
                          >
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="View appointment"
                              onClick={() => openViewModal(appointment)}
                            >
                              <Icon name="visibility" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Edit appointment status"
                              onClick={() => openStatusModal(appointment)}
                            >
                              <Icon name="edit" size={20} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:text-error hover:bg-error-container/50"
                              aria-label="Delete appointment"
                              onClick={() => setDeletingAppointment(appointment)}
                            >
                              <Icon name="delete" size={20} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </>
  );
}

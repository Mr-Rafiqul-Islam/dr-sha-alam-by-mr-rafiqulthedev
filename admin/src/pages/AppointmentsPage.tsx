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
  PendingDeleteBadge,
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
  exportAppointmentsCsv,
  filterAppointments,
  formatAppointmentDateTime,
  getTodayYmd,
  getInitials,
  getPaymentStatusBadgeVariant,
  getPaymentStatusLabel,
  getStatusBadgeVariant,
  getStatusLabel,
} from "../utils/appointment";
import {
  getPendingDeleteRowClass,
  getPendingDeleteSurfaceClass,
} from "../utils/pendingDelete";

const PAGE_SIZE_OPTIONS = [10, 30, 50] as const;
const DEFAULT_PAGE_SIZE = 30;

type AppointmentActionsProps = {
  appointment: Appointment;
  onView: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
};

function AppointmentActions({
  appointment,
  onView,
  onEdit,
  onDelete,
}: AppointmentActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        aria-label="View appointment"
        onClick={() => onView(appointment)}
      >
        <Icon name="visibility" size={20} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Edit appointment status"
        onClick={() => onEdit(appointment)}
      >
        <Icon name="edit" size={20} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-error-container/50 hover:text-error"
        aria-label="Delete appointment"
        onClick={() => onDelete(appointment)}
      >
        <Icon name="delete" size={20} />
      </Button>
    </div>
  );
}

function AppointmentCard({
  appointment,
  onView,
  onEdit,
  onDelete,
}: AppointmentActionsProps) {
  return (
    <article
      className={`rounded-xl border p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] ${getPendingDeleteSurfaceClass(appointment.pendingDelete)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar initials={getInitials(appointment.name)} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-body-md font-semibold text-on-surface">
              {appointment.name}
            </p>
            <p className="truncate text-label-sm text-on-surface-variant">
              {appointment.email ?? "—"}
            </p>
          </div>
        </div>
        <AppointmentActions
          appointment={appointment}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {appointment.pendingDelete ? <PendingDeleteBadge /> : null}
        <Badge
          variant="neutral"
          className="gap-2 rounded-md px-3 py-1.5"
        >
          <Icon name="event" size={16} className="text-primary" />
          {formatAppointmentDateTime(appointment)}
        </Badge>
        <Badge variant={getStatusBadgeVariant(appointment.status)}>
          {getStatusLabel(appointment.status)}
        </Badge>
        <Badge variant={getPaymentStatusBadgeVariant(appointment.paymentStatus)}>
          {getPaymentStatusLabel(appointment.paymentStatus)}
        </Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <dt className="text-label-sm text-on-surface-variant">Phone</dt>
          <dd className="mt-0.5 text-body-sm text-on-surface">
            {appointment.phone}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-label-sm text-on-surface-variant">Problems</dt>
          <dd className="mt-0.5 wrap-break-word text-body-sm text-on-surface-variant">
            {appointment.problem ?? "—"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function AppointmentsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
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

  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAppointmentsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();
  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();

  const effectiveDate = todayOnly ? getTodayYmd() : date;
  const filteredAppointments = filterAppointments(appointments, {
    search,
    date,
    todayOnly,
  });
  const totalItems = filteredAppointments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
      const result = await deleteAppointment({ id: deletingAppointment.id }).unwrap();
      if (result.pending) {
        toast.info(
          "Delete request submitted and is pending confirmation from an admin.",
        );
      } else {
        toast.success("Appointment deleted successfully");
      }
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

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
    } catch {
      console.error("Failed to refresh appointments");
    }
  };

  const handleExportCsv = () => {
    if (filteredAppointments.length === 0) {
      toast.info("No appointments to export");
      return;
    }

    exportAppointmentsCsv(filteredAppointments);
  };

  return (
    <>
      <PageHeader
        title="Recent Appointments"
        subtitle="Manage and track patient schedules."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              leftIcon={<Icon name="description" size={20} />}
              fullWidthOnMobile
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
            <Button
              leftIcon={<Icon name="add" size={20} />}
              fullWidthOnMobile
              onClick={() => navigate("/appointments/new")}
            >
              Add New Appointment
            </Button>
          </div>
        }
      />

      {!isLoading && !isError && (
        <AppointmentStats
          appointments={appointments}
          selectedDate={effectiveDate || undefined}
        />
      )}

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
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
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
            <div className="xl:hidden">
              {paginatedAppointments.length === 0 ? (
                <div className="px-4 py-12 text-center text-on-surface-variant">
                  No appointments found.
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-4">
                  {paginatedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onView={openViewModal}
                      onEdit={openStatusModal}
                      onDelete={setDeletingAppointment}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-outline-variant/50 bg-surface/50 hover:bg-surface/50">
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-on-surface-variant"
                      >
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAppointments.map((appointment) => (
                      <TableRow
                        key={appointment.id}
                        className={getPendingDeleteRowClass(appointment.pendingDelete)}
                      >
                        <TableCell className="px-3! !md:px-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-on-surface">
                              {appointment.name}
                            </span>
                            {appointment.pendingDelete ? (
                              <PendingDeleteBadge />
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-on-surface">
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
                            className="gap-2 rounded-md px-3 py-1.5"
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
                          <Badge
                            variant={getStatusBadgeVariant(appointment.status)}
                          >
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getPaymentStatusBadgeVariant(
                              appointment.paymentStatus,
                            )}
                          >
                            {getPaymentStatusLabel(appointment.paymentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <AppointmentActions
                            appointment={appointment}
                            onView={openViewModal}
                            onEdit={openStatusModal}
                            onDelete={setDeletingAppointment}
                          />
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
              pageSize={pageSize}
              pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

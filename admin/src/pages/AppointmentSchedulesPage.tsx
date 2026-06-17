import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppointmentScheduleFormModal } from "../components/appointmentSchedules/AppointmentScheduleFormModal";
import {
  Badge,
  Button,
  DeleteConfirmationModal,
  Icon,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/common";
import {
  useCreateAppointmentScheduleMutation,
  useDeleteAppointmentScheduleMutation,
  useGetAppointmentScheduleByIdQuery,
  useGetAppointmentSchedulesQuery,
  useUpdateAppointmentScheduleMutation,
} from "../store/api/appointmentSchedulesApi";
import type {
  AppointmentSchedule,
  AppointmentSchedulePayload,
  ScheduleStatus,
} from "../types/appointmentSchedule";

function getStatusClassName(status: ScheduleStatus) {
  if (status === "ACTIVE") {
    return "bg-secondary-fixed text-on-secondary-fixed-variant border-secondary-fixed-dim/30";
  }
  return "bg-surface-container-high text-on-surface-variant border-outline-variant/40";
}

function formatSlotSummary(schedule: AppointmentSchedule) {
  if (schedule.slots.length === 0) return "No slots";
  return schedule.slots
    .map((slot) => `${slot.code} -> ${slot.seatLimit} seats`)
    .join(", ");
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") {
      return data.message;
    }
  }
  return fallback;
}

type ScheduleActionsProps = {
  schedule: AppointmentSchedule;
  onEdit: (schedule: AppointmentSchedule) => void;
  onDelete: (schedule: AppointmentSchedule) => void;
};

function ScheduleActions({ schedule, onEdit, onDelete }: ScheduleActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        aria-label="Edit schedule"
        onClick={() => onEdit(schedule)}
      >
        <Icon name="edit" size={20} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-error-container/50 hover:text-error"
        aria-label="Delete schedule"
        onClick={() => onDelete(schedule)}
      >
        <Icon name="delete" size={20} />
      </Button>
    </div>
  );
}

function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
}: ScheduleActionsProps) {
  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body-md font-semibold text-on-surface">
            {schedule.date}
          </p>
          <p className="mt-0.5 truncate text-body-md text-on-surface">
            {schedule.title || "—"}
          </p>
        </div>
        <ScheduleActions
          schedule={schedule}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge
          variant="neutral"
          className={getStatusClassName(schedule.status)}
        >
          {schedule.status}
        </Badge>
        {schedule.isClosed ? (
          <Badge
            variant="cancel"
            className="border-error/30 bg-error-container text-on-error-container"
          >
            Closed
          </Badge>
        ) : (
          <Badge variant="neutral">Open</Badge>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <dt className="text-label-sm text-on-surface-variant">Site</dt>
          <dd className="mt-0.5 text-body-sm text-on-surface">
            {schedule.siteRef}
          </dd>
        </div>
        <div>
          <dt className="text-label-sm text-on-surface-variant">Slots</dt>
          <dd className="mt-0.5 text-body-sm text-on-surface">
            {schedule.slots.length}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-label-sm text-on-surface-variant">Slot Summary</dt>
          <dd className="mt-0.5 wrap-break-word text-body-sm text-on-surface-variant">
            {formatSlotSummary(schedule)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function AppointmentSchedulesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [deletingSchedule, setDeletingSchedule] =
    useState<AppointmentSchedule | null>(null);

  const {
    data: schedules = [],
    error,
    isError,
    isLoading,
  } = useGetAppointmentSchedulesQuery();
  const { data: editingSchedule, isFetching: isFetchingSchedule } =
    useGetAppointmentScheduleByIdQuery(editingScheduleId ?? "", {
      skip: !editingScheduleId,
    });
  const [createSchedule, { isLoading: isCreating }] =
    useCreateAppointmentScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateAppointmentScheduleMutation();
  const [deleteSchedule, { isLoading: isDeleting }] =
    useDeleteAppointmentScheduleMutation();

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load schedules"));
    }
  }, [error, isError]);

  const openCreateModal = () => {
    setEditingScheduleId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (schedule: AppointmentSchedule) => {
    setEditingScheduleId(schedule.id);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingScheduleId(null);
  };

  const handleSubmit = async (payload: AppointmentSchedulePayload) => {
    try {
      if (editingScheduleId) {
        await updateSchedule({ id: editingScheduleId, body: payload }).unwrap();
        toast.success("Schedule updated successfully");
      } else {
        await createSchedule(payload).unwrap();
        toast.success("Schedule created successfully");
      }
      closeFormModal();
    } catch (submitError) {
      toast.error(
        getApiErrorMessage(
          submitError,
          editingScheduleId
            ? "Failed to update schedule"
            : "Failed to create schedule",
        ),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingSchedule) return;

    try {
      await deleteSchedule(deletingSchedule.id).unwrap();
      toast.success("Schedule deleted successfully");
      setDeletingSchedule(null);
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, "Failed to delete schedule"));
    }
  };

  return (
    <>
      <PageHeader
        title="Schedule Management"
        subtitle="Create and manage daily appointment slots and seat limits."
        action={
          <Button
            leftIcon={<Icon name="add" size={20} />}
            fullWidthOnMobile
            onClick={openCreateModal}
          >
            Create Schedule
          </Button>
        }
      />

      <AppointmentScheduleFormModal
        open={isFormOpen}
        schedule={editingScheduleId ? editingSchedule : null}
        isLoading={isCreating || isUpdating || isFetchingSchedule}
        onClose={closeFormModal}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        open={deletingSchedule !== null}
        onClose={() => setDeletingSchedule(null)}
        onConfirm={handleDelete}
        title="Delete Schedule"
        itemName={
          deletingSchedule?.title ||
          deletingSchedule?.date
        }
        isLoading={isDeleting}
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-on-surface-variant">
            <Icon
              name="progress_activity"
              size={32}
              className="animate-spin text-primary"
            />
            <p className="text-body-md">Loading schedules...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-on-surface-variant">
            <Icon name="error" size={32} className="text-error" />
            <p className="text-body-md">Failed to load schedules.</p>
          </div>
        ) : (
          <>
            <div className="xl:hidden">
              {schedules.length === 0 ? (
                <div className="px-4 py-12 text-center text-on-surface-variant">
                  No appointment schedules found.
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-4">
                  {schedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      onEdit={openEditModal}
                      onDelete={setDeletingSchedule}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-outline-variant/50 bg-surface/50 hover:bg-surface/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Closed?</TableHead>
                    <TableHead>Slots Count</TableHead>
                    <TableHead>Slot Summary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-on-surface-variant"
                      >
                        No appointment schedules found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <span className="text-body-md font-medium text-on-surface">
                            {schedule.date}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface">
                            {schedule.title || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="neutral"
                            className={getStatusClassName(schedule.status)}
                          >
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {schedule.isClosed ? (
                            <Badge
                              variant="cancel"
                              className="border-error/30 bg-error-container text-on-error-container"
                            >
                              Closed
                            </Badge>
                          ) : (
                            <Badge variant="neutral">Open</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface">
                            {schedule.slots.length}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="block max-w-[260px] truncate text-body-sm text-on-surface-variant">
                            {formatSlotSummary(schedule)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <ScheduleActions
                            schedule={schedule}
                            onEdit={openEditModal}
                            onDelete={setDeletingSchedule}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

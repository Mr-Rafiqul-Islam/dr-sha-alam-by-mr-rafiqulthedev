import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button, DeleteConfirmationModal, Input, Modal } from "../common";
import type { Appointment } from "../../types/appointment";
import { useUpdateAppointmentSerialMutation } from "../../store/api/appointmentsApi";
import {
  formatAppointmentDateTime,
  formatNullable,
} from "../../utils/appointment";
import {
  canModifySerial,
  formatSerialDisplay,
  getEffectiveSerialNumber,
  isSerialModified,
} from "../../utils/appointmentSerial";

const serialFormSchema = z.object({
  modifiedSerialNumber: z
    .number({
      invalid_type_error: "Serial must be a positive integer",
    })
    .int("Serial must be a positive integer")
    .positive("Serial must be greater than 0")
    .refine(Number.isInteger, "Serial must be a positive integer"),
  reason: z.string().max(200, "Reason must be 200 characters or less").optional(),
});

type SerialFormValues = z.infer<typeof serialFormSchema>;

type AppointmentSerialModalProps = {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess?: (appointment: Appointment) => void;
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

export function AppointmentSerialModal({
  appointment,
  onClose,
  onSuccess,
}: AppointmentSerialModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [updateSerial, { isLoading }] = useUpdateAppointmentSerialMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SerialFormValues>({
    resolver: zodResolver(serialFormSchema),
    defaultValues: {
      modifiedSerialNumber: 1,
      reason: "",
    },
  });

  useEffect(() => {
    if (!appointment) {
      return;
    }

    reset({
      modifiedSerialNumber: getEffectiveSerialNumber(appointment),
      reason: "",
    });
  }, [appointment, reset]);

  if (!appointment) {
    return null;
  }

  const effectiveSerial = getEffectiveSerialNumber(appointment);
  const serialModifiable = canModifySerial(appointment.status);

  const handleSave = async (values: SerialFormValues) => {
    try {
      const updated = await updateSerial({
        id: appointment.id,
        modifiedSerialNumber: values.modifiedSerialNumber,
        reason: values.reason?.trim() || undefined,
      }).unwrap();

      onSuccess?.(updated);
      toast.success("Appointment serial updated successfully");
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update serial number"));
    }
  };

  const handleReset = async () => {
    try {
      const updated = await updateSerial({
        id: appointment.id,
        modifiedSerialNumber: null,
        reason: "Reset to original serial",
      }).unwrap();

      onSuccess?.(updated);
      toast.success("Appointment serial reset to original successfully");
      setShowResetConfirm(false);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to reset serial number"));
    }
  };

  return (
    <>
      <Modal
        open={appointment !== null}
        onClose={onClose}
        title="Modify Appointment Serial"
        subtitle={appointment.name}
      >
        <div className="flex flex-col gap-4">
          <dl className="grid gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low p-4 sm:grid-cols-2">
            <div>
              <dt className="text-label-sm text-on-surface-variant">Patient</dt>
              <dd className="text-body-md text-on-surface">{appointment.name}</dd>
            </div>
            <div>
              <dt className="text-label-sm text-on-surface-variant">Phone</dt>
              <dd className="text-body-md text-on-surface">{appointment.phone}</dd>
            </div>
            <div>
              <dt className="text-label-sm text-on-surface-variant">Date &amp; Slot</dt>
              <dd className="text-body-md text-on-surface">
                {formatAppointmentDateTime(appointment)}
              </dd>
            </div>
            <div>
              <dt className="text-label-sm text-on-surface-variant">Original Serial</dt>
              <dd className="text-body-md font-semibold text-on-surface">
                {formatSerialDisplay(appointment.serialNumber)}
              </dd>
            </div>
            <div>
              <dt className="text-label-sm text-on-surface-variant">Modified Serial</dt>
              <dd className="text-body-md text-on-surface">
                {isSerialModified(appointment)
                  ? formatSerialDisplay(appointment.modifiedSerialNumber!)
                  : "Not modified"}
              </dd>
            </div>
            <div>
              <dt className="text-label-sm text-on-surface-variant">Current Serial</dt>
              <dd className="text-body-md font-semibold text-on-surface">
                {formatSerialDisplay(effectiveSerial)}
              </dd>
            </div>
          </dl>

          {!serialModifiable ? (
            <p className="rounded-lg bg-error-container/30 px-4 py-3 text-body-sm text-error">
              Serial cannot be modified for a cancelled or rescheduled appointment.
            </p>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(handleSave)}
            >
              <label className="flex flex-col gap-2">
                <span className="text-label-md font-medium text-on-surface">
                  New Modified Serial
                </span>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  {...register("modifiedSerialNumber", {
                    valueAsNumber: true,
                    onChange: (event) => {
                      const digitsOnly = event.target.value.replace(/\D/g, "");
                      setValue(
                        "modifiedSerialNumber",
                        digitsOnly ? Number(digitsOnly) : Number.NaN,
                        { shouldValidate: true },
                      );
                    },
                  })}
                />
                {errors.modifiedSerialNumber ? (
                  <span className="text-label-sm text-error">
                    {errors.modifiedSerialNumber.message}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-label-md font-medium text-on-surface">
                  Reason (optional)
                </span>
                <textarea
                  {...register("reason")}
                  rows={3}
                  maxLength={200}
                  placeholder="Why is this serial being changed?"
                  className="w-full resize-y rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {errors.reason ? (
                  <span className="text-label-sm text-error">{errors.reason.message}</span>
                ) : null}
              </label>

              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <div>
                  {isSerialModified(appointment) ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-error hover:bg-error-container/30"
                      onClick={() => setShowResetConfirm(true)}
                      disabled={isLoading}
                    >
                      Reset to Original Serial
                    </Button>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Serial"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          <p className="text-label-sm text-on-surface-variant">
            Updated by: {formatNullable(appointment.updatedBy)}
          </p>
        </div>
      </Modal>

      <DeleteConfirmationModal
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset to Original Serial"
        description={`Reset ${appointment.name}'s serial from modified ${formatSerialDisplay(
          appointment.modifiedSerialNumber!,
        )} back to original ${formatSerialDisplay(appointment.serialNumber)}?`}
        confirmLabel="Reset Serial"
        confirmLoadingLabel="Resetting..."
        isLoading={isLoading}
      />
    </>
  );
}

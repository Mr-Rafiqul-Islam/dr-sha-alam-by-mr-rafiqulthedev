import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button, Icon, Input, Modal } from "../common";
import type {
  AppointmentSchedule,
  AppointmentSchedulePayload,
  ScheduleStatus,
  SiteRef,
} from "../../types/appointmentSchedule";

const defaultSlots = [
  {
    code: "P-9",
    label: "PLID (Present at - 9:00 AM)",
    smsLabel: "সকাল ৯ টা",
    startTime: "09:00",
    endTime: "10:00",
    seatLimit: 20,
    isActive: true,
  },
  {
    code: "OP-4",
    label: "Old PLID (Present at - 4:00 PM)",
    smsLabel: "বিকাল ৪ টা",
    startTime: "16:00",
    endTime: "17:00",
    seatLimit: 15,
    isActive: true,
  },
  {
    code: "G-5",
    label: "General Patient (Present at - 5:00 PM)",
    smsLabel: "বিকাল ৫ টা",
    startTime: "17:00",
    endTime: "18:00",
    seatLimit: 10,
    isActive: true,
  },
];

const slotSchema = z.object({
  code: z.string().trim().min(1, "Code is required"),
  label: z.string().trim().min(1, "Label is required"),
  smsLabel: z.string().trim().optional(),
  startTime: z.string().trim().min(1, "Start time is required"),
  endTime: z.string().trim().optional(),
  seatLimit: z.coerce
    .number()
    .int("Seat limit must be a whole number")
    .min(0, "Seat limit cannot be negative"),
  isActive: z.boolean(),
});

 const scheduleFormSchema = z
  .object({
    date: z.string().trim().min(1, "Date is required"),
    title: z.string().trim().optional(),
    siteRef: z.enum(["DOCTOR_SHA_ALAM", "TRUE_CARE_HELLING_CENTER"]),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    isClosed: z.boolean(),
    slots: z.array(slotSchema),
  })
  .refine((data) => data.isClosed || data.slots.length >= 1, {
    message: "At least one slot is required",
    path: ["slots"],
  });

type AppointmentScheduleFormValues = z.infer<typeof scheduleFormSchema>;

type AppointmentScheduleFormModalProps = {
  open: boolean;
  schedule?: AppointmentSchedule | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: AppointmentSchedulePayload) => Promise<void>;
};

function toDateInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function createEmptySlot() {
  return {
    code: "",
    label: "",
    smsLabel: "",
    startTime: "",
    endTime: "",
    seatLimit: 0,
    isActive: true,
  };
}

function createDefaultValues(
  schedule?: AppointmentSchedule | null,
): AppointmentScheduleFormValues {
  return {
    date: toDateInputValue(schedule?.date),
    title: schedule?.title ?? "",
    siteRef: schedule?.siteRef ?? "DOCTOR_SHA_ALAM",
    status: schedule?.status ?? "ACTIVE",
    isClosed: schedule?.isClosed ?? false,
    slots:
      schedule?.slots.map((slot) => ({
        code: slot.code,
        label: slot.label,
        smsLabel: slot.smsLabel ?? "",
        startTime: slot.startTime,
        endTime: slot.endTime ?? "",
        seatLimit: slot.seatLimit,
        isActive: slot.isActive,
      })) ?? defaultSlots,
  };
}

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-label-sm text-error">{message}</p>;
}

export function AppointmentScheduleFormModal({
  open,
  schedule,
  isLoading = false,
  onClose,
  onSubmit,
}: AppointmentScheduleFormModalProps) {
  const isEditing = Boolean(schedule);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<AppointmentScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: createDefaultValues(schedule),
  });

  const { append, fields, remove, replace } = useFieldArray({
    control,
    name: "slots",
  });

  const isClosed = watch("isClosed");

  const handleIsClosedChange = (checked: boolean) => {
    setValue("isClosed", checked, { shouldValidate: true });
    if (checked) {
      replace([]);
    } else if (fields.length === 0) {
      replace([createEmptySlot()]);
    }
  };

  useEffect(() => {
    if (open) {
      reset(createDefaultValues(schedule));
    }
  }, [open, reset, schedule]);

  const handleFormSubmit: SubmitHandler<AppointmentScheduleFormValues> = async (
    values,
  ) => {
    await onSubmit({
      date: values.date,
      title: values.title || null,
      siteRef: values.siteRef as SiteRef,
      status: values.status as ScheduleStatus,
      isClosed: values.isClosed,
      slots: values.slots.map((slot) => ({
        code: slot.code.trim(),
        label: slot.label.trim(),
        smsLabel: slot.smsLabel?.trim() || null,
        startTime: slot.startTime.trim(),
        endTime: slot.endTime?.trim() || null,
        seatLimit: slot.seatLimit,
        isActive: slot.isActive,
      })),
    });
  };

  const loadDefaultSlots = () => {
    replace(defaultSlots);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Schedule" : "Create Schedule"}
      subtitle="Manage daily appointment slots and seat limits."
      className="min-w-sm lg:min-w-4xl max-w-5xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              Date
            </span>
            <Input type="date" {...register("date")} />
            <FormFieldError message={errors.date?.message} />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              Title
            </span>
            <Input placeholder="Saturday Schedule" {...register("title")} />
            <FormFieldError message={errors.title?.message} />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              SiteRef
            </span>
            <select
              {...register("siteRef")}
              className="w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="DOCTOR_SHA_ALAM">DOCTOR_SHA_ALAM</option>
              <option value="TRUE_CARE_HELLING_CENTER">
                TRUE_CARE_HELLING_CENTER
              </option>
            </select>
            <FormFieldError message={errors.siteRef?.message} />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              Status
            </span>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <FormFieldError message={errors.status?.message} />
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-3">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={isClosed}
              onChange={(event) => handleIsClosedChange(event.target.checked)}
            />
            <span className="text-label-md font-medium text-on-surface">
              Closed for booking
            </span>
          </label>
        </div>

        {!isClosed && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-title-md font-semibold text-on-surface">
                Slots
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Add slot codes, labels, times, and daily seat limits.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={loadDefaultSlots}>
                Load Default Slots
              </Button>
              <Button
                variant="ghost"
                onClick={() => append(createEmptySlot())}
                leftIcon={<Icon name="add" size={18} />}
              >
                Add Slot
              </Button>
            </div>
          </div>

          <FormFieldError message={errors.slots?.message} />

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-label-lg font-semibold text-on-surface">
                    Slot {index + 1}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-error-container/50 hover:text-error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Icon name="delete" size={18} />
                    Remove
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-label-md font-medium text-on-surface">
                      Code
                    </span>
                    <Input {...register(`slots.${index}.code`)} />
                    <FormFieldError message={errors.slots?.[index]?.code?.message} />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-label-md font-medium text-on-surface">
                      Label
                    </span>
                    <Input {...register(`slots.${index}.label`)} />
                    <FormFieldError message={errors.slots?.[index]?.label?.message} />
                  </label>

                  {/* <label className="flex flex-col gap-2">
                    <span className="text-label-md font-medium text-on-surface">
                      SMS Label
                    </span>
                    <Input {...register(`slots.${index}.smsLabel`)} />
                    <FormFieldError
                      message={errors.slots?.[index]?.smsLabel?.message}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-label-md font-medium text-on-surface">
                      Start Time
                    </span>
                    <Input type="time" {...register(`slots.${index}.startTime`)} />
                    <FormFieldError
                      message={errors.slots?.[index]?.startTime?.message}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-label-md font-medium text-on-surface">
                      End Time
                    </span>
                    <Input type="time" {...register(`slots.${index}.endTime`)} />
                    <FormFieldError
                      message={errors.slots?.[index]?.endTime?.message}
                    />
                  </label> */}

                  <label className="flex flex-col gap-2">
                    <span className="text-label-md font-medium text-on-surface">
                      Seat Limit
                    </span>
                    <Input
                      type="number"
                      min={0}
                      {...register(`slots.${index}.seatLimit`, {
                        valueAsNumber: true,
                      })}
                    />
                    <FormFieldError
                      message={errors.slots?.[index]?.seatLimit?.message}
                    />
                  </label>

                  {/* <label className="flex items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={field.isActive}
                      {...register(`slots.${index}.isActive`, {
                        onChange: (event) =>
                          setValue(
                            `slots.${index}.isActive`,
                            event.target.checked,
                          ),
                      })}
                    />
                    <span className="text-label-md font-medium text-on-surface">
                      Active
                    </span>
                  </label> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        <div className="flex justify-end gap-3 border-t border-outline-variant/30 pt-5">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Schedule"
                : "Create Schedule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

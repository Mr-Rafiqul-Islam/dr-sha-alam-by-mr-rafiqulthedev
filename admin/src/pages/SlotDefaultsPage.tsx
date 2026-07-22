import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button, Icon, Input, PageHeader } from "../components/common";
import {
  useGetSlotDefaultsQuery,
  useUpdateSlotDefaultsMutation,
} from "../store/api/slotDefaultsApi";
import type { SiteRef } from "../types/appointmentSchedule";

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

const slotDefaultsFormSchema = z.object({
  siteRef: z.enum(["DOCTOR_SHA_ALAM", "TRUE_CARE_HELLING_CENTER"]),
  defaultSeatLimit: z.coerce
    .number()
    .int("Default seat limit must be a whole number")
    .min(0, "Default seat limit cannot be negative"),
  slots: z.array(slotSchema).min(1, "At least one slot is required"),
});

type SlotDefaultsFormValues = z.infer<typeof slotDefaultsFormSchema>;

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

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") {
      return data.message;
    }
  }
  return fallback;
}

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-label-sm text-error">{message}</p>;
}

export function SlotDefaultsPage() {
  const [siteRef, setSiteRef] = useState<SiteRef>("DOCTOR_SHA_ALAM");
  const { data, isLoading, isError, refetch } = useGetSlotDefaultsQuery(siteRef);
  const [updateSlotDefaults, { isLoading: isSaving }] =
    useUpdateSlotDefaultsMutation();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<SlotDefaultsFormValues>({
    resolver: zodResolver(slotDefaultsFormSchema),
    defaultValues: {
      siteRef: "DOCTOR_SHA_ALAM",
      defaultSeatLimit: 50,
      slots: [createEmptySlot()],
    },
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "slots",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      siteRef: data.siteRef,
      defaultSeatLimit: data.defaultSeatLimit,
      slots: data.slots.map((slot) => ({
        code: slot.code,
        label: slot.label,
        smsLabel: slot.smsLabel ?? "",
        startTime: slot.startTime,
        endTime: slot.endTime ?? "",
        seatLimit: slot.seatLimit,
        isActive: slot.isActive,
      })),
    });
  }, [data, reset]);

  useEffect(() => {
    setValue("siteRef", siteRef);
  }, [setValue, siteRef]);

  const handleFormSubmit: SubmitHandler<SlotDefaultsFormValues> = async (
    values,
  ) => {
    try {
      await updateSlotDefaults({
        siteRef: values.siteRef,
        defaultSeatLimit: values.defaultSeatLimit,
        slots: values.slots.map((slot) => ({
          code: slot.code.trim(),
          label: slot.label.trim(),
          smsLabel: slot.smsLabel?.trim() || null,
          startTime: slot.startTime.trim(),
          endTime: slot.endTime?.trim() || null,
          seatLimit: slot.seatLimit,
          isActive: slot.isActive,
        })),
      }).unwrap();
      toast.success("Slot defaults saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save slot defaults"));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Slot Defaults"
        subtitle="Configure default appointment slots and seat limits used when creating schedules and booking forms."
      />

      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 sm:p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-label-md font-medium text-on-surface">
              Site
            </span>
            <select
              value={siteRef}
              onChange={(event) =>
                setSiteRef(event.target.value as SiteRef)
              }
              className="w-full rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="DOCTOR_SHA_ALAM">DOCTOR_SHA_ALAM</option>
              {/* <option value="TRUE_CARE_HELLING_CENTER">
                TRUE_CARE_HELLING_CENTER
              </option> */}
            </select>
          </label>

          {data?.updatedAt ? (
            <div className="flex items-end">
              <p className="text-body-sm text-on-surface-variant">
                Last updated: {new Date(data.updatedAt).toLocaleString()}
              </p>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading...</p>
        ) : isError ? (
          <div className="space-y-3">
            <p className="text-body-md text-error">
              Failed to load slot defaults.
            </p>
            <Button variant="ghost" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <label className="flex max-w-sm flex-col gap-2">
              <span className="text-label-md font-medium text-on-surface">
                Default Seat Limit
              </span>
              <Input
                type="number"
                min={0}
                {...register("defaultSeatLimit", { valueAsNumber: true })}
              />
              <p className="text-body-sm text-on-surface-variant">
                Used when creating schedules with defaults if a slot has no
                explicit seat limit.
              </p>
              <FormFieldError message={errors.defaultSeatLimit?.message} />
            </label>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-title-md font-semibold text-on-surface">
                    Default Slots
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    These slots appear in booking forms and schedule templates.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => append(createEmptySlot())}
                  leftIcon={<Icon name="add" size={18} />}
                >
                  Add Slot
                </Button>
              </div>

              <FormFieldError message={errors.slots?.message} />

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4"
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
                        <FormFieldError
                          message={errors.slots?.[index]?.code?.message}
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-label-md font-medium text-on-surface">
                          Label
                        </span>
                        <Input {...register(`slots.${index}.label`)} />
                        <FormFieldError
                          message={errors.slots?.[index]?.label?.message}
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-label-md font-medium text-on-surface">
                          SMS Label
                        </span>
                        <Input {...register(`slots.${index}.smsLabel`)} />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-label-md font-medium text-on-surface">
                          Start Time
                        </span>
                        <Input
                          type="time"
                          {...register(`slots.${index}.startTime`)}
                        />
                        <FormFieldError
                          message={errors.slots?.[index]?.startTime?.message}
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-label-md font-medium text-on-surface">
                          End Time
                        </span>
                        <Input
                          type="time"
                          {...register(`slots.${index}.endTime`)}
                        />
                      </label>

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

                      <label className="flex items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-low px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-primary"
                          {...register(`slots.${index}.isActive`)}
                        />
                        <span className="text-label-md font-medium text-on-surface">
                          Active
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-outline-variant/30 pt-5">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Defaults"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

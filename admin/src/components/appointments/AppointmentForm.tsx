import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "../common/Button";
import { CommonFormFields } from "../forms/CommonForm";
import { getClosedDates } from "../../lib/appointmentSchedules";
import { useGetAppointmentSchedulesQuery } from "../../store/api/appointmentSchedulesApi";
import { useGetSlotDefaultsQuery } from "../../store/api/slotDefaultsApi";
import type { AppointmentFormData } from "../../types/appointment";
import type { FormFieldConfig } from "../../types/form";
import {
  getMinPreferredDateYmd,
  isValidPreferredDateYmd,
} from "../../utils/appointment";

export type { AppointmentFormData } from "../../types/appointment";

const defaultValues: AppointmentFormData = {
  patientName: "",
  age: "",
  phone: "",
  email: "",
  homeAddress: "",
  symptoms: "",
  preferredDate: "",
  preferredTime: "",
};

type AppointmentFormProps = {
  onSubmit: (data: AppointmentFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function AppointmentForm({
  onSubmit,
  isSubmitting,
  submitLabel = "Book Appointment",
}: AppointmentFormProps) {
  const { data: slotDefaults, isLoading: slotDefaultsLoading } =
    useGetSlotDefaultsQuery("DOCTOR_SHA_ALAM");

  const {
    data: schedules,
    isLoading: schedulesLoading,
    isError: schedulesError,
  } = useGetAppointmentSchedulesQuery();

  const closedDates = useMemo(
    () => getClosedDates(schedules ?? []),
    [schedules],
  );

  const slotCodes =
    slotDefaults?.slots
      .filter((slot) => slot.isActive)
      .map((slot) => slot.code) ?? [];

  const timeSlotOptions = [
    { value: "", label: "Select Time Slot", disabled: true },
    ...(slotDefaults?.slots
      .filter((slot) => slot.isActive)
      .map((slot) => ({
        value: slot.code,
        label: slot.label,
      })) ?? []),
  ];

  if (slotDefaultsLoading || schedulesLoading) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Loading appointment slots...
      </p>
    );
  }

  return (
    <AppointmentFormFields
      closedDates={closedDates}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      schedulesError={schedulesError}
      slotCodes={slotCodes}
      submitLabel={submitLabel}
      timeSlotOptions={timeSlotOptions}
    />
  );
}

function AppointmentFormFields({
  closedDates,
  isSubmitting,
  onSubmit,
  schedulesError,
  slotCodes,
  submitLabel,
  timeSlotOptions,
}: {
  closedDates: Set<string>;
  isSubmitting?: boolean;
  onSubmit: (data: AppointmentFormData) => void | Promise<void>;
  schedulesError: boolean;
  slotCodes: string[];
  submitLabel: string;
  timeSlotOptions: Array<{ value: string; label: string; disabled?: boolean }>;
}) {
  const appointmentSchema = z
    .object({
      patientName: z.string().min(1, "Full name is required"),
      age: z.string().optional(),
      phone: z.string().min(1, "Phone number is required"),
      email: z.union([
        z.literal(""),
        z.string().email("Enter a valid email address"),
      ]),
      homeAddress: z.string().min(1, "Home address is required"),
      symptoms: z.string().optional(),
      preferredDate: z.string().min(1, "Preferred date is required"),
      preferredTime: z
        .string()
        .min(1, "Preferred time is required")
        .refine(
          (value) => slotCodes.length === 0 || slotCodes.includes(value),
          "Select a valid time slot",
        ),
    })
    .superRefine((data, ctx) => {
      if (!data.preferredDate) {
        return;
      }

      if (closedDates.has(data.preferredDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The chamber is closed on this date.",
          path: ["preferredDate"],
        });
        return;
      }

      if (!isValidPreferredDateYmd(data.preferredDate, data.preferredTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Past dates are not allowed",
          path: ["preferredDate"],
        });
      }
    });

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  const preferredTime =
    useWatch({ control: form.control, name: "preferredTime" }) ?? "";
  const minPreferredDate = getMinPreferredDateYmd(preferredTime);

  useEffect(() => {
    const preferredDate = form.getValues("preferredDate");
    if (
      preferredDate &&
      !isValidPreferredDateYmd(preferredDate, preferredTime)
    ) {
      form.setValue("preferredDate", "", { shouldValidate: true });
    }
  }, [preferredTime, form]);

  const appointmentFields: FormFieldConfig[] = useMemo(
    () => [
      {
        name: "patientName",
        label: "Full Name *",
        type: "text",
        placeholder: "Enter patient's name",
      },
      {
        name: "age",
        label: "Age",
        type: "text",
        placeholder: "e.g. 35",
      },
      {
        name: "phone",
        label: "Phone Number *",
        type: "tel",
        placeholder: "017XXXXXXXX",
      },
      {
        name: "preferredTime",
        label: "Preferred Time *",
        type: "select",
        options: timeSlotOptions,
      },
      {
        name: "preferredDate",
        label: "Preferred Date *",
        type: "date",
        useAppointmentSchedules: true,
        closedDates,
        schedulesLoading: false,
        schedulesError: schedulesError
          ? "Could not load chamber availability"
          : null,
        minDate: minPreferredDate,
      },
      {
        name: "homeAddress",
        label: "Home Address *",
        type: "text",
        placeholder: "Dhaka, Bangladesh",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "email@example.com",
      },
      {
        name: "symptoms",
        label: "Describe Your Problem",
        type: "textarea",
        placeholder: "Briefly describe the symptoms or condition...",
      },
    ],
    [
      closedDates,
      minPreferredDate,
      schedulesError,
      timeSlotOptions,
    ],
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <CommonFormFields
        control={form.control}
        fields={appointmentFields}
        disabled={isSubmitting}
      />

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full justify-center disabled:pointer-events-none disabled:opacity-50"
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

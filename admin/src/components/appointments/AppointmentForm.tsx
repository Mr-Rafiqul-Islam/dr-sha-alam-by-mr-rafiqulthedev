import { useMemo } from "react";

import { z } from "zod";

import { CommonForm } from "../forms";

import { getClosedDates } from "../../lib/appointmentSchedules";

import { useGetAppointmentSchedulesQuery } from "../../store/api/appointmentSchedulesApi";

import { useGetSlotDefaultsQuery } from "../../store/api/slotDefaultsApi";

import type { AppointmentFormData } from "../../types/appointment";

import type { FormFieldConfig } from "../../types/form";

import { isFutureDateYmd } from "../../utils/appointment";

export type { AppointmentFormData } from "../../types/appointment";

const defaultValues: AppointmentFormData = {
  patientName: "",

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

  const appointmentSchema = z.object({
    patientName: z.string().min(1, "Full name is required"),

    phone: z.string().min(1, "Phone number is required"),

    email: z.union([
      z.literal(""),

      z.string().email("Enter a valid email address"),
    ]),

    homeAddress: z.string().min(1, "Home address is required"),

    symptoms: z.string().optional(),

    preferredDate: z

      .string()

      .min(1, "Preferred date is required")

      .refine(isFutureDateYmd, "Only future dates are allowed")

      .refine(
        (value) => !closedDates.has(value),

        "The chamber is closed on this date.",
      ),

    preferredTime: z

      .string()

      .min(1, "Preferred time is required")

      .refine(
        (value) => slotCodes.length === 0 || slotCodes.includes(value),

        "Select a valid time slot",
      ),
  });

  const timeSlotOptions = [
    { value: "", label: "Select Time Slot", disabled: true },

    ...(slotDefaults?.slots

      .filter((slot) => slot.isActive)

      .map((slot) => ({
        value: slot.code,

        label: slot.label,
      })) ?? []),
  ];

  const appointmentFields: FormFieldConfig[] = [
    {
      name: "patientName",

      label: "Full Name *",

      type: "text",

      placeholder: "Enter patient's name",
    },
    
    {
      name: "phone",

      label: "Phone Number *",

      type: "tel",

      placeholder: "017XXXXXXXX",
    },
    
    {
      name: "preferredDate",

      label: "Preferred Date *",

      type: "date",

      useAppointmentSchedules: true,

      closedDates,

      schedulesLoading,

      schedulesError: schedulesError
        ? "Could not load chamber availability"
        : null,
    },

    {
      name: "preferredTime",

      label: "Preferred Time *",

      type: "select",

      options: timeSlotOptions,
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

  ];

  if (slotDefaultsLoading || schedulesLoading) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Loading appointment slots...
      </p>
    );
  }

  return (
    <CommonForm
      schema={appointmentSchema}
      defaultValues={defaultValues}
      fields={appointmentFields}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitWrapperClassName="pt-2"
      submitClassName="w-full justify-center"
    />
  );
}

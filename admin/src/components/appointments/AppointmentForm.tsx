import { z } from "zod";

import { CommonForm } from "../forms";
import type { FormFieldConfig } from "../../types/form";

const TIME_SLOT_OPTIONS = [
  { value: "", label: "Select Time Slot", disabled: true },
  { value: "P-9", label: "PLID (Present at - 9:00 AM)" },
  { value: "OP-4", label: "Old PLID (Present at - 4:00 PM)" },
  { value: "G-5", label: "Genreral Patient (Present at - 5:00 PM)" },
] as const;

const appointmentSchema = z.object({
  patientName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.union([
    z.literal(""),
    z.string().email("Enter a valid email address"),
  ]),
  homeAddress: z.string().min(1, "Home address is required"),
  symptoms: z.string().optional(),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

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
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "email@example.com",
  },
  {
    name: "homeAddress",
    label: "Home Address *",
    type: "text",
    placeholder: "Kalighat, Sreemangal, Sylhet",
  },
  {
    name: "symptoms",
    label: "Describe Your Problem",
    type: "textarea",
    placeholder: "Briefly describe the symptoms or condition...",
  },
  {
    name: "preferredDate",
    label: "Preferred Date *",
    type: "date",
  },
  {
    name: "preferredTime",
    label: "Preferred Time *",
    type: "select",
    options: [...TIME_SLOT_OPTIONS],
  },
];

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

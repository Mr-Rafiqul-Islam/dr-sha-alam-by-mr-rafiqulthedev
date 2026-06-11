import { z } from "zod";

import { CommonForm } from "../forms";
import type { FormFieldConfig } from "../../types/form";

const TIME_SLOT_OPTIONS = [
  { value: "", label: "Select Time Slot", disabled: true },
  { value: "plid-9am", label: "PLID (Present at - 9:00 AM)" },
  { value: "old-plid-4pm", label: "Old PLID (Present at - 4:00 PM)" },
  { value: "general-5pm", label: "Genreral Patient (Present at - 5:00 PM)" },
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
};

export function AppointmentForm({ onSubmit, isSubmitting }: AppointmentFormProps) {
  return (
    <CommonForm
      schema={appointmentSchema}
      defaultValues={defaultValues}
      fields={appointmentFields}
      submitLabel="Book Appointment"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitWrapperClassName="pt-2"
      submitClassName="w-full justify-center"
      formFooter={
        <p className="text-center text-label-sm text-on-surface-variant mt-4">
          By booking, you agree to our Terms of Service and Privacy Policy.
        </p>
      }
    />
  );
}

"use client";

import { FormEvent, useState } from "react";
import { getMetaCookiesFromDocument, trackMetaEvent } from "@/lib/metaAnalytics";
import { submitContactMessage } from "@/server-actions/submitContactMessage";

const SUBJECT_OPTIONS = [
  { value: "plid-consultation", label: "PLID Consultation" },
  { value: "general-consultation", label: "General Consultation" },
  { value: "online-consultation", label: "Online Consultation" },
  { value: "yoga-program", label: "Yoga Program" },
  { value: "technical-support", label: "Technical Support" },
  { value: "collaboration", label: "Collaboration" },
] as const;

type FormState = {
  name: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormState: FormState = {
  name: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const subjectLabel =
      SUBJECT_OPTIONS.find((option) => option.value === form.subject)?.label ??
      form.subject;

    if (!form.name.trim() || !form.phone.trim() || !subjectLabel.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventId = crypto.randomUUID();
      const metaCookies = getMetaCookiesFromDocument();

      const result = await submitContactMessage({
        name: form.name,
        phone: form.phone,
        subject: subjectLabel,
        message: form.message || undefined,
        fbEventId: eventId,
        ...metaCookies,
      });

      trackMetaEvent("Lead", {}, eventId);
      setSuccessMessage(result.message);
      setForm(initialFormState);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit contact message",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 bg-background-light dark:bg-background-dark p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
          Send Us A Message
        </h2>
        <p className="text-text-sub text-sm">
          Have questions about your condition, treatment options, MRI findings,
          online consultation, or appointment booking?<br /> Fill out the form below
          and our team will get back to you as soon as possible.
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            {successMessage}
          </p>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              person
            </span>
            <input
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Your Name"
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
          Phone / WhatsApp Number
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              call
            </span>
            <input
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Your Phone Number"
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
          How Can We Help You?
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
              medical_services
            </span>
            <select
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer"
              required
            >
              <option disabled value="">
                Select a Service
              </option>
              {SUBJECT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              expand_more
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
            Your Message
          </label>
          <textarea
            className="w-full px-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm"
            placeholder="Tell us about your condition or query..."
            rows={5}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00CBC0] hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">send</span>
          {isSubmitting ? "Sending..." : "Send My Request"}
        </button>
      </form>
    </div>
  );
}

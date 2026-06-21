"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { getMetaCookiesFromDocument, trackMetaEvent } from '@/lib/metaAnalytics';
import { submitContactMessage } from '@/server-actions/submitContactMessage';

const SUBJECT_OPTIONS = [
  { value: "general-consultation", label: "General Consultation" },
  { value: "plid-consultation", label: "PLID Consultation" },
  { value: "online-consultation", label: "Online Consultation" },
  { value: "technical-support", label: "Technical Support" },
  { value: "collaboration", label: "Collaboration" },
  { value: "feedback", label: "Feedback" },
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
  subject: "general-consultation",
  message: "",
};

export default function HomeContactSection() {
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
    <ScrollReveal direction="up">
      <section className="lg:py-24 py-12 bg-white dark:bg-surface-dark" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-10 lg:p-16 bg-white dark:bg-surface-dark">
              <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Get in Touch</h2>
              <h3 className="text-3xl font-extrabold text-primary dark:text-white mb-2">Start Your Recovery Journey Today</h3>
              <p className="text-text-sub text-lg mb-8">
              Book your consultation and receive personalized guidance for your condition.
              </p>
              <form className="space-y-5" onSubmit={handleSubmit}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-main dark:text-gray-300">Name</label>
                    <input
                      className="w-full px-5 py-3.5 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Your Name"
                      type="text"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-main dark:text-gray-300">Phone</label>
                    <input
                      className="w-full px-5 py-3.5 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Phone Number"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-main dark:text-gray-300">Help Needed</label>
                  <div className="relative">
                    <select
                      className="w-full px-5 py-3.5 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                      value={form.subject}
                      onChange={(event) => updateField("subject", event.target.value)}
                      required
                    >
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-main dark:text-gray-300">Message</label>
                  <textarea
                    className="w-full px-5 py-3.5 rounded-xl bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="How can we help you?"
                    rows={4}
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-accent/40 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? "Sending..." : "Send Appointment Request"}
                </button>
              </form>
            </div>
            <div className="lg:w-1/2 bg-primary dark:bg-primary-dark p-10 lg:p-16 text-white relative flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-dark/50 to-transparent pointer-events-none"></div>
              <div className="relative z-10 space-y-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div>
                        <p className="font-bold mb-1">TruCare Diagnostic Centre</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                        49, Mohakhali, Beside Square Centre, Wireless Gate,<br/>
                          Mohakhali, Dhaka 1212, Bangladesh
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">call</span>
                      </div>
                      <div>
                        <p className="font-bold mb-1">Call Us</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                        09613-668866
                        <br/>
                        01701-313001
                        <br/>
                        01701-313002
                        <br/>
                        help@doctorshahalam.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <p className="font-bold mb-1">Working Hours</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          Sat - Thu: 7:00 AM – 10:00 PM<br/>
                          Friday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 h-64 w-full bg-white/10 rounded-2xl overflow-hidden relative group border border-white/10 shadow-inner">
                <Image alt="Map location of clinic" className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_XhY7dbV--FNwz0DYaTdRVQBV5ha5qA3L3XmuwNFJX1yy41E10_9m10F2DQ0ABe1GjW0GeBCf629me4oyOPdwKV9vh5gRLKBkqx6OXbTWN2CmAqxR6BG7PbsPgAZ5Ot6zj6CUtcCTFxC15Xrrh3ZyIG3cTPwh06eOF6CKbuwtGd_SWTGoxjnzMowTIHoFqS3sXLeiZzdFSIZHEaSE5wAoNYUILy-fa0s7D-WIx4F33zdJvRwpDP6yUZiV2yH4hxMvuSPtnzfboRk" fill sizes="100vw" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href="https://maps.app.goo.gl/9QeTRrQ9PtqQk6Rj8" target="_blank" rel="noopener noreferrer" className="bg-white text-primary px-5 py-2.5 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                    View on Google Maps
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

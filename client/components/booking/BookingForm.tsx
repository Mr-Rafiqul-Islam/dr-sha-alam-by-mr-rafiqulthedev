"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl, getDefaultDoctorId } from "@/lib/api";

const TIME_SLOTS = [
  { value: "P-9", label: "PLID (Present at - 9:00 AM)" },
  { value: "OP-4", label: "Old PLID (Present at - 4:00 PM)" },
  { value: "G-5", label: "General Patient (Present at - 5:00 PM)" },
] as const;

type BookingMode = "free" | "paid";

type FormState = {
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  homeAddress: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
};

const initialFormState: FormState = {
  fullName: "",
  phoneNumber: "",
  email: "",
  gender: "",
  homeAddress: "",
  problem: "",
  preferredDate: "",
  preferredTime: "",
};

export default function BookingForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [bookingMode, setBookingMode] = useState<BookingMode>("free");
  const [isSubmittingFree, setIsSubmittingFree] = useState(false);
  const [isSubmittingPaid, setIsSubmittingPaid] = useState(false);
  const [freeError, setFreeError] = useState<string | null>(null);
  const [paidError, setPaidError] = useState<string | null>(null);

  const isSubmitting = isSubmittingFree || isSubmittingPaid;
  const activeError = bookingMode === "free" ? freeError : paidError;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleModeChange = (mode: BookingMode) => {
    setBookingMode(mode);
    setFreeError(null);
    setPaidError(null);
  };

  const submitFreeBooking = async () => {
    const apiBaseUrl = getApiBaseUrl();
    if (!apiBaseUrl) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/client/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim() || undefined,
        homeAddress: form.homeAddress.trim(),
        problem: form.problem.trim() || undefined,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
      }),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      throw new Error(data.message ?? "Failed to submit appointment request");
    }

    router.push("/booking-success");
  };

  const submitPaidBooking = async () => {
    const apiBaseUrl = getApiBaseUrl();
    if (!apiBaseUrl) {
      throw new Error("API URL is not configured");
    }

    const doctorId = getDefaultDoctorId();
    const payload: Record<string, string> = {
      name: form.fullName.trim(),
      phone: form.phoneNumber.trim(),
      homeAddress: form.homeAddress.trim(),
      preferredTime: form.preferredTime,
      appointmentDate: form.preferredDate,
      siteRef: "DOCTOR_SHA_ALAM",
    };

    if (doctorId) {
      payload.doctorId = doctorId;
    }
    if (form.email.trim()) {
      payload.email = form.email.trim();
    }
    if (form.gender.trim()) {
      payload.gender = form.gender.trim();
    }
    if (form.problem.trim()) {
      payload.problem = form.problem.trim();
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/payment/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      message?: string;
      url?: string;
    };

    if (!response.ok) {
      throw new Error(data.message ?? "Failed to start payment");
    }

    if (!data.url) {
      throw new Error("Payment gateway URL was not returned");
    }

    window.location.href = data.url;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFreeError(null);
    setPaidError(null);

    if (bookingMode === "free") {
      setIsSubmittingFree(true);
      try {
        await submitFreeBooking();
      } catch (submitError) {
        const message =
          submitError instanceof Error
            ? submitError.message
            : "Failed to submit appointment request";
        setFreeError(message);
      } finally {
        setIsSubmittingFree(false);
      }
      return;
    }

    setIsSubmittingPaid(true);
    try {
      await submitPaidBooking();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to start payment";
      setPaidError(message);
      setIsSubmittingPaid(false);
    }
  };

  const submitLabel =
    bookingMode === "free"
      ? isSubmittingFree
        ? "Submitting..."
        : "Request Appointment"
      : isSubmittingPaid
        ? "Redirecting to payment..."
        : "Pay consultation fee and book appointment";

  return (
    <section
      className="py-20 bg-background-light dark:bg-background-dark"
      id="booking-form"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-soft p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white mb-4 text-center">
            Request Your Consultation
          </h2>
          <p className="text-text-sub text-sm text-center mb-8">
            Complete the form below and choose how you would like to book your
            appointment.
          </p>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <p className="text-sm font-bold text-text-main dark:text-gray-300">
                Booking Option
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                    bookingMode === "free"
                      ? "border-accent bg-accent/5"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <input
                    checked={bookingMode === "free"}
                    className="mt-1"
                    name="bookingMode"
                    type="radio"
                    value="free"
                    onChange={() => handleModeChange("free")}
                  />
                  <span>
                    <span className="block text-sm font-bold text-text-main dark:text-white">
                      Free appointment
                    </span>
                    <span className="block text-xs text-text-sub mt-1">
                      Submit a request and our team will confirm your slot.
                    </span>
                  </span>
                </label>
                <label
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                    bookingMode === "paid"
                      ? "border-accent bg-accent/5"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <input
                    checked={bookingMode === "paid"}
                    className="mt-1"
                    name="bookingMode"
                    type="radio"
                    value="paid"
                    onChange={() => handleModeChange("paid")}
                  />
                  <span>
                    <span className="block text-sm font-bold text-text-main dark:text-white">
                      Pay consultation fee and book appointment
                    </span>
                    <span className="block text-xs text-text-sub mt-1">
                      Pay securely via SSLCommerz to confirm instantly.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="Enter patient's name"
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="017XXXXXXXX"
                  required
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(event) =>
                    updateField("phoneNumber", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Gender
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all appearance-none"
                    value={form.gender}
                    onChange={(event) => updateField("gender", event.target.value)}
                  >
                    <option value="">Select gender (optional)</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Home Address <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="Kalighat, Sreemangal, Sylhet"
                  required
                  type="text"
                  value={form.homeAddress}
                  onChange={(event) =>
                    updateField("homeAddress", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                Describe Your Problem
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                placeholder="Briefly describe the symptoms or condition..."
                rows={3}
                value={form.problem}
                onChange={(event) => updateField("problem", event.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                  type="date"
                  value={form.preferredDate}
                  onChange={(event) =>
                    updateField("preferredDate", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all appearance-none"
                    required
                    value={form.preferredTime}
                    onChange={(event) =>
                      updateField("preferredTime", event.target.value)
                    }
                  >
                    <option value="">Select Time Slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {activeError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {activeError}
              </p>
            ) : null}

            <div className="pt-4">
              <button
                className="w-full bg-[#00CBC0] hover:bg-[#00a89f] disabled:opacity-70 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                disabled={isSubmitting}
                type="submit"
              >
                {submitLabel}
                <span className="material-symbols-outlined">
                  {bookingMode === "paid" ? "payments" : "calendar_month"}
                </span>
              </button>
              <p className="text-center text-xs text-text-sub mt-4">
                By submitting this form, you agree to our Privacy Policy and
                Terms & Conditions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

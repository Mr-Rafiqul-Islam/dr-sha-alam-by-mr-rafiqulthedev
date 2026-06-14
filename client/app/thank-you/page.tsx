"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { getApiBaseUrl } from "@/lib/api";

type AppointmentSummary = {
  name: string;
  homeAddress: string;
  appointmentDate: string;
  preferredTime: string;
  serialNumber: number;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const [appointment, setAppointment] = useState<AppointmentSummary | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setLoadFailed(true);
      return;
    }

    const id = appointmentId;
    let cancelled = false;

    async function loadAppointment() {
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        setLoadFailed(true);
        return;
      }

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/v1/client/appointments/${encodeURIComponent(id)}`,
        );
        const data = (await response.json()) as {
          success?: boolean;
          appointment?: AppointmentSummary;
        };

        if (!response.ok || !data.appointment) {
          throw new Error("Appointment not found");
        }

        if (!cancelled) {
          setAppointment(data.appointment);
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
        }
      }
    }

    void loadAppointment();

    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 lg:py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-3xl w-full px-4 sm:px-6">
        <ScrollReveal direction="up" className="text-center mb-12">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-6xl text-accent">
              check_circle
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white mb-4 tracking-tight">
            Payment Successful
          </h1>
          <p className="text-sm lg:text-base text-text-sub dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
            Thank you. Your appointment has been confirmed after successful
            payment. Please save your serial number and arrive on time.
          </p>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={0.1}
          className="bg-background-light dark:bg-background-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 mb-12 shadow-sm"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Appointment Summary
          </h3>

          {appointment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-text-sub mb-1">Patient Name</p>
                <p className="text-lg font-bold text-text-main dark:text-white">
                  {appointment.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-sub mb-1">Serial Number</p>
                <p className="text-lg font-bold text-text-main dark:text-white">
                  #{appointment.serialNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-sub mb-1">Appointment Date</p>
                <p className="text-lg font-bold text-text-main dark:text-white">
                  {formatDate(appointment.appointmentDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-sub mb-1">Preferred Time</p>
                <p className="text-lg font-bold text-text-main dark:text-white">
                  {appointment.preferredTime}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-text-sub mb-1">Home Address</p>
                <p className="text-base font-medium text-text-main dark:text-white">
                  {appointment.homeAddress}
                </p>
              </div>
            </div>
          ) : loadFailed ? (
            <p className="text-sm text-text-sub">
              Your payment was successful. Appointment details will be sent to
              your phone shortly.
            </p>
          ) : (
            <p className="text-sm text-text-sub">Loading appointment details...</p>
          )}
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={0.2}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          <Link
            href="/patient-guidelines"
            className="flex items-center p-5 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-accent hover:shadow-md transition-all group bg-background-light dark:bg-background-dark"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary group-hover:text-accent transition-colors shadow-sm mr-4">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h5 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                Patient Guidelines
              </h5>
              <p className="text-xs text-text-sub mt-1">What to bring & expect</p>
            </div>
          </Link>
          <Link
            href="https://maps.app.goo.gl/9QeTRrQ9PtqQk6Rj8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-5 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-accent hover:shadow-md transition-all group bg-background-light dark:bg-background-dark"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary group-hover:text-accent transition-colors shadow-sm mr-4">
              <span className="material-symbols-outlined">map</span>
            </div>
            <div>
              <h5 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                Directions to Clinic
              </h5>
              <p className="text-xs text-text-sub mt-1">Google Maps Location</p>
            </div>
          </Link>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3} className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            Back to Home
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center py-24 text-text-sub">
          Loading...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}

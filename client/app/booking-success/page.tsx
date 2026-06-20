"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { getAppointmentById } from "@/server-actions/getAppointmentById";
import type { PublicAppointmentSummary } from "@/types/booking";
import Image from "next/image";

type AppointmentSummary = PublicAppointmentSummary;

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
      try {
        const data = await getAppointmentById(id);

        if (!cancelled) {
          setAppointment(data);
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
            Appointment Request Received Successfully 🎉
          </h1>
          <p className="text-sm lg:text-base text-text-sub dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
            Thank You For Taking The First Step Toward Recovery. <br /> Your
            appointment request has been successfully submitted. Our team is now
            reviewing your information and will contact you shortly to confirm
            your consultation schedule. We look forward to helping you
            understand your condition, explore your treatment options, and move
            toward a healthier, more active life.
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

        <ScrollReveal direction="up" delay={0.2} className="mb-12">
          <h3 className="text-xl font-bold text-text-main dark:text-white mb-8 text-center">
            Your Recovery Journey Starts Here
          </h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            <div className="space-y-8 md:space-y-0 relative">
              <div className="flex flex-col md:flex-row items-center justify-between w-full md:mb-8">
                <div className="w-full md:w-5/12 md:text-right order-2 md:order-1 pt-2 md:pt-0">
                  <h4 className="font-bold text-lg text-primary dark:text-accent">
                    We review your request
                  </h4>
                  <p className="text-sm text-text-sub mt-1">
                    Our patient support team carefully reviews your information
                    and appointment preferences.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10 border-4 border-white dark:border-surface-dark mb-2 md:mb-0 order-1 md:order-2">
                  1
                </div>
                <div className="w-full md:w-5/12 order-3 md:order-3"></div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full md:mb-8">
                <div className="w-full md:w-5/12 order-3 md:order-1"></div>
                <div className="w-10 h-10 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center font-bold z-10 md:border-4 md:border-white dark:md:border-surface-dark dark:bg-surface-dark dark:border-primary mb-2 md:mb-0 order-1 md:order-2">
                  2
                </div>
                <div className="w-full md:w-5/12 md:text-left order-2 md:order-3 pt-2 md:pt-0">
                  <h4 className="font-bold text-lg text-text-main dark:text-white">
                    We Contact You
                  </h4>
                  <p className="text-sm text-text-sub mt-1">
                    You will receive a phone call or WhatsApp message to confirm
                    your consultation details.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="w-full md:w-5/12 md:text-right order-2 md:order-1 pt-2 md:pt-0">
                  <h4 className="font-bold text-lg text-text-main dark:text-white">
                    Visit The Clinic
                  </h4>
                  <p className="text-sm text-text-sub mt-1">
                    Meet Dr. Shah Alam for a personalized evaluation and
                    treatment discussion. Please bring any MRI reports, X-rays,
                    prescriptions, or relevant medical documents.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold z-10 md:border-4 md:border-white dark:md:border-surface-dark dark:bg-surface-dark dark:border-gray-600 mb-2 md:mb-0 order-1 md:order-2">
                  3
                </div>
                <div className="w-full md:w-5/12 order-3 md:order-3"></div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={0.3}
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
              <p className="text-xs text-text-sub mt-1">
                What to bring &amp; expect
              </p>
            </div>
            <span className="material-symbols-outlined ml-auto text-gray-300 group-hover:text-accent">
              arrow_forward_ios
            </span>
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
            <span className="material-symbols-outlined ml-auto text-gray-300 group-hover:text-accent">
              arrow_forward_ios
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={0.4}
          className="flex flex-col sm:flex-row items-center gap-6 bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl mb-12 border border-primary/10"
        >
          <Image
            alt="Dr. Shah Alam"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            src="/sir-2.jpg"
            width={64}
            height={64}
            sizes="64px"
          />
          <div className="text-center sm:text-left">
            <p className="text-text-main dark:text-gray-200 italic font-medium">
              &quot;Thank you for trusting us with your health. Many patients
              come to us feeling confused, worried, or uncertain about what
              treatment is right for them. <br />
              Our goal is to help you understand your condition clearly, avoid
              unnecessary fear, and choose the most appropriate path toward
              recovery. I look forward to meeting you and supporting your
              journey toward better health. &quot;
            </p>
            <p className="text-sm font-bold text-primary mt-2">
              - Dr. Shah Alam
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={0.5}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          <Link
            href="https://wa.me/+8801312353577"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 sm:w-auto text-center bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            WhatsApp Support
          </Link>
          {/* <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border-2 border-gray-100 dark:border-gray-700 hover:border-accent hover:text-accent text-text-main dark:text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined">calendar_today</span>
            Add to Calendar
          </button> */}
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

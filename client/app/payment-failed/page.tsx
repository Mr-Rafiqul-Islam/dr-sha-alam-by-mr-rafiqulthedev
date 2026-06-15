"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const ERROR_MESSAGES: Record<string, string> = {
  no_tranId: "Invalid payment session. Please start booking again.",
  invalid_transaction: "Transaction not found. Please try booking again.",
  missing_val_id: "Payment verification failed. Please contact support if money was deducted.",
  validation_error: "We could not verify your payment. Please try again.",
  validation_failed: "Payment verification failed. Please try again or contact support.",
  today_or_past_date_not_allowed:
    "Please select a future appointment date and try again.",
  server_error: "Something went wrong while confirming your payment. Please try again.",
};

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") ?? "server_error";
  const message =
    ERROR_MESSAGES[errorCode] ??
    "Your payment could not be completed. Please try again.";

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 lg:py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-2xl w-full px-4 sm:px-6 text-center">
        <ScrollReveal direction="up" className="mb-8">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-6xl text-red-500">
              error
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white mb-4">
            Payment Failed
          </h1>
          <p className="text-sm lg:text-base text-text-sub dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <Link
            href="/appointment"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            Try Booking Again
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center py-24 text-text-sub">
          Loading...
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}

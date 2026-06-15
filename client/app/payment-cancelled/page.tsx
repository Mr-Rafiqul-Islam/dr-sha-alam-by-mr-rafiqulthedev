import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function PaymentCancelledPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 lg:py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-2xl w-full px-4 sm:px-6 text-center">
        <ScrollReveal direction="up" className="mb-8">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-6xl text-amber-500">
              cancel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white mb-4">
            Payment Cancelled
          </h1>
          <p className="text-sm lg:text-base text-text-sub dark:text-gray-300 leading-relaxed">
            Payment was cancelled and your appointment was not booked. You can
            return to the booking page and try again whenever you are ready.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <Link
            href="/appointment"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            Back to Booking
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}

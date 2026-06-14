import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactFAQ() {
  return (
    <section className="py-16 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
      <ScrollReveal
        direction="up"
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
          Have Questions Before Booking?
        </h2>
        <p className="text-text-sub mb-8">
          We understand that choosing the right treatment can feel overwhelming.
          Explore our patient resources or contact us directly for guidance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/faq"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-text-main dark:text-gray-200 hover:border-primary hover:text-primary transition-colors font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined">help</span>
            Frequently Asked Questions
          </Link>
          <Link
            href="/patient-guidelines"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-text-main dark:text-gray-200 hover:border-primary hover:text-primary transition-colors font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined">description</span>
            Patient Guidelines
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

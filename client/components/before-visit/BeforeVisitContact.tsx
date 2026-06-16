import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function BeforeVisitContact() {
  return (
    <section className="bg-white dark:bg-surface-dark pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          direction="up"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-10 md:p-14 shadow-soft text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">
            Still Have Questions Before Your Visit?
          </h2>
          <p className="text-text-sub mb-8 max-w-2xl mx-auto leading-relaxed">
            Our patient support team is ready to help.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white text-base font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 gap-2 mb-8"
          >
            <span className="material-symbols-outlined">support_agent</span>
            Contact Support
          </Link>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 mb-8">
            <a
              className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group w-full sm:w-auto justify-center"
              href="https://wa.me/+8801312353577"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <i className="fab fa-whatsapp text-xl"></i>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-semibold uppercase">WhatsApp Support</p>
                <p className="text-sm font-bold text-text-main dark:text-white">+880 1312 353 577</p>
              </div>
            </a>
            <a
              className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group w-full sm:w-auto justify-center"
              href="tel:+8801701313001"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-semibold uppercase">Call Our Team</p>
                <p className="text-sm font-bold text-text-main dark:text-white">+880 1701 313 001</p>
              </div>
            </a>
          </div>

          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 bg-[#00CBC0] hover:bg-accent-dark text-white text-base font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Appointment
            <span className="material-symbols-outlined text-lg">calendar_month</span>
          </Link>

          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
            <blockquote className="text-lg md:text-xl text-text-main dark:text-white italic leading-relaxed max-w-2xl mx-auto mb-4">
              &quot;The right treatment begins with the right understanding.&quot;
            </blockquote>
            <p className="font-handwriting text-xl font-bold text-primary italic">— Dr. Shah Alam</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

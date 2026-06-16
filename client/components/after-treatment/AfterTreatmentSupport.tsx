import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const supportActions = [
  {
    label: 'WhatsApp Support',
    href: 'https://wa.me/+8801312353577',
    external: true,
    icon: (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
        <i className="fab fa-whatsapp text-xl"></i>
      </div>
    ),
    detail: '+880 1312 353 577',
  },
  {
    label: 'Call Our Team',
    href: 'tel:+8801701313001',
    external: false,
    icon: (
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined">call</span>
      </div>
    ),
    detail: '+880 1701 313 001',
  },
];

export default function AfterTreatmentSupport() {
  return (
    <section className="py-16 lg:py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          direction="up"
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-10 md:p-14 shadow-soft text-center"
        >
          <p className="text-accent font-bold tracking-wider uppercase text-xs mb-3">
            SUPPORT
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">
            Need Help During Recovery?
          </h2>
          <p className="text-text-sub mb-8 max-w-2xl mx-auto leading-relaxed">
            If you have questions about symptoms, medications, exercises, follow-up
            appointments, or your recovery plan, our team is here to help.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 sm:gap-6 mb-8">
            {supportActions.map((action) => (
              <a
                key={action.label}
                className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group w-full sm:w-auto justify-center"
                href={action.href}
                {...(action.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {action.icon}
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    {action.label}
                  </p>
                  <p className="text-sm font-bold text-text-main dark:text-white">
                    {action.detail}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 bg-[#00CBC0] hover:bg-accent-dark text-white text-base font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Follow-Up Appointment
            <span className="material-symbols-outlined text-lg">calendar_month</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

import ScrollReveal from '@/components/ScrollReveal';

const links = [
  {
    href: '#before-visit',
    icon: 'calendar_clock',
    title: 'Before Your Visit',
    description: 'Prepare for your consultation and make the most of your appointment.',
  },
  {
    href: '#after-treatment',
    icon: 'healing',
    title: 'After Treatment',
    description: 'Important recovery instructions and follow-up recommendations.',
  },
  {
    href: '#exercise-rules',
    icon: 'fitness_center',
    title: 'Exercise Guidelines',
    description:
      'Learn how to perform your rehabilitation exercises safely and effectively.',
  },
  {
    href: '#emergency-info',
    icon: 'emergency',
    title: 'Emergency Information',
    description: 'Know when to seek urgent medical attention and how to contact us.',
    isRed: true,
  },
];

export default function PatientGuidelinesNav() {
  return (
    <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((link, index) => (
            <ScrollReveal key={link.href} direction="up" delay={index * 0.1}>
              <a
                className={`group flex flex-col items-center p-6 rounded-2xl bg-background-light dark:bg-background-dark transition-all duration-300 shadow-sm hover:shadow-lg border border-transparent h-full ${
                  link.isRed
                    ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20'
                    : 'hover:bg-primary hover:text-white hover:border-primary'
                }`}
                href={link.href}
              >
                <div
                  className={`w-14 h-14 rounded-full bg-white dark:bg-surface-dark text-primary flex items-center justify-center mb-4 shadow-sm transition-colors ${
                    link.isRed
                      ? 'group-hover:bg-white group-hover:text-red-600'
                      : 'group-hover:bg-white/10 group-hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{link.icon}</span>
                </div>
                <span className="font-bold text-lg text-center mb-2">{link.title}</span>
                <p
                  className={`text-sm text-center leading-relaxed transition-colors ${
                    link.isRed
                      ? 'text-text-sub group-hover:text-red-600/80'
                      : 'text-text-sub group-hover:text-white/90'
                  }`}
                >
                  {link.description}
                </p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

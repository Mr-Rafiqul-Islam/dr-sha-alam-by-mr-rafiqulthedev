import ScrollReveal from '@/components/ScrollReveal';

export default function PatientGuidelinesNav() {
  const links = [
    { href: '#before-visit', icon: 'calendar_clock', text: 'Before Your Visit' },
    { href: '#after-treatment', icon: 'healing', text: 'After Treatment' },
    { href: '#exercise-rules', icon: 'fitness_center', text: 'Exercise Rules' },
    { href: '#emergency-info', icon: 'emergency', text: 'Emergency Info', isRed: true },
  ];

  return (
    <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {links.map((link, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <a 
                className={`group flex flex-col items-center p-6 rounded-2xl bg-background-light dark:bg-background-dark transition-all duration-300 shadow-sm hover:shadow-lg border border-transparent ${
                  link.isRed 
                    ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                    : 'hover:bg-primary hover:text-white hover:border-primary'
                }`} 
                href={link.href}
              >
                <div className={`w-14 h-14 rounded-full bg-white dark:bg-surface-dark text-primary flex items-center justify-center mb-4 shadow-sm transition-colors ${
                  link.isRed 
                    ? 'group-hover:bg-white group-hover:text-red-600' 
                    : 'group-hover:bg-white/10 group-hover:text-white'
                }`}>
                  <span className="material-symbols-outlined text-3xl">{link.icon}</span>
                </div>
                <span className="font-bold text-lg text-center">{link.text}</span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
import ScrollReveal from '@/components/ScrollReveal';

const items = [
  {
    icon: 'folder_shared',
    title: 'Bring Previous Medical Records',
    intro: 'Please bring:',
    bullets: [
      'MRI Reports',
      'X-Ray Reports',
      'CT Scan Reports',
      'Previous Prescriptions',
      'Laboratory Reports',
      'Previous Treatment Records',
    ],
    footer:
      'These documents help us better understand your condition and treatment history.',
  },
  {
    icon: 'medication',
    title: 'List Current Medications',
    description:
      'Please provide a list of all medications, supplements, or injections you are currently using.',
  },
  {
    icon: 'schedule',
    title: 'Arrive 15 Minutes Early',
    description:
      'Arriving early allows sufficient time for registration and consultation preparation.',
  },
];

export default function PatientGuidelinesBeforeVisit() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark" id="before-visit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-10">
          <div className='flex items-center gap-4 mb-2'>
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-md">1</div>
            <h2 className="text-3xl font-extrabold text-primary dark:text-white">Before Your Visit</h2>
          </div>
          <h4 className="text-lg ml-14 font-medium text-text-sub dark:text-gray-300">Come Prepared For A Better Consultation</h4>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <ScrollReveal
              key={item.title}
              direction="up"
              delay={index * 0.1}
              className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">{item.title}</h3>

              {'bullets' in item && item.bullets ? (
                <div className="space-y-4">
                  <p className="text-text-sub text-sm">{item.intro}</p>
                  <ul className="space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-text-sub">
                        <span className="text-accent shrink-0 font-bold">✔</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {item.footer && (
                    <p className="text-text-sub text-sm leading-relaxed">{item.footer}</p>
                  )}
                </div>
              ) : (
                <p className="text-text-sub text-sm leading-relaxed">{item.description}</p>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

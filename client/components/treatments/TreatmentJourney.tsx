import ScrollReveal from '@/components/ScrollReveal';

export default function TreatmentJourney() {
  const steps = [
    {
      icon: 'clinical_notes',
      title: '1. Consultation',
      description: 'Initial meeting to understand your history and pain points.'
    },
    {
      icon: 'radiology',
      title: '2. Diagnosis',
      description: 'Precise physical examination and review of reports.'
    },
    {
      icon: 'medical_services',
      title: '3. Treatment Plan',
      description: 'Customized therapy, yoga, and medication plan.'
    },
    {
      icon: 'task_alt',
      title: '4. Recovery Plan',
      description: 'Long-term maintenance and lifestyle guidance.'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Your Journey</h2>
          <h3 className="text-3xl font-extrabold text-primary dark:text-white">How We Treat You</h3>
        </ScrollReveal>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-surface-dark border-4 border-blue-50 dark:border-gray-700 flex items-center justify-center mb-6 group-hover:border-accent transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-primary">{step.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">{step.title}</h4>
                <p className="text-sm text-text-sub">{step.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

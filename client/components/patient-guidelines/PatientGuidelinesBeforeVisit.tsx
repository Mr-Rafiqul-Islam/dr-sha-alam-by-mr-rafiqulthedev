import ScrollReveal from '@/components/ScrollReveal';

export default function PatientGuidelinesBeforeVisit() {
  const items = [
    {
      icon: 'folder_shared',
      title: 'Bring Previous Reports',
      desc: "Please carry all your previous X-rays, MRI scans, and doctors' prescriptions. This helps us understand your medical history accurately."
    },
    {
      icon: 'medication',
      title: 'List Current Medications',
      desc: 'Write down the names and dosages of any medicines you are currently taking, including vitamins and supplements.'
    },
    {
      icon: 'schedule',
      title: 'Arrive 15 Minutes Early',
      desc: 'Arriving early allows time for registration formalities so your consultation can begin promptly at the scheduled time.'
    }
  ];

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark" id="before-visit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-md">1</div>
          <h2 className="text-3xl font-extrabold text-primary dark:text-white">Before Your Visit</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1} className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">{item.title}</h3>
              <p className="text-text-sub text-sm leading-relaxed">
                {item.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
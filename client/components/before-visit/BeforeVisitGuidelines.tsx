import ScrollReveal from '@/components/ScrollReveal';

export default function BeforeVisitGuidelines() {
  const guidelines = [
    {
      icon: 'folder_open',
      title: 'What to Bring',
      description: 'Please carry all relevant documents to help us understand your medical history accurately.',
      items: [
        { title: 'Previous Medical Reports', desc: 'X-rays, MRI scans, or blood test results from the last 6 months.' },
        { title: 'Valid ID Proof', desc: 'NID, Passport, or Driving License for registration.' },
        { title: 'Current Medication List', desc: 'A list of any medicines or supplements you are currently taking.' },
        { title: 'Referral Letter', desc: 'If referred by another doctor, please bring the slip.' }
      ]
    },
    {
      icon: 'schedule',
      title: 'Arrival Instructions',
      description: 'Timing is crucial to maintain a smooth flow for all our patients.',
      items: [
        { title: 'Arrive 15 Minutes Early', desc: 'Allows time for completing registration forms and vitals check.' },
        { title: 'Check-in at Reception', desc: 'Inform the front desk immediately upon arrival.' },
        { title: 'Parking', desc: 'Visitor parking is available in the basement (Level B1).' },
        { title: 'Late Arrival Policy', desc: 'If more than 20 mins late, your appointment may be rescheduled.' }
      ]
    },
    {
      icon: 'accessibility_new',
      title: 'Preparation',
      description: 'Preparing physically helps Dr. Alam assess your condition more effectively.',
      items: [
        { title: 'Comfortable Clothing', desc: 'Wear loose clothing that allows easy movement for physical examination.' },
        { title: 'Note Your Symptoms', desc: 'Write down specific pain points, triggers, and duration of symptoms.' },
        { title: 'Hydration', desc: 'Drink water before your visit, especially if you might need blood work.' },
        { title: 'Questions List', desc: 'Prepare any questions you have about your condition or treatment.' }
      ]
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {guidelines.map((guide, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              delay={index * 0.1}
              className="bg-background-light dark:bg-background-dark rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-hover transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white dark:bg-surface-dark rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">{guide.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4">{guide.title}</h3>
              <p className="text-text-sub text-sm mb-6">{guide.description}</p>
              <ul className="space-y-4">
                {guide.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent mt-0.5">check_circle</span>
                    <div>
                      <h4 className="font-bold text-text-main dark:text-gray-200 text-sm">{item.title}</h4>
                      <p className="text-xs text-text-sub mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

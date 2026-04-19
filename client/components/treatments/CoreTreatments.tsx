import ScrollReveal from '@/components/ScrollReveal';
// import Link from 'next/link';

export default function CoreTreatments() {
  const treatments = [
    {
      icon: 'accessibility_new',
      title: 'PLID (Disc Prolapse)',
      description: 'Prolapsed Lumbar Intervertebral Disc treatment focused on non-surgical decompression, posture correction, and strengthening the core muscles to support the spine naturally.',
      link: '#'
    },
    {
      icon: 'personal_injury',
      title: 'Chronic Back Pain',
      description: 'Comprehensive management for lower and upper back pain using ergonomic adjustments, manual therapy, and tailored exercise regimens to reduce inflammation.',
      link: '#'
    },
    {
      icon: 'healing',
      title: 'Migraine Relief',
      description: 'Holistic approaches to reduce the frequency and intensity of migraines. Combining cervical spine therapy with relaxation techniques to alleviate tension headaches.',
      link: '#'
    },
    {
      icon: 'directions_walk',
      title: 'Sciatica & Nerve Pain',
      description: 'Targeted nerve mobilization techniques designed to relieve shooting pain in the legs and restore comfortable movement patterns through gentle rehabilitation.',
      link: '#'
    },
    {
      icon: 'sentiment_very_dissatisfied',
      title: 'Neck Pain (Cervical Spondylosis)',
      description: 'Addressing "Tech Neck" and cervical spondylosis through posture correction, strengthening neck muscles, and increasing flexibility to reduce stiffness.',
      link: '#',
      colSpan: true
    }
  ];

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Specialized Care</h2>
          <h3 className="text-3xl lg:text-4xl font-extrabold text-primary dark:text-white">Our Core Treatments</h3>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {treatments.map((treatment, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              delay={index * 0.1}
              className={`bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary/10 flex flex-col items-start group ${treatment.colSpan ? 'md:col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-3 mx-auto w-full md:w-auto' : ''}`}
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">{treatment.icon}</span>
              </div>
              <h4 className="text-2xl font-bold text-text-main dark:text-white mb-3">{treatment.title}</h4>
              <p className="text-text-sub mb-6 leading-relaxed">
                {treatment.description}
              </p>
              {/* <Link href={treatment.link} className="mt-auto flex items-center text-primary font-bold hover:text-accent transition-colors group/btn">
                Learn More <span className="material-symbols-outlined ml-2 text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
              </Link> */}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

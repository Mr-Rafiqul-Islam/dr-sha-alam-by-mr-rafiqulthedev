import ScrollReveal from '@/components/ScrollReveal';

const careGuidelines = [
  {
    icon: 'water_drop',
    title: 'Rest & Hydration',
    bullets: [
      'Get adequate sleep',
      'Drink sufficient water',
      'Follow prescribed activity modifications',
      'Avoid unnecessary strain during recovery',
    ],
  },
  {
    icon: 'directions_run',
    title: 'Follow Your Treatment Plan',
    paragraphs: [
      'Recovery improves when treatment recommendations are followed consistently.',
      'Always perform exercises, medications, and lifestyle modifications as instructed.',
    ],
  },
  {
    icon: 'monitor_heart',
    title: 'Monitor Your Symptoms',
    intro: 'Keep track of:',
    bullets: [
      'Pain levels',
      'Mobility improvements',
      'Numbness or tingling',
      'New symptoms',
    ],
    footer: 'Report significant changes during follow-up visits.',
  },
];

const generalPolicies = [
  {
    title: 'Appointment Changes',
    description:
      'Please inform us as early as possible if you need to cancel or reschedule.',
  },
  {
    title: 'Patient Privacy',
    description:
      'Your medical information remains confidential and is handled according to professional healthcare standards.',
  },
  {
    title: 'Payments',
    description:
      'Consultation and treatment fees should be completed according to clinic policies.',
  },
  {
    title: 'Late Arrivals',
    description:
      'Patients arriving significantly late may need to reschedule their appointment.',
  },
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-text-sub text-sm leading-relaxed">
          <span className="text-accent shrink-0 font-bold">✔</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PatientGuidelinesPostTreatment() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark" id="after-treatment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-md">
              2
            </div>
            <h2 className="text-3xl font-extrabold text-primary dark:text-white">
              After-Treatment Care
            </h2>
          </div>
          <h4 className="text-lg ml-14 font-medium text-text-sub dark:text-gray-300">
            Recovery Starts At Home
          </h4>
        </ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {careGuidelines.map((item, index) => (
              <ScrollReveal
                key={item.title}
                direction="up"
                delay={index * 0.1}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-50 dark:bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                    {item.title}
                  </h3>
                  {'bullets' in item && item.bullets && !item.intro && (
                    <Checklist items={item.bullets} />
                  )}
                  {'intro' in item && item.intro && (
                    <>
                      <p className="text-text-sub text-sm leading-relaxed">{item.intro}</p>
                      <Checklist items={item.bullets!} />
                      {item.footer && (
                        <p className="text-text-sub text-sm leading-relaxed mt-3">
                          {item.footer}
                        </p>
                      )}
                    </>
                  )}
                  {'paragraphs' in item &&
                    item.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-text-sub leading-relaxed text-sm mb-2 last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal
            direction="up"
            delay={0.3}
            className="relative bg-background-light dark:bg-background-dark rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-gray-800"
          >
            <p className="text-accent font-bold tracking-wider uppercase text-xs mb-2">
              GENERAL POLICIES
            </p>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">rule</span>
              Important Clinic Information
            </h3>
            <ul className="space-y-5">
              {generalPolicies.map((policy) => (
                <li key={policy.title} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent mt-1 shrink-0">
                    check_circle
                  </span>
                  <span className="text-text-sub text-sm font-medium leading-relaxed">
                    <strong className="text-text-main dark:text-gray-200">
                      {policy.title}:
                    </strong>{' '}
                    {policy.description}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
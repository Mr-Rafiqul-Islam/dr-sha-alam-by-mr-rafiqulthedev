import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

const stats = [
  {
    icon: 'workspace_premium',
    label: 'Years of Spine Surgery Experience',
    value: 12,
    suffix: '+',
  },
  {
    icon: 'medical_services',
    label: 'PLID Surgeries Performed',
    value: 1000,
    suffix: '+',
  },
  {
    icon: 'vaccines',
    label: 'Epidural Steroid Injections',
    value: 10000,
    suffix: '+',
  },
  {
    icon: 'clinical_notes',
    label: 'PLID Case Consultations',
    value: 100000,
    suffix: '+',
    duration: 2.5,
  },
  {
    icon: 'public',
    label: 'Patients Supported Online',
    display: '3 M+',
  },
  {
    icon: 'trending_up',
    label: 'Patient Improvement Rate',
    value: 98,
    suffix: '%',
  },
];

export default function AboutStats() {
  return (
    <section className="lg:py-16 py-12 bg-primary dark:bg-primary-dark text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal
          direction="up"
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 text-center"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="p-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-extrabold mb-2 flex items-center justify-center">
                {'display' in stat && stat.display ? (
                  stat.display
                ) : (
                  <AnimatedCounter
                    value={stat.value!}
                    suffix={stat.suffix}
                    duration={stat.duration}
                  />
                )}
              </h4>
              <p className="text-white/80 font-medium text-xs sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

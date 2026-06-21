import ScrollReveal from '@/components/ScrollReveal';

const exerciseGuidelines = [
  {
    icon: 'trending_up',
    title: 'Start Gradually',
    description:
      'Avoid overexertion during the early stages of rehabilitation.',
  },
  {
    icon: 'event_repeat',
    title: 'Focus On Consistency',
    description:
      'Regular practice is more effective than occasional intense exercise.',
  },
  {
    icon: 'pause_circle',
    title: 'Stop If Symptoms Worsen',
    description:
      'Discontinue any exercise that causes severe pain, increasing numbness, weakness, or dizziness.',
  },
  {
    icon: 'verified_user',
    title: 'Follow Professional Guidance',
    description:
      'Not every exercise is appropriate for every patient. Always follow the plan prescribed specifically for your condition.',
  },
];

export default function PatientGuidelinesExercise() {
  return (
    <section
      className="py-12 md:py-20 bg-background-light dark:bg-background-dark"
      id="exercise-rules"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-md">
              3
            </div>
            <h2 className="text-3xl font-extrabold text-primary dark:text-white">
              Exercise Guidelines
            </h2>
          </div>
          <p className="text-lg ml-14 font-medium text-text-sub dark:text-gray-300">
            Exercise Safely. Recover Confidently.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-8">
          {exerciseGuidelines.map((item, index) => (
            <ScrollReveal
              key={item.title}
              direction="up"
              delay={index * 0.1}
              className="bg-white dark:bg-surface-dark p-8 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-text-sub text-sm leading-relaxed">{item.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

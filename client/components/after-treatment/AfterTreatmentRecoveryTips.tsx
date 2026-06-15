import ScrollReveal from '@/components/ScrollReveal';

const recoveryTipGroups = [
  {
    icon: 'bed',
    title: 'Rest & Recovery',
    items: [
      'Get adequate sleep every night.',
      'Allow your body time to heal.',
      'Avoid unnecessary physical strain during the early recovery phase.',
      'Maintain a regular sleep schedule.',
    ],
  },
  {
    icon: 'water_drop',
    title: 'Hydration & Nutrition',
    items: [
      'Drink sufficient water daily.',
      'Eat a balanced diet rich in vegetables, fruits, lean proteins, and healthy fats.',
      'Include anti-inflammatory foods whenever possible.',
      'Avoid excessive processed foods and sugary drinks.',
    ],
  },
  {
    icon: 'directions_walk',
    title: 'Activity Modification',
    items: [
      'Gradually return to normal activities.',
      'Avoid sudden twisting, bending, or heavy lifting unless approved.',
      "Listen to your body's signals.",
      'Stop activities that significantly increase pain.',
    ],
  },
];

const importantReminder = {
  icon: 'warning',
  title: 'Avoid Heavy Lifting',
  description:
    'Avoid lifting heavy objects during the early stages of recovery unless specifically cleared by your doctor. Protecting healing tissues now helps prevent setbacks later.',
};

export default function AfterTreatmentRecoveryTips() {
  return (
    <ScrollReveal
      direction="up"
      className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">healing</span>
        </div>
        <div>
          <p className="text-accent font-bold tracking-wider uppercase text-xs mb-1">
            RECOVERY TIPS
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">
            Support Your Healing Process
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-8">
          {recoveryTipGroups.map((group) => (
            <div key={group.title}>
              <h3 className="flex items-center gap-2 text-lg font-bold text-primary dark:text-accent mb-3">
                <span className="material-symbols-outlined">{group.icon}</span>
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-text-sub text-sm leading-relaxed">
                    <span className="text-accent mt-0.5 shrink-0 font-bold">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-background-light dark:bg-background-dark rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-surface-dark rounded-full flex items-center justify-center shadow-md mb-4 text-orange-400">
            <span className="material-symbols-outlined text-4xl">{importantReminder.icon}</span>
          </div>
          <h4 className="font-bold text-text-main dark:text-white mb-2">{importantReminder.title}</h4>
          <p className="text-sm text-text-sub mb-4">{importantReminder.description}</p>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-orange-400"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Recovery Phase 1</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

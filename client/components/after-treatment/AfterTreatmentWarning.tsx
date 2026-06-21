import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const warningSigns = [
  {
    icon: 'accessibility_new',
    title: 'Sudden Weakness',
    description: 'Difficulty lifting your foot, standing, or walking normally.',
  },
  {
    icon: 'thunderstorm',
    title: 'Increasing Numbness',
    description: 'New or worsening numbness in the legs, feet, arms, or hands.',
  },
  {
    icon: 'emergency',
    title: 'Loss Of Bladder Or Bowel Control',
    description: 'This may require urgent medical evaluation.',
  },
  {
    icon: 'personal_injury',
    title: 'Severe Uncontrolled Pain',
    description: 'Pain that becomes significantly worse despite treatment.',
  },
  {
    icon: 'thermometer',
    title: 'Fever Or Signs Of Infection',
    description: 'Especially after procedures or injections.',
  },
  {
    icon: 'format_color_reset',
    title: 'Significant Swelling Or Redness',
    description:
      'Unexpected swelling, redness, warmth, or discharge around treated areas.',
  },
];

export default function AfterTreatmentWarning() {
  return (
    <ScrollReveal direction="up" className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 md:p-10 shadow-sm border border-red-100 dark:border-red-900/30">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-3xl">emergency</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Warning Signs</h2>
      </div>
      <p className="text-text-sub mb-6">Contact Us Immediately If You Experience:</p>
      <div className="grid md:grid-cols-2 gap-4">
        {warningSigns.map((sign) => (
          <div
            key={sign.title}
            className="flex items-start gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm"
          >
            <span className="material-symbols-outlined text-red-500 mt-1 shrink-0">
              {sign.icon}
            </span>
            <div>
              <h4 className="font-bold text-text-main dark:text-white text-sm">{sign.title}</h4>
              <p className="text-xs text-text-sub mt-1 leading-relaxed">{sign.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/contact" className="inline-flex items-center justify-center text-center text-sm md:text-base gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-red-200 dark:shadow-none">
          <span className="material-symbols-outlined">call</span>
          Contact Emergency Support
        </Link>
      </div>
    </ScrollReveal>
  );
}

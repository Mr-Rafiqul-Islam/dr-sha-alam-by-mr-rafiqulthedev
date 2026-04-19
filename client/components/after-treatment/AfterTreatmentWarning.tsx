import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function AfterTreatmentWarning() {
  return (
    <ScrollReveal direction="up" className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 md:p-10 shadow-sm border border-red-100 dark:border-red-900/30">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-3xl">emergency</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Warning Signs</h2>
      </div>
      <p className="text-text-sub mb-6">If you experience any of the following symptoms, please stop all exercises and contact the clinic immediately or visit the nearest emergency room:</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-start gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-1">egg_alt</span>
          <div>
            <h4 className="font-bold text-text-main dark:text-white text-sm">High Fever</h4>
            <p className="text-xs text-text-sub mt-1">Sudden fever over 101°F accompanied by joint swelling.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-1">thunderstorm</span>
          <div>
            <h4 className="font-bold text-text-main dark:text-white text-sm">Sudden Numbness</h4>
            <p className="text-xs text-text-sub mt-1">Loss of sensation in legs, arms, or groin area.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-1">blind</span>
          <div>
            <h4 className="font-bold text-text-main dark:text-white text-sm">Loss of Motor Control</h4>
            <p className="text-xs text-text-sub mt-1">Inability to move a limb or sudden foot drop.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-1">format_color_reset</span>
          <div>
            <h4 className="font-bold text-text-main dark:text-white text-sm">Abnormal Swelling</h4>
            <p className="text-xs text-text-sub mt-1">Redness, heat, or excessive swelling around the treated area.</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-red-200 dark:shadow-none">
          <span className="material-symbols-outlined">call</span>
          Contact Emergency Support
        </Link>
      </div>
    </ScrollReveal>
  );
}

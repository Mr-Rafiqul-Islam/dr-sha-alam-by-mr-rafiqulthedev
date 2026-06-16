import ScrollReveal from '@/components/ScrollReveal';

export default function AfterTreatmentImportantNote() {
  return (
    <ScrollReveal direction="up" className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-soft border-l-4 border-accent mb-12">
      <div className="flex gap-4">
        <div className="shrink-0">
          <span className="material-symbols-outlined text-accent text-3xl">info</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Important Note</h3>
          <p className="text-text-sub text-sm leading-relaxed">
          Always follow the specific instructions provided by Dr. Shah Alam regarding medications, exercises, activity levels, and follow-up appointments. If any instructions differ from your personalized treatment plan, follow your doctor&apos;s advice.
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

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
            These instructions are general guidelines for patients undergoing non-surgical orthopedic treatments and yoga-based rehabilitation. Please refer to your personalized prescription sheet for specific medication dosages and exercise frequencies tailored to your condition.
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

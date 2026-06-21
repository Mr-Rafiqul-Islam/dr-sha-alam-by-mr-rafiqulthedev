import ScrollReveal from '@/components/ScrollReveal';

export default function AfterTreatmentRecoverySuccess() {
  return (
    <ScrollReveal
      direction="up"
      className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 text-center"
    >
      <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white mb-3">
        Small Daily Actions Create Long-Term Recovery
      </h2>
      <div className="space-y-4 text-text-sub text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
        <p>Healing is rarely instant.</p>
        <p>
          Patients who follow their treatment plan, stay active within safe limits,
          maintain healthy habits, and attend follow-up visits often achieve the best
          outcomes.
        </p>
      </div>
    </ScrollReveal>
  );
}

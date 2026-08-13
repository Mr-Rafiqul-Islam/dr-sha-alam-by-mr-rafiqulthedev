import AfterTreatmentHero from '@/components/after-treatment/AfterTreatmentHero';
import AfterTreatmentImportantNote from '@/components/after-treatment/AfterTreatmentImportantNote';
import AfterTreatmentRecoveryTips from '@/components/after-treatment/AfterTreatmentRecoveryTips';
import AfterTreatmentExercise from '@/components/after-treatment/AfterTreatmentExercise';
import AfterTreatmentWarning from '@/components/after-treatment/AfterTreatmentWarning';
import AfterTreatmentFAQ from '@/components/after-treatment/AfterTreatmentFAQ';
import AfterTreatmentRecoverySuccess from '@/components/after-treatment/AfterTreatmentRecoverySuccess';
import AfterTreatmentFinalMessage from '@/components/after-treatment/AfterTreatmentFinalMessage';
import AfterTreatmentSupport from '@/components/after-treatment/AfterTreatmentSupport';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "After Treatment Instructions | Dr. Shah Alam",
  alternates: {
    canonical: "/after-treatment-instructions",
  },
};

export default function AfterTreatmentInstructionsPage() {
  return (
    <main className="flex-grow">
      <AfterTreatmentHero />
      <section className="py-12 lg:py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AfterTreatmentImportantNote />
          <div className="space-y-12">
            <AfterTreatmentRecoveryTips />
            <AfterTreatmentExercise />
            <AfterTreatmentWarning />
            <AfterTreatmentFAQ />
            <AfterTreatmentRecoverySuccess />
          </div>
        </div>
      </section>
      <AfterTreatmentFinalMessage />
      <AfterTreatmentSupport />
    </main>
  );
}

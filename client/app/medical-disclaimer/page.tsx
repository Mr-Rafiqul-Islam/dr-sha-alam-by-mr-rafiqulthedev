import MedicalDisclaimerHeader from '@/components/medical-disclaimer/MedicalDisclaimerHeader';
import MedicalDisclaimerNotice from '@/components/medical-disclaimer/MedicalDisclaimerNotice';
import MedicalDisclaimerSections from '@/components/medical-disclaimer/MedicalDisclaimerSections';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Medical Disclaimer | Dr. Shah Alam",
  alternates: {
    canonical: "/medical-disclaimer",
  },
};

export default function MedicalDisclaimerPage() {
  return (
    <main className="flex-grow">
      <section className="py-12 lg:py-24 bg-white dark:bg-surface-dark relative overflow-hidden">
          <MedicalDisclaimerHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <MedicalDisclaimerNotice />
            <MedicalDisclaimerSections />
          </div>
        </div>
      </section>
    </main>
  );
}

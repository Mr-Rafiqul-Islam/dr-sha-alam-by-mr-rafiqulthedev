import MedicalDisclaimerHeader from '@/components/medical-disclaimer/MedicalDisclaimerHeader';
import MedicalDisclaimerNotice from '@/components/medical-disclaimer/MedicalDisclaimerNotice';
import MedicalDisclaimerSections from '@/components/medical-disclaimer/MedicalDisclaimerSections';

export default function MedicalDisclaimerPage() {
  return (
    <main className="flex-grow">
      <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MedicalDisclaimerHeader />
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <MedicalDisclaimerNotice />
            <MedicalDisclaimerSections />
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 text-center">
              <p>Last updated: October 24, 2023</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

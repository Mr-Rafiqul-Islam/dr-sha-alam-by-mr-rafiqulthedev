import ScrollReveal from '@/components/ScrollReveal';

export default function MedicalDisclaimerNotice() {
  return (
    <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-primary/10 mb-10 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">warning</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-main dark:text-white mt-0 mb-2">Important Notice</h2>
          <p className="text-text-sub text-base m-0 font-medium">
            The information provided on this website is for general informational purposes only and is <strong>not intended as a substitute for professional medical advice</strong>, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

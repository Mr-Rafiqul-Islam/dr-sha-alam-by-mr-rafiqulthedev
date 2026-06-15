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
          <p className="font-bold text-text-main dark:text-white mb-3">
            Information Is Not A Substitute For Professional Medical Advice
          </p>
          <p className="text-text-sub text-base mb-3">
            The content available on this website should not be used as a replacement for professional medical consultation, diagnosis, treatment, or individualized healthcare advice.
          </p>
          <p className="text-text-sub text-base m-0">
            Every patient is unique, and medical decisions should always be made in consultation with a qualified healthcare professional.
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

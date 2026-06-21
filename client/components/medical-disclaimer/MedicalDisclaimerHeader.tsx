import ScrollReveal from '@/components/ScrollReveal';

export default function MedicalDisclaimerHeader() {
  return (
    <div className="text-center mb-12 lg:mb-16 px-4">
      <ScrollReveal direction="up">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary dark:text-white mb-6">Medical Disclaimer</h1>
        <p className="text-text-sub text-lg max-w-3xl mx-auto mb-2">
          Please Read This Disclaimer Carefully Before Using This Website.
          The information provided on this website is intended for educational and informational purposes only.
        </p>
        <p className="text-text-sub text-lg max-w-2xl mx-auto">
          By using this website, you acknowledge and agree to the terms outlined in this Medical Disclaimer.
        </p>
        <div className="mt-4 text-sm font-medium text-gray-400">
          Last Updated: June 15, 2026
        </div>
      </ScrollReveal>
    </div>
  );
}

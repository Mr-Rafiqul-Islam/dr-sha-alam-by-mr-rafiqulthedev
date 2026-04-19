import ScrollReveal from '@/components/ScrollReveal';

export default function MedicalDisclaimerHeader() {
  return (
    <div className="mb-12 text-center lg:text-left">
      <ScrollReveal direction="up">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white mb-6">Medical Disclaimer</h1>
        <div className="h-1.5 w-24 bg-accent rounded-full mx-auto lg:mx-0"></div>
      </ScrollReveal>
    </div>
  );
}

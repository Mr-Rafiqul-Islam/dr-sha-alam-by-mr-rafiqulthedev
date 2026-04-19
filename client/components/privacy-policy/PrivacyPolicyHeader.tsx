import ScrollReveal from '@/components/ScrollReveal';

export default function PrivacyPolicyHeader() {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <ScrollReveal direction="up">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-text-sub text-lg max-w-2xl mx-auto">
          Your privacy is important to us. This policy outlines how Doctor Shah Alam&apos;s clinic collects, uses, and protects your personal and medical information.
        </p>
        <div className="mt-4 text-sm font-medium text-gray-400">
          Last Updated: October 24, 2023
        </div>
      </ScrollReveal>
    </div>
  );
}

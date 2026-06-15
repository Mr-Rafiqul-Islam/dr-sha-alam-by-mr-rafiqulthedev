import ScrollReveal from '@/components/ScrollReveal';

export default function PrivacyPolicyHeader() {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <ScrollReveal direction="up">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-text-sub text-lg max-w-2xl mx-auto mb-4">
          <strong className="text-text-main dark:text-white">Your Privacy Matters To Us.</strong>{' '}
          At Dr. Shah Alam&apos;s Clinic, we are committed to protecting your personal information and maintaining the confidentiality of your medical records.
        </p>
        <p className="text-text-sub text-lg max-w-2xl mx-auto">
          This Privacy Policy explains how we collect, use, store, and protect the information you provide when using our website, booking appointments, or receiving healthcare services.
        </p>
        <div className="mt-4 text-sm font-medium text-gray-400">
          Last Updated: June 15, 2026
        </div>
      </ScrollReveal>
    </div>
  );
}

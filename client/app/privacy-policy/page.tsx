import PrivacyPolicyHeader from '@/components/privacy-policy/PrivacyPolicyHeader';
import PrivacyPolicySections from '@/components/privacy-policy/PrivacyPolicySections';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-grow">
      <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrivacyPolicyHeader />
          <PrivacyPolicySections />
        </div>
      </section>
    </main>
  );
}

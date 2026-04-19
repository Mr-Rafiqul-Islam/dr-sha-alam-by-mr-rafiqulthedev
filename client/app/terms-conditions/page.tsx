import TermsHero from '@/components/terms-conditions/TermsHero';
import TermsContent from '@/components/terms-conditions/TermsContent';

export default function TermsConditionsPage() {
  return (
    <main className="flex-grow bg-white dark:bg-background-dark">
      <TermsHero />
      <TermsContent />
    </main>
  );
}
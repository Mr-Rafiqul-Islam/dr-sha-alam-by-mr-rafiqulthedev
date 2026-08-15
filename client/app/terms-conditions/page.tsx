import TermsHero from '@/components/terms-conditions/TermsHero';
import TermsContent from '@/components/terms-conditions/TermsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms & Conditions | Dr. Shah Alam",
  alternates: {
    canonical: "/terms-conditions",
  },
};

export default function TermsConditionsPage() {
  return (
    <main className="flex-grow bg-white dark:bg-background-dark">
      <TermsHero />
      <TermsContent />
    </main>
  );
}
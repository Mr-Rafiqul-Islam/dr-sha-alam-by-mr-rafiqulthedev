import BeforeVisitHero from '@/components/before-visit/BeforeVisitHero';
import BeforeVisitGuidelines from '@/components/before-visit/BeforeVisitGuidelines';
import BeforeVisitNotice from '@/components/before-visit/BeforeVisitNotice';
import BeforeVisitContact from '@/components/before-visit/BeforeVisitContact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Before Visit Instructions | Dr. Shah Alam",
  alternates: {
    canonical: "/before-visit-instructions",
  },
};

export default function BeforeVisitInstructionsPage() {
  return (
    <main className="flex-grow">
      <BeforeVisitHero />
      <BeforeVisitGuidelines />
      <BeforeVisitNotice />
      <BeforeVisitContact />
    </main>
  );
}

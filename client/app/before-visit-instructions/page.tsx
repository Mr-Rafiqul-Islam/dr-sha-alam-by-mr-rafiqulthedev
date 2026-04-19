import BeforeVisitHero from '@/components/before-visit/BeforeVisitHero';
import BeforeVisitGuidelines from '@/components/before-visit/BeforeVisitGuidelines';
import BeforeVisitNotice from '@/components/before-visit/BeforeVisitNotice';
import BeforeVisitContact from '@/components/before-visit/BeforeVisitContact';

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

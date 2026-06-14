import FAQSection from '@/components/faq/FAQSection';
import FAQContact from '@/components/faq/FAQContact';

export default function FAQPage() {
  return (
    <main className="flex-grow">
      <FAQSection />
      <FAQContact />
    </main>
  );
}

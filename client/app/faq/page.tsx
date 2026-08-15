import FAQSection from '@/components/faq/FAQSection';
import FAQContact from '@/components/faq/FAQContact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FAQ | Dr. Shah Alam",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  return (
    <main className="flex-grow">
      <FAQSection />
      <FAQContact />
    </main>
  );
}

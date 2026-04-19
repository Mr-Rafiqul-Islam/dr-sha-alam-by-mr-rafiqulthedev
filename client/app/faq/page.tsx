import FAQHero from '@/components/faq/FAQHero';
import FAQCategories from '@/components/faq/FAQCategories';
import FAQList from '@/components/faq/FAQList';
import FAQContact from '@/components/faq/FAQContact';

export default function FAQPage() {
  return (
    <main className="flex-grow">
      <FAQHero />
      <FAQCategories />
      <FAQList />
      <FAQContact />
    </main>
  );
}

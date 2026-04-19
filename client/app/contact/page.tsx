import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactFAQ from '@/components/contact/ContactFAQ';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactPage() {
  return (
    <main className="flex-grow">
      <ContactHero />
      <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ScrollReveal direction="right">
              <ContactForm />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <ContactInfo />
            </ScrollReveal>
          </div>
        </div>
      </section>
      <ContactFAQ />
    </main>
  );
}

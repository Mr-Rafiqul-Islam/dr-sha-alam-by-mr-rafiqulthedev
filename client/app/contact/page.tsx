import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactFAQ from '@/components/contact/ContactFAQ';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactPage() {
  return (
    <main className="flex-grow">
      <ContactHero />
      <section className="lg:py-24 py-12 bg-white dark:bg-surface-dark overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start min-w-0">
            <ScrollReveal direction="up" className="w-full min-w-0">
              <ContactForm />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2} className="w-full min-w-0">
              <ContactInfo />
            </ScrollReveal>
          </div>
        </div>
      </section>
      <ContactFAQ />
    </main>
  );
}

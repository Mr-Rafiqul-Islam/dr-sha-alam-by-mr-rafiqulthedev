import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function BeforeVisitContact() {
  return (
    <section className="bg-white dark:bg-surface-dark pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mt-12 text-center">
          <p className="text-text-sub mb-6">Have more questions before you arrive?</p>
          <Link href="/contact" className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white text-base font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 gap-2">
            <span className="material-symbols-outlined">call</span>
            Contact Support
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

import ScrollReveal from '@/components/ScrollReveal';

export default function TermsHero() {
  return (
    <div className="bg-primary/5 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white mb-4">Terms &amp; Conditions</h1>
          <p className="text-lg text-text-sub dark:text-gray-400">Please read these terms carefully before using our services.</p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: October 24, 2023</p>
        </ScrollReveal>
      </div>
    </div>
  );
}
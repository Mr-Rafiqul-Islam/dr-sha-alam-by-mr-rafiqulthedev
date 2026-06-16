import ScrollReveal from '@/components/ScrollReveal';

export default function TermsHero() {
  return (
    <div className="bg-primary/5 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white mb-4">Terms &amp; Conditions</h1>
          <p className="text-lg text-text-sub dark:text-gray-400 mb-4">
            Please Read These Terms Carefully Before Using Our Website Or Services
          </p>
          <p className="text-text-sub text-sm xl:text-base max-w-2xl mx-auto mb-4">
            By accessing, browsing, booking appointments, or using any services provided through this website, you agree to comply with the following Terms &amp; Conditions.
          </p>
          <p className="text-text-sub text-sm xl:text-base max-w-2xl mx-auto">
            If you do not agree with any part of these terms, please discontinue use of this website and related services.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last Updated: June 15, 2026</p>
        </ScrollReveal>
      </div>
    </div>
  );
}

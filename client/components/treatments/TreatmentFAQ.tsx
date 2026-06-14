import ScrollReveal from '@/components/ScrollReveal';

export default function TreatmentFAQ() {
  const faqs = [
    {
      question: 'Do all PLID patients need surgery?',
      answer: 'No. Many patients improve with appropriate conservative treatment, rehabilitation, and lifestyle modification.'
    },
    {
      question: 'How do I know which treatment is right for me?',
      answer: 'The right treatment depends on symptoms, examination findings, imaging results, and individual goals.'
    },
    {
      question: 'Can therapeutic yoga help recovery?',
      answer: 'Therapeutic yoga may support mobility, posture, flexibility, and long-term recovery when properly prescribed.'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-primary dark:text-white">Frequently Asked Questions</h3>
        </ScrollReveal>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <details className="group bg-background-light dark:bg-background-dark rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-text-main dark:text-white">
                  {faq.question}
                  <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="mt-4 text-text-sub leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

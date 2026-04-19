import ScrollReveal from '@/components/ScrollReveal';

export default function FAQList() {
  const faqs = [
    {
      question: 'Do all PLID patients need surgery?',
      answer: (
        <>
          <p>No, not all PLID patients require surgery. In fact, Dr. Shah Alam&apos;s protocol focuses on <span className="text-primary font-semibold">non-invasive recovery</span> methods. More than 90% of our patients recover successfully through a combination of spinal decompression therapy, targeted yoga-based rehabilitation, and lifestyle adjustments.</p>
          <p>Surgery is typically only considered as a last resort when there is significant neurological deficit or if conservative treatments fail after a substantial period.</p>
        </>
      )
    },
    {
      question: 'What is yoga-based rehabilitation?',
      answer: (
        <>
          <p><span className="text-primary font-semibold">Yoga-based rehabilitation</span> is a specialized therapeutic approach that uses modified yoga postures and breathing techniques to heal musculoskeletal issues.</p>
          <p>Unlike general yoga classes, these exercises are prescribed specifically for your condition (e.g., sciatica, frozen shoulder) to strengthen stabilizing muscles, improve flexibility, and reduce pain without straining the injured area.</p>
        </>
      )
    },
    {
      question: 'How long does a typical treatment plan take?',
      answer: (
        <>
          <p>The duration of treatment varies depending on the severity of the condition and patient compliance. However, most patients start seeing significant pain reduction within <span className="text-primary font-semibold">2-4 weeks</span>.</p>
          <p className="mt-2">A complete rehabilitation program for chronic conditions like PLID typically spans 3 months to ensure long-term stability and prevent recurrence.</p>
        </>
      )
    },
    {
      question: 'Is the treatment covered by insurance?',
      answer: (
        <>
          <p>Coverage depends on your specific insurance provider and plan. Since Dr. Shah Alam is a certified medical specialist (MBBS, MS Ortho), consultations and prescribed physiotherapy are often eligible for reimbursement.</p>
          <p className="mt-2">Please bring your insurance documents, and our front desk will assist you with the necessary paperwork for claims.</p>
        </>
      )
    },
    {
      question: 'What should I bring to my first appointment?',
      answer: (
        <>
          <p>To make the most of your first visit, please bring:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-primary font-medium">
            <li>Previous MRI, X-ray, or CT scan reports.</li>
            <li>A list of current medications.</li>
            <li>Referral letters (if any).</li>
            <li>Comfortable clothing suitable for a physical examination.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark min-h-[600px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {faqs.map((faq, index) => (
          <ScrollReveal key={index} direction="up" delay={index * 0.1}>
            <details className="group bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 open:ring-2 open:ring-primary/20">
              <summary className="flex justify-between items-center cursor-pointer font-bold text-lg text-text-main dark:text-white">
                <span>{faq.question}</span>
                <span className="material-symbols-outlined text-gray-400 group-open:text-primary group-open:rotate-180 transition-transform duration-300">expand_more</span>
              </summary>
              <div className="mt-4 text-text-sub dark:text-gray-300 leading-relaxed space-y-4">
                {faq.answer}
              </div>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

import ScrollReveal from '@/components/ScrollReveal';

const faqs = [
  {
    question: 'Can I Drive After Treatment?',
    paragraphs: [
      'This depends on the treatment received.',
      'If you have received injections, sedation, or are experiencing significant pain, consult your doctor before driving.',
    ],
  },
  {
    question: 'When Can I Return To Work?',
    paragraphs: [
      'The timeline varies depending on your condition, occupation, and treatment.',
      'Many patients return to normal work activities gradually under medical guidance.',
    ],
  },
  {
    question: 'Can I Continue My Exercises At Home?',
    paragraphs: [
      'Yes.',
      'Most rehabilitation programs include home-based exercises that should be performed consistently as instructed.',
    ],
  },
  {
    question: 'What Should I Do If Symptoms Return?',
    paragraphs: [
      'Contact our clinic for guidance rather than self-medicating or ignoring symptoms.',
      'Early intervention often prevents larger problems.',
    ],
  },
];

export default function AfterTreatmentFAQ() {
  return (
    <ScrollReveal direction="up" className="border-t border-gray-200 dark:border-gray-800 pt-12">
      <h3 className="text-2xl font-bold text-text-main dark:text-white mb-8 text-center">
        Common Questions
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-bold text-primary dark:text-accent mb-2 text-sm">{faq.question}</h4>
            <div className="space-y-2">
              {faq.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-text-sub text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

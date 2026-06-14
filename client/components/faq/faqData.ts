export type FAQAnswer = {
  paragraphs: string[];
  bullets?: string[];
};

export type FAQItem = {
  question: string;
  answer: FAQAnswer;
};

export type FAQCategory = {
  id: string;
  name: string;
  faqs: FAQItem[];
};

export const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    name: 'General Questions',
    faqs: [
      {
        question: 'Do all PLID patients need surgery?',
        answer: {
          paragraphs: [
            'No.',
            'The majority of PLID patients improve with appropriate conservative treatment, rehabilitation, lifestyle modification, and proper medical guidance.',
            'Surgery is typically recommended only when specific indications are present.',
          ],
        },
      },
      {
        question: 'What is the first step if my MRI shows PLID?',
        answer: {
          paragraphs: [
            'Do not panic.',
            'An MRI report alone does not determine treatment. The right treatment decision depends on your symptoms, physical examination findings, daily limitations, and overall condition.',
          ],
        },
      },
      {
        question: 'Can PLID heal without surgery?',
        answer: {
          paragraphs: [
            'Many patients experience significant improvement without surgery through structured treatment, rehabilitation, posture correction, therapeutic yoga, and lifestyle modifications.',
          ],
        },
      },
      {
        question: 'Is PLID a lifelong condition?',
        answer: {
          paragraphs: [
            'Not necessarily.',
            'Many patients return to normal daily activities and live active lives after proper treatment and recovery.',
          ],
        },
      },
      {
        question: 'How long does recovery usually take?',
        answer: {
          paragraphs: [
            'Recovery varies from person to person.',
            'Some patients improve within a few weeks, while others may require several months depending on symptom severity and treatment adherence.',
          ],
        },
      },
    ],
  },
  {
    id: 'plid-sciatica',
    name: 'PLID & Sciatica',
    faqs: [
      {
        question: 'What causes sciatica?',
        answer: {
          paragraphs: [
            'Sciatica occurs when the sciatic nerve becomes irritated or compressed, commonly due to PLID (disc prolapse).',
            'Symptoms may include:',
          ],
          bullets: ['Leg pain', 'Tingling', 'Numbness', 'Weakness'],
        },
      },
      {
        question: 'Why does leg pain sometimes feel worse than back pain?',
        answer: {
          paragraphs: [
            'Because irritated nerves can send pain signals down the entire leg.',
            'In some PLID patients, leg pain becomes more noticeable than back pain itself.',
          ],
        },
      },
      {
        question: 'Is numbness dangerous?',
        answer: {
          paragraphs: [
            'Not always.',
            'However, worsening numbness, progressive weakness, or loss of bladder and bowel control should be evaluated immediately.',
          ],
        },
      },
      {
        question: 'Can PLID come back after recovery?',
        answer: {
          paragraphs: [
            'Recurrence is possible.',
            'Maintaining proper posture, body mechanics, exercise habits, and weight management may help reduce recurrence risk.',
          ],
        },
      },
      {
        question: 'When should I worry about PLID symptoms?',
        answer: {
          paragraphs: ['Seek medical attention immediately if you experience:'],
          bullets: [
            'Progressive weakness',
            'Foot drop',
            'Loss of bladder control',
            'Loss of bowel control',
            'Severe worsening symptoms',
          ],
        },
      },
    ],
  },
  {
    id: 'treatment',
    name: 'Treatment Options',
    faqs: [
      {
        question: 'How do I know which treatment is right for me?',
        answer: {
          paragraphs: [
            'The appropriate treatment depends on:',
            'No single treatment is suitable for every patient.',
          ],
          bullets: [
            'Symptoms',
            'MRI findings',
            'Physical examination',
            'Daily functional limitations',
            'Personal goals',
          ],
        },
      },
      {
        question: 'What treatment options are available?',
        answer: {
          paragraphs: ['Treatment may include:'],
          bullets: [
            'Medication',
            'Lifestyle Modification',
            'Physical Rehabilitation',
            'Therapeutic Yoga',
            'Epidural Steroid Injection',
            'Surgery (when necessary)',
          ],
        },
      },
      {
        question: 'Is Epidural Steroid Injection safe?',
        answer: {
          paragraphs: [
            'When performed by trained professionals and used appropriately, epidural steroid injections can provide significant relief for selected patients.',
          ],
        },
      },
      {
        question: 'How do I know if I need surgery?',
        answer: {
          paragraphs: ['Surgery is considered based on:'],
          bullets: [
            'Persistent disabling symptoms',
            'Progressive neurological deficits',
            'Failure of appropriate conservative treatment',
            'Certain emergency conditions',
          ],
        },
      },
      {
        question: 'Can surgery be avoided?',
        answer: {
          paragraphs: [
            'In many cases, yes.',
            'Many patients improve significantly through non-surgical treatment when diagnosed and managed appropriately.',
          ],
        },
      },
    ],
  },
  {
    id: 'yoga-rehab',
    name: 'Therapeutic Yoga & Rehabilitation',
    faqs: [
      {
        question: 'Can yoga help PLID patients?',
        answer: {
          paragraphs: [
            'Therapeutic yoga may improve flexibility, posture, mobility, confidence, and overall function when prescribed appropriately.',
          ],
        },
      },
      {
        question: 'Is all yoga safe for PLID?',
        answer: {
          paragraphs: [
            'No.',
            'Some movements may aggravate symptoms.',
            'Exercises should be individualized according to the patient\'s condition and recovery stage.',
          ],
        },
      },
      {
        question: 'How often should I exercise?',
        answer: {
          paragraphs: [
            'The frequency depends on your treatment plan.',
            'Consistency is usually more important than intensity.',
          ],
        },
      },
      {
        question: 'Can walking help recovery?',
        answer: {
          paragraphs: [
            'Walking is often beneficial for many PLID patients when performed within comfortable limits.',
          ],
        },
      },
      {
        question: 'Can exercise worsen PLID?',
        answer: {
          paragraphs: [
            'Improper exercise may worsen symptoms.',
            'That is why professional guidance is important.',
          ],
        },
      },
    ],
  },
  {
    id: 'consultation',
    name: 'Consultation & Appointments',
    faqs: [
      {
        question: 'What should I bring to my appointment?',
        answer: {
          paragraphs: ['Please bring:'],
          bullets: [
            'MRI Reports',
            'X-Rays',
            'Previous Prescriptions',
            'Medical Records',
            'List Of Current Medications',
          ],
        },
      },
      {
        question: 'Do I need an MRI before booking?',
        answer: {
          paragraphs: [
            'No.',
            'Many patients can be evaluated before obtaining an MRI.',
            'Additional investigations are recommended only when necessary.',
          ],
        },
      },
      {
        question: 'Can I get a second opinion?',
        answer: {
          paragraphs: [
            'Absolutely.',
            'Many patients consult Dr. Shah Alam for clarification before deciding on injections, surgery, or other treatments.',
          ],
        },
      },
      {
        question: 'Do you offer online consultations?',
        answer: {
          paragraphs: [
            'Yes.',
            'Online consultations may be available for patients who cannot attend in person.',
          ],
        },
      },
      {
        question: 'Can I book for a family member?',
        answer: {
          paragraphs: [
            'Yes.',
            'You may schedule consultations on behalf of family members.',
          ],
        },
      },
    ],
  },
];

export type FAQSearchResult = FAQItem & {
  categoryId: string;
  categoryName: string;
};

function getFaqSearchText(faq: FAQItem): string {
  return [
    faq.question,
    ...faq.answer.paragraphs,
    ...(faq.answer.bullets ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

export function searchFaqs(query: string): FAQSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return faqCategories.flatMap((category) =>
    category.faqs
      .filter((faq) => getFaqSearchText(faq).includes(normalizedQuery))
      .map((faq) => ({
        ...faq,
        categoryId: category.id,
        categoryName: category.name,
      }))
  );
}

export function getFaqsForCategory(categoryId: string): FAQSearchResult[] {
  const category =
    faqCategories.find((item) => item.id === categoryId) ?? faqCategories[0];

  return category.faqs.map((faq) => ({
    ...faq,
    categoryId: category.id,
    categoryName: category.name,
  }));
}

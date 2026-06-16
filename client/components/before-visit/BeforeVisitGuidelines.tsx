import ScrollReveal from '@/components/ScrollReveal';

type ChecklistBlock = {
  type: 'checklist';
  heading: string;
  intro?: string;
  items: string[];
};

type DetailBlock = {
  type: 'detail';
  title: string;
  description: string;
};

type ParagraphBlock = {
  type: 'paragraph';
  title: string;
  description: string;
};

type GuidelineSection = {
  eyebrow: string;
  title: string;
  intro: string;
  icon: string;
  blocks: Array<ChecklistBlock | DetailBlock | ParagraphBlock>;
};

const guidelineSections: GuidelineSection[] = [
  {
    eyebrow: 'WHAT TO BRING',
    title: 'Bring The Right Information',
    intro:
      'Having the right documents available allows for a more accurate evaluation and treatment discussion.',
    icon: 'folder_open',
    blocks: [
      {
        type: 'checklist',
        heading: 'Please Bring:',
        items: [
          'MRI Reports (if available)',
          'X-Ray Reports',
          'CT Scan Reports',
          'Previous Prescriptions',
          'Medical Test Results',
          'Hospital Discharge Summaries',
          'Previous Treatment Records',
          'Current Medication List',
        ],
      },
      {
        type: 'checklist',
        heading: 'Optional But Helpful',
        items: [
          'Previous Physiotherapy Records',
          'Epidural Steroid Injection Records',
          'Surgery Records (if applicable)',
          'Symptom Notes',
        ],
      },
    ],
  },
  {
    eyebrow: 'ARRIVAL INSTRUCTIONS',
    title: 'Make Your Visit Smooth & Stress-Free',
    intro: '',
    icon: 'schedule',
    blocks: [
      {
        type: 'detail',
        title: 'Arrive Early',
        description:
          'Please arrive at least 15 minutes before your scheduled appointment to complete registration and administrative procedures.',
      },
      {
        type: 'detail',
        title: 'Check-In Process',
        description:
          'Upon arrival, our team will assist you with registration and consultation preparation.',
      },
      {
        type: 'detail',
        title: 'Bring Identification',
        description:
          'Please carry a valid photo ID if required for registration purposes.',
      },
      {
        type: 'detail',
        title: 'Appointment Confirmation',
        description:
          'Keep your appointment confirmation message or WhatsApp notification available.',
      },
    ],
  },
  {
    eyebrow: 'PREPARATION CHECKLIST',
    title: 'Help Us Understand Your Condition Better',
    intro: '',
    icon: 'checklist',
    blocks: [
      {
        type: 'paragraph',
        title: 'Wear Comfortable Clothing',
        description:
          'Loose, comfortable clothing allows easier physical examination and movement assessment when needed.',
      },
      {
        type: 'checklist',
        heading: 'Think About Your Symptoms',
        intro: 'Before your visit, consider:',
        items: [
          'Where is the pain located?',
          'When did the symptoms begin?',
          'What activities worsen the symptoms?',
          'What activities improve the symptoms?',
          'Are you experiencing numbness, tingling, or weakness?',
        ],
      },
      {
        type: 'paragraph',
        title: 'Prepare Your Questions',
        description:
          'Write down any questions or concerns so that nothing important is forgotten during your consultation.',
      },
      {
        type: 'paragraph',
        title: 'Stay Hydrated',
        description:
          'Drink adequate water and eat normally unless instructed otherwise.',
      },
    ],
  },
];

function Checklist({ heading, intro, items }: { heading: string; intro?: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-bold text-text-main dark:text-white text-sm mb-3">{heading}</h4>
      {intro && <p className="text-sm text-text-sub mb-2">{intro}</p>}
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-text-sub">
            <span className="material-symbols-outlined text-accent">check_circle</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionBlocks({ blocks }: { blocks: GuidelineSection['blocks'] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        if (block.type === 'checklist') {
          return (
            <Checklist
              key={block.heading}
              heading={block.heading}
              intro={block.intro}
              items={block.items}
            />
          );
        }

        if (block.type === 'detail') {
          return (
            <div key={block.title} className="border-l-4 border-accent/40 pl-4">
              <h4 className="font-bold text-text-main dark:text-white text-sm mb-1">
                {block.title}
              </h4>
              <p className="text-sm text-text-sub leading-relaxed">{block.description}</p>
            </div>
          );
        }

        return (
          <div key={block.title}>
            <h4 className="font-bold text-text-main dark:text-white text-sm mb-1">
              {block.title}
            </h4>
            <p className="text-sm text-text-sub leading-relaxed">{block.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function BeforeVisitGuidelines() {
  return (
    <section className="py-12 lg:py-16 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {guidelineSections.map((section, index) => (
            <ScrollReveal
              key={section.eyebrow}
              direction="up"
              delay={index * 0.1}
              className="bg-background-light dark:bg-background-dark rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-hover transition-all duration-300 group flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-white dark:bg-surface-dark rounded-2xl flex items-center justify-center text-primary shadow-sm mb-5 group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">{section.icon}</span>
              </div>

              <p className="text-accent font-bold tracking-wider uppercase text-xs mb-2">
                {section.eyebrow}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white mb-3">
                {section.title}
              </h3>

              {section.intro && (
                <p className="text-text-sub text-sm mb-6 leading-relaxed">{section.intro}</p>
              )}

              <SectionBlocks blocks={section.blocks} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

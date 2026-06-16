import ScrollReveal from '@/components/ScrollReveal';

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-text-sub">
          <span className="material-symbols-outlined text-accent">check_circle</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const standardCardClass =
  'bg-background-light dark:bg-background-dark rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-soft';
const patientPromiseItems = [
  'Honest Medical Guidance',
  'Clear Treatment Explanations',
  'Respectful Communication',
  'Evidence-Based Recommendations',
  'Patient-Centered Care',
  'Focus On Long-Term Recovery',
];
export default function BeforeVisitNotice() {
  return (
    <section className="bg-white dark:bg-surface-dark pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal
          direction="up"
          className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 border border-primary/10 flex flex-col md:flex-row gap-6 items-start"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">priority_high</span>
          </div>
          <div>
            <p className="text-accent font-bold tracking-wider uppercase text-xs mb-2">
              Important For PLID &amp; Sciatica Patients
            </p>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
              Bring Your MRI If Available
            </h3>
            <p className="text-text-sub leading-relaxed mb-4">
              If you have PLID, sciatica, nerve pain, numbness, tingling, or weakness:
            </p>
            <p className="font-bold text-text-main dark:text-white text-sm mb-3">Please bring:</p>
            <Checklist
              items={[
                'MRI Films',
                'MRI Report',
                'Previous Prescriptions',
                'Injection Records',
                'Previous Surgical Records',
              ]}
            />
            <div className="mt-6 pt-6 border-t border-primary/10">
              <p className="font-bold text-text-main dark:text-white text-sm mb-2">Important Reminder</p>
              <p className="text-text-sub text-sm leading-relaxed">
                An MRI report alone does not determine treatment. Your symptoms, physical examination, lifestyle, and recovery goals are equally important.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" className={standardCardClass}>
          <p className="text-primary font-bold tracking-wider uppercase text-xs mb-2">
            Important Notice For New Patients
          </p>
          <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">
            First Consultation Information
          </h3>
          <p className="text-text-sub text-sm leading-relaxed mb-4">
            Your initial consultation is designed to help us understand your condition in detail.
            During this visit we may:
          </p>
          <Checklist
            items={[
              'Review your medical history',
              'Discuss your symptoms',
              'Examine affected areas',
              'Review investigations',
              'Explain treatment options',
              'Develop a personalized recovery strategy',
            ]}
          />
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="font-bold text-text-main dark:text-white text-sm mb-2">Consultation Duration</p>
            <p className="text-text-sub text-sm leading-relaxed">
              Most first consultations typically require approximately 20–40 minutes, depending on the complexity of the condition.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" className='max-w-3xl mx-auto text-center py-12'>          
          <h3 className="lg:text-4xl text-2xl font-bold text-text-main dark:text-white mb-3">
            Need To Change Your Appointment?
          </h3>
          <p className="text-text-sub lg:text-xl text-base leading-relaxed mb-4">
            If you need to cancel or reschedule your appointment, please inform our team as early as possible.
            Advance notice helps us serve other patients efficiently and maintain smooth scheduling.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className="max-w-4xl mx-auto text-center py-12">
          <h3 className="lg:text-4xl text-2xl font-bold text-text-main dark:text-white mb-10">
            What You Can Expect From Us
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {patientPromiseItems.map((item, index) => (
              <span
                key={index}
                className="px-6 py-3 rounded-full bg-primary dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-white dark:text-gray-300 text-sm font-semibold"
              >
                {item}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" className="max-w-3xl mx-auto text-center py-12">
          <h3 className="lg:text-4xl text-2xl font-bold text-text-main dark:text-white mb-3">
            We Look Forward To Meeting You
          </h3>
          <p className="text-text-sub lg:text-xl text-base leading-relaxed mb-4">
            Every recovery journey begins with understanding.
            The more prepared you are, the more productive your consultation will be.
          <br />
            Thank you for trusting Dr. Shah Alam and our team with your health.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

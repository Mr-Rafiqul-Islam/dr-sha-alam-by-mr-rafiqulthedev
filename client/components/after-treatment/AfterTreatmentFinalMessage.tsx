import ScrollReveal from '@/components/ScrollReveal';

export default function AfterTreatmentFinalMessage() {
  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center">
        
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white mb-4">
            Thank You For Trusting Us With Your Care
          </h2>
          <div className="space-y-4 text-text-sub text-sm md:text-base leading-relaxed mb-10">
            <p>
              Our goal is not simply to reduce symptoms but to help you move better,
              function better, and live with greater confidence.
            </p>
            <p>
              We are committed to supporting you throughout your recovery journey.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="h-px bg-gray-200 dark:bg-gray-700 w-16"></div>
            <p className="font-handwriting text-2xl font-bold text-primary italic">
              Dr. Shah Alam
            </p>
            <p className="text-sm text-text-sub font-medium">
              Orthopedic Spine Specialist &amp; Therapeutic Yoga Practitioner
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

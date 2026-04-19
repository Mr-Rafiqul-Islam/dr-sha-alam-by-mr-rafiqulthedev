import ScrollReveal from '@/components/ScrollReveal';

export default function BeforeVisitNotice() {
  return (
    <section className="bg-white dark:bg-surface-dark pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 border border-primary/10 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">priority_high</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Important Notice for New Patients</h3>
            <p className="text-text-sub leading-relaxed">
              If this is your first time visiting Dr. Shah Alam, please note that the initial consultation usually lasts between 30 to 45 minutes. This detailed assessment allows us to create a personalized rehabilitation plan tailored to your lifestyle and needs. If you need to cancel or reschedule, please contact us at least 24 hours in advance.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

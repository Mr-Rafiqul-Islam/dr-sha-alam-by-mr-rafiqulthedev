import ScrollReveal from '@/components/ScrollReveal';

export default function AfterTreatmentFAQ() {
  return (
    <ScrollReveal direction="up" className="border-t border-gray-200 dark:border-gray-800 pt-12">
      <h3 className="text-2xl font-bold text-text-main dark:text-white mb-8 text-center">Common Questions</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-primary dark:text-accent mb-2 text-sm">Can I drive after treatment?</h4>
          <p className="text-text-sub text-sm">It depends on the procedure. Generally, we advise avoiding driving for 24 hours if you received any injections or sedation.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h4 className="font-bold text-primary dark:text-accent mb-2 text-sm">When can I return to work?</h4>
          <p className="text-text-sub text-sm">Most patients return to desk jobs within 2-3 days. Jobs requiring physical labor may need 1-2 weeks of rest.</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

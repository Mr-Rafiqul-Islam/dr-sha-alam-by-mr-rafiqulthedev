import ScrollReveal from '@/components/ScrollReveal';

export default function PatientGuidelinesPostTreatment() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark" id="after-treatment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-md">2</div>
          <h2 className="text-3xl font-extrabold text-primary dark:text-white">Post-Treatment Care</h2>
        </ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <ScrollReveal direction="up" className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-50 dark:bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">water_drop</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Rest and Hydration</h3>
                <p className="text-text-sub leading-relaxed">
                  Adequate rest is crucial for tissue repair. Drink at least 8-10 glasses of water daily to keep your joints lubricated and facilitate healing. Avoid strenuous activities for the first 48 hours unless advised otherwise.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1} className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-50 dark:bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">directions_run</span>
              </div>
              <div id="exercise-rules">
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Follow the Exercise Plan</h3>
                <p className="text-text-sub leading-relaxed">
                  Consistency is key. Perform your prescribed rehabilitation exercises exactly as demonstrated. Do not overexert yourself; if you feel sharp pain, stop immediately and contact us.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2} className="flex gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-50 dark:bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">monitor_heart</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Monitor Symptoms</h3>
                <p className="text-text-sub leading-relaxed">
                  Keep a daily log of your pain levels and mobility improvements. Note any unusual swelling, redness, or persistent discomfort and bring this log to your follow-up appointment.
                </p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="up" delay={0.3} className="relative bg-background-light dark:bg-background-dark rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">rule</span> General Rules &amp; Policies
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-1">check_circle</span>
                <span className="text-text-sub text-sm font-medium leading-relaxed"><strong className="text-text-main dark:text-gray-200">Cancellation Policy:</strong> Please notify us at least 24 hours in advance if you need to reschedule or cancel your appointment.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-1">check_circle</span>
                <span className="text-text-sub text-sm font-medium leading-relaxed"><strong className="text-text-main dark:text-gray-200">Privacy of Records:</strong> Your medical records are strictly confidential and will only be shared with your consent or for direct medical necessity.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-1">check_circle</span>
                <span className="text-text-sub text-sm font-medium leading-relaxed"><strong className="text-text-main dark:text-gray-200">Payment:</strong> Payment is due at the time of service. We accept cash, credit cards, and major digital wallets.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent mt-1">check_circle</span>
                <span className="text-text-sub text-sm font-medium leading-relaxed"><strong className="text-text-main dark:text-gray-200">Late Arrivals:</strong> If you are more than 20 minutes late, we may need to reschedule your appointment to ensure other patients are not delayed.</span>
              </li>
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
import ScrollReveal from '@/components/ScrollReveal';

export default function EducationAndAwards() {
  return (
    <section className="py-24 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal direction="right">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white">Education &amp; Training</h3>
            </div>
            <div className="space-y-8 relative">
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-surface-dark border-2 border-primary rounded-full z-10">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">MBBS</h4>
                <p className="text-primary font-medium mb-1">Rangpur Medical College</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-surface-dark border-2 border-primary rounded-full z-10">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">D-Ortho (BSMMU)</h4>
                <p className="text-primary font-medium mb-1">Bangabandhu Sheikh Mujib Medical University (PG Hospital), Dhaka</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-surface-dark border-2 border-primary rounded-full z-10">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">Clinical Training</h4>
                <p className="text-primary font-medium mb-1">Shaheed Suhrawardy Medical College Hospital, Dhaka</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center">
                <span className="material-symbols-outlined">award_star</span>
              </div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white">Professional Credentials</h3>
            </div>
            <div className="grid gap-6">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">vaccines</span>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-lg">Advanced Pain Medicine Training</h4>
                  <p className="text-text-sub text-sm">Special Course in Pain Medicine, India</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">domain</span>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-lg">Industry Experience</h4>
                  <p className="text-text-sub text-sm">Former Medical Professional, Square Pharmaceuticals Ltd.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">self_improvement</span>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-lg">Yoga Certification</h4>
                  <p className="text-text-sub text-sm">Certified Life Member, Indian Yoga Association</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

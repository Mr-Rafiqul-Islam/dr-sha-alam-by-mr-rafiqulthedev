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
                <h4 className="text-xl font-bold text-text-main dark:text-white">MBBS (Bachelor of Medicine)</h4>
                <p className="text-primary font-medium mb-1">Dhaka Medical College</p>
                <p className="text-text-sub text-sm">Graduated with Honors in Anatomy &amp; Physiology.</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-surface-dark border-2 border-primary rounded-full z-10">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">MS (Orthopedics)</h4>
                <p className="text-primary font-medium mb-1">Bangabandhu Sheikh Mujib Medical University</p>
                <p className="text-text-sub text-sm">Specialized in non-surgical spine management.</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center bg-white dark:bg-surface-dark border-2 border-primary rounded-full z-10">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">Advanced Yoga Therapy</h4>
                <p className="text-primary font-medium mb-1">Yoga Institute of India</p>
                <p className="text-text-sub text-sm">Certified in therapeutic yoga for musculoskeletal disorders.</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center">
                <span className="material-symbols-outlined">award_star</span>
              </div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white">Certifications &amp; Awards</h3>
            </div>
            <div className="grid gap-6">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-start gap-4">
                <span className="material-symbols-outlined text-yellow-500 text-3xl">trophy</span>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-lg">Best Rehab Specialist 2023</h4>
                  <p className="text-text-sub text-sm">Awarded by National Orthopedic Association for excellence in non-invasive care.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">badge</span>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-lg">Member, BMA</h4>
                  <p className="text-text-sub text-sm">Life Member of Bangladesh Medical Association.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">groups</span>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white text-lg">Member, Spine Society</h4>
                  <p className="text-text-sub text-sm">Active contributor to research on spinal health and posture.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function AboutStats() {
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - 2011;

  return (
    <section className="py-16 bg-primary dark:bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-accent">
              <span className="material-symbols-outlined text-4xl">history_edu</span>
            </div>
            <span className="text-4xl font-bold mb-2 flex items-center">
              <AnimatedCounter value={yearsExperience} suffix="+" />
            </span>
            <span className="text-lg font-medium text-white/80">Years Experience</span>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-accent">
              <span className="material-symbols-outlined text-4xl">sentiment_satisfied</span>
            </div>
            <span className="text-4xl font-bold mb-2 flex items-center">
              <AnimatedCounter value={5000} suffix="+" />
            </span>
            <span className="text-lg font-medium text-white/80">Successful Recoveries</span>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-accent">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
            </div>
            <span className="text-4xl font-bold mb-2">Certified</span>
            <span className="text-lg font-medium text-white/80">Board Specialist</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

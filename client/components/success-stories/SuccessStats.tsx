import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function SuccessStats() {
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - 2011;

  return (
    <section className="py-16 bg-primary dark:bg-primary-dark text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="p-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <h4 className="text-4xl font-extrabold mb-2 flex items-center justify-center">
              <AnimatedCounter value={5000} suffix="+" />
            </h4>
            <p className="text-white/80 font-medium">Patients Treated Successfully</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">trending_up</span>
            </div>
            <h4 className="text-4xl font-extrabold mb-2 flex items-center justify-center">
              <AnimatedCounter value={98} suffix="%" />
            </h4>
            <p className="text-white/80 font-medium">Patient Improvement Rate</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">workspace_premium</span>
            </div>
            <h4 className="text-4xl font-extrabold mb-2 flex items-center justify-center">
              <AnimatedCounter value={yearsExperience} suffix="+" />
            </h4>
            <p className="text-white/80 font-medium">Years of Clinical Experience</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

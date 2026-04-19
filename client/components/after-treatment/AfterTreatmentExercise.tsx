import ScrollReveal from '@/components/ScrollReveal';

export default function AfterTreatmentExercise() {
  return (
    <ScrollReveal direction="up" className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">self_improvement</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Exercise Adherence</h2>
      </div>
      <div className="prose dark:prose-invert max-w-none text-text-sub mb-8">
        <p>Your custom yoga-rehab plan is the core of your treatment. Consistency is key to retraining your muscles and correcting posture.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-2xl border border-transparent hover:border-accent/30 transition-all group">
          <div className="w-10 h-10 bg-white dark:bg-surface-dark rounded-lg flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <h4 className="font-bold text-text-main dark:text-white mb-2">Routine is Key</h4>
          <p className="text-sm text-text-sub">Perform exercises at the same time each day to build a habit. Morning sessions are recommended for stiffness.</p>
        </div>
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-2xl border border-transparent hover:border-accent/30 transition-all group">
          <div className="w-10 h-10 bg-white dark:bg-surface-dark rounded-lg flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">graphic_eq</span>
          </div>
          <h4 className="font-bold text-text-main dark:text-white mb-2">Listen to Your Body</h4>
          <p className="text-sm text-text-sub">Discomfort is normal, but sharp pain is not. Stop immediately if you feel sharp pain and consult us.</p>
        </div>
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-2xl border border-transparent hover:border-accent/30 transition-all group">
          <div className="w-10 h-10 bg-white dark:bg-surface-dark rounded-lg flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">slow_motion_video</span>
          </div>
          <h4 className="font-bold text-text-main dark:text-white mb-2">Slow Movements</h4>
          <p className="text-sm text-text-sub">Perform yoga movements slowly. Rushing reduces effectiveness and increases injury risk.</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

import ScrollReveal from '@/components/ScrollReveal';

export default function AfterTreatmentRecoveryTips() {
  return (
    <ScrollReveal direction="up" className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">healing</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Recovery Tips</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-primary dark:text-accent mb-3">
              <span className="material-symbols-outlined">bed</span> Rest &amp; Sleep
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-text-sub">
                <span className="material-symbols-outlined text-accent text-sm mt-1 shrink-0">check_circle</span>
                <span>Ensure you get at least 7-8 hours of quality sleep to aid tissue repair.</span>
              </li>
              <li className="flex gap-3 text-text-sub">
                <span className="material-symbols-outlined text-accent text-sm mt-1 shrink-0">check_circle</span>
                <span>Use the prescribed pillows or orthopedic supports to maintain proper spinal alignment while sleeping.</span>
              </li>
              <li className="flex gap-3 text-text-sub">
                <span className="material-symbols-outlined text-accent text-sm mt-1 shrink-0">check_circle</span>
                <span>Avoid sleeping on your stomach if you have lower back pain.</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-primary dark:text-accent mb-3">
              <span className="material-symbols-outlined">water_drop</span> Hydration &amp; Diet
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-text-sub">
                <span className="material-symbols-outlined text-accent text-sm mt-1 shrink-0">check_circle</span>
                <span>Drink plenty of water (2-3 liters daily) to keep spinal discs hydrated.</span>
              </li>
              <li className="flex gap-3 text-text-sub">
                <span className="material-symbols-outlined text-accent text-sm mt-1 shrink-0">check_circle</span>
                <span>Consume anti-inflammatory foods like turmeric, ginger, leafy greens, and fatty fish.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-background-light dark:bg-background-dark rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-white dark:bg-surface-dark rounded-full flex items-center justify-center shadow-md mb-4 text-orange-400">
            <span className="material-symbols-outlined text-4xl">warning</span>
          </div>
          <h4 className="font-bold text-text-main dark:text-white mb-2">Avoid Heavy Lifting</h4>
          <p className="text-sm text-text-sub mb-4">Strictly avoid lifting objects heavier than 5kg during the first 2 weeks of your recovery phase.</p>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-orange-400"></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Recovery Phase 1</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

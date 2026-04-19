import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function FeaturedTransformations() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Featured Transformations</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">Life-Changing Results</h3>
        </ScrollReveal>
        <div className="space-y-12">
          <ScrollReveal direction="up" delay={0.1} className="bg-background-light dark:bg-background-dark rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative h-64 lg:h-full lg:min-h-[280px] lg:self-stretch">
              <Image alt="Elderly woman doing yoga stretches" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT6knM8_QcNLiYcX0uBqxrdRM-3ULKLBLk2xSqOO-N2XcVLXMuZS9OvlVsPA_If2Er5pHWFxdk9iYIfnGXJGkgTPgb5lxc5680G7BXKTlbieUstsQqpcN29lphzNHuXZRjnSLNkIeINreYGH4GBA9zRo06mbcaoqro8EQ9DJhhEwDisP037XwjQoOAAbJHHz_m4EUCGEzNY9tu_ISGWiWKgPt2mf61KOpdWO336Bi-oDr7ywCICo00co53GdzWziv-S7iHXdz2IEs" fill sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-primary font-bold text-sm shadow-sm">
                Age 65
              </div>
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-bold text-text-main dark:text-white">Mrs. Farida&apos;s Journey</h4>
                <div className="flex text-yellow-400">
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                </div>
              </div>
              <p className="text-text-sub text-lg mb-8 italic">&quot;After struggling with severe arthritis for a decade, I was resigned to a wheelchair. Dr. Alam&apos;s holistic approach gave me my independence back.&quot;</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Problem</p>
                  <p className="font-semibold text-primary dark:text-white">Severe Knee Osteoarthritis</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Treatment</p>
                  <p className="font-semibold text-primary dark:text-white">PRP Therapy &amp; Rehab Yoga</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Result</p>
                  <p className="font-semibold text-accent">Walking Without Support</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="bg-background-light dark:bg-background-dark rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row-reverse">
            <div className="lg:w-2/5 relative h-64 lg:h-full lg:min-h-[280px] lg:self-stretch">
              <Image alt="Young man playing sports" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1CMgguKxAby2FKgSxEstybmrrl4t2G1gKVCjop4zkBYnXZrIj_KZQbaTxjtLcMx6QQsqO8RJiGgrZccotm_KWA73E-vP7TDzLEhYRXSsPSAUyUxacRar2VdYxVlXgPZRxzh8iMmvaTi9Zt2cRvv1qKtKMCTVoEQb9l1aSQKtPF6KBPrczSFDRHBW8IfAfysjTmGXmWwB8cVbiIqgSpXAwla8ECuGrhigOBjq4UUzofqoURzyFOBUcFP-EEieq9_whuopYkGe-DaU" fill sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-primary font-bold text-sm shadow-sm">
                Age 28
              </div>
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center text-left lg:text-right">
              <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center gap-4 mb-6">
                <h4 className="text-2xl font-bold text-text-main dark:text-white">Karim&apos;s Sports Recovery</h4>
                <div className="flex text-yellow-400">
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                </div>
              </div>
              <p className="text-text-sub text-lg mb-8 italic">&quot;I tore my ACL and thought my cricket career was over. The non-surgical rehab protocol was tough but effective. I&apos;m back on the field stronger than before.&quot;</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6" dir="ltr"> 
                <div className="lg:text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Problem</p>
                  <p className="font-semibold text-primary dark:text-white">ACL Tear &amp; Meniscus Injury</p>
                </div>
                <div className="lg:text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Treatment</p>
                  <p className="font-semibold text-primary dark:text-white">Functional Rehabilitation</p>
                </div>
                <div className="lg:text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Result</p>
                  <p className="font-semibold text-accent">Return to Competitive Sport</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

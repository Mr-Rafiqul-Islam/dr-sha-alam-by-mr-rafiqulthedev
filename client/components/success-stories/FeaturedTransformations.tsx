import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function FeaturedTransformations() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">
            Featured Transformations
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-3">
            Life-Changing PLID Recovery Stories
          </h3>
          <p className="text-sm lg:text-base text-text-sub max-w-2xl mx-auto leading-relaxed font-medium">
            Discover how patients suffering from PLID, sciatica, nerve
            compression, and chronic back pain regained mobility, confidence,
            and quality of life through the right diagnosis, structured
            treatment, and expert guidance.
          </p>
        </ScrollReveal>
        <div className="gap-x-6 lg:gap-y-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
          <ScrollReveal
            direction="up"
            delay={0.1}
            className="bg-background-light dark:bg-background-dark rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row"
          >
            <div className="relative aspect-square lg:w-2/5">
              <Image
                alt="Elderly woman doing yoga stretches"
                className="object-cover"
                src="/fetaured-stories-female.jpeg"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-primary font-bold text-sm shadow-sm">
                Age 65
              </div>
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-2xl font-bold text-text-main dark:text-white">
                  Mrs. Nasima&apos;s PLID Recovery Journey
                </h4>
                <div className="flex text-yellow-400">
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                </div>
              </div>
              <p className="text-text-sub text-lg mb-8 italic">
                &quot;When I first saw my MRI report, I thought surgery was my
                only option. The pain shooting down my leg made even walking
                difficult. Through a structured recovery plan, therapeutic yoga,
                and proper guidance, I gradually regained my mobility and
                confidence. Today, I can walk, pray, and perform my daily
                activities comfortably again.&quot;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Problem
                  </p>
                  <p className="font-semibold text-primary dark:text-white">
                    Severe PLID With Sciatica
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Treatment
                  </p>
                  <p className="font-semibold text-primary dark:text-white">
                    Conservative PLID Treatment <br />
                    Therapeutic Yoga & Rehabilitation
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Result
                  </p>
                  <p className="font-semibold text-accent">
                    Walking Comfortably Without Surgery
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal
            direction="up"
            delay={0.2}
            className="bg-background-light dark:bg-background-dark rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row-reverse"
          >
            <div className="relative aspect-square lg:w-2/5">
              <Image
                alt="Young man playing sports"
                className="object-cover"
                src="/fetaured-stories-male.jpeg"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-primary font-bold text-sm shadow-sm">
                Age 28
              </div>
            </div>
            <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center text-left lg:text-right">
              <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center gap-4 mb-6">
                <h4 className="text-2xl font-bold text-text-main dark:text-white">
                  Karim&apos;s Sciatica Recovery Story
                </h4>
                <div className="flex text-yellow-400">
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm fill-current">
                    star
                  </span>
                </div>
              </div>
              <p className="text-text-sub text-lg mb-8 italic">
                &quot;The numbness and tingling in my leg were affecting both my
                work and personal life. I feared permanent nerve damage and
                worried that surgery was inevitable. After understanding my
                condition and following the recovery plan consistently, my
                symptoms improved dramatically. Today, I&apos;m back to work and
                living an active life again.&quot;
              </p>
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6"
                dir="ltr"
              >
                <div className="lg:text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Problem
                  </p>
                  <p className="font-semibold text-primary dark:text-white">
                    PLID With Severe Sciatic Nerve Pain
                  </p>
                </div>
                <div className="lg:text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Treatment
                  </p>
                  <p className="font-semibold text-primary dark:text-white">
                    Personalized Recovery Program <br />
                    Exercise Therapy & Lifestyle Modification
                  </p>
                </div>
                <div className="lg:text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Result
                  </p>
                  <p className="font-semibold text-accent">
                  Pain-Free Return To Daily Activities
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

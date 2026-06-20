import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function VisualEvidence() {
  return (
    <section className="lg:py-20 py-12 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center lg:mb-16 mb-8">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">See What&apos;s Possible</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">Real Progress. Real Recovery. Real Confidence.</h3>
          <p className="text-text-sub max-w-2xl mx-auto text-sm lg:text-base mt-2">Recovery is not just about reducing pain. It&apos;s about restoring movement, improving function, and helping patients return to the activities they love.</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal direction="up" delay={0.1} className="bg-background-light dark:bg-background-dark p-6 rounded-3xl">
            <h4 className="text-xl font-bold text-center mb-6 text-text-main dark:text-white">
              PLID Recovery &amp; Posture Improvement
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  BEFORE
                </div>
                <Image
                  alt="PLID recovery before posture"
                  className="object-cover filter grayscale opacity-80 transition-transform duration-300 group-hover:scale-105"
                  src="/before-one.jpeg"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Severe lower back pain, poor posture, difficulty standing for long periods, and fear of movement caused by PLID and nerve irritation.
                  </p>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  AFTER (12 Weeks)
                </div>
                <Image
                  alt="PLID recovery after posture improvement"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src="/after-one.jpeg"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Improved posture, better spinal stability, increased confidence in movement, and significant reduction in pain and stiffness through structured rehabilitation and therapeutic yoga.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-text-sub mt-4">
              Case: PLID Patient Successfully Recovered Through Conservative Treatment &amp; Therapeutic Yoga
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="bg-background-light dark:bg-background-dark p-6 rounded-3xl">
            <h4 className="text-xl font-bold text-center mb-6 text-text-main dark:text-white">
              Sciatica &amp; Leg Pain Recovery
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  BEFORE
                </div>
                <Image
                  alt="Sciatica and leg pain before recovery"
                  className="object-cover filter grayscale opacity-80 transition-transform duration-300 group-hover:scale-105"
                  src="/before-2.jpeg"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Persistent leg pain, tingling, numbness, and difficulty walking due to sciatic nerve compression caused by PLID.
                  </p>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  AFTER (8 Weeks)
                </div>
                <Image
                  alt="Sciatica and leg pain after recovery"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src="/after-2.jpeg"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Reduced nerve pain, improved walking ability, restored daily function, and greater independence without surgery.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-text-sub mt-4">
              Case: PLID With Sciatica Successfully Managed Through Personalized Recovery Program
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

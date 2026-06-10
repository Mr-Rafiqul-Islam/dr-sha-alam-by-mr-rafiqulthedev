import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

const highlights = [
  'Orthopedic Spine Specialist',
  'Certified Yoga Instructor',
  '12+ Years Experience',
  '1000+ Spine Surgeries',
  '10,000+ Epidural Procedures',
  'Millions Reached Through Health Education',
];

export default function AboutSection() {
  return (
    <ScrollReveal direction="up">
      <section
        className="lg:py-24 py-16 bg-white dark:bg-surface-dark overflow-hidden"
        id="about"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-background-light dark:border-background-dark">
                <Image
                  alt="Dr. Shah Alam consulting with a patient in a modern office"
                  className="w-full h-auto object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOTjSAc1-lI6k7AWc9vIFTe1T3qZTUMpLURsHX5VugOOkg0mk7bhLy3jL078SBvDZ7AjPA-yAfXfo2ZuDvQk1elqdntezlYPbZNCaagEAoeiTm6OIGzSBjn7runX6jW9bo51kg7kNnf8adIw5D3wXSXevUB2M8XGTE22l-C5_FGsE_vJGMgkuHkFQP9QF1a02KMIdRHlNaAHoldCZkUlnsNhjAmGIY2q-xH9kpdQsNzlIi9ATCjHUhJPWvf3wARUi04_zChL0EQQ4"
                  width={1200}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-xl items-start gap-1 max-w-xs border border-gray-100 dark:border-gray-700 hidden md:flex md:flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <Image
                      alt=""
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-surface-dark object-cover bg-gray-200 dark:bg-gray-700"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=80"
                      width={32}
                      height={32}
                      sizes="32px"
                    />
                    <Image
                      alt=""
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-surface-dark object-cover bg-gray-200 dark:bg-gray-700"
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80"
                      width={32}
                      height={32}
                      sizes="32px"
                    />
                    <Image
                      alt=""
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-surface-dark object-cover bg-gray-200 dark:bg-gray-700"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
                      width={32}
                      height={32}
                      sizes="32px"
                    />
                  </div>
                  <span className="text-xs font-bold text-text-main dark:text-white">
                    +2k Patients
                  </span>
                </div>
                <p className="text-xs text-text-sub">
                  Trusted by thousands for non-surgical recovery.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">
                MEET DR SHAH ALAM
              </h2>
              <h3 className="text-2xl md:text-4xl font-extrabold text-primary dark:text-white mb-6">
                Combining Modern Spine Care With Therapeutic Yoga
              </h3>
              <div className="space-y-6 text-text-sub">
                <p className="text-base md:text-lg leading-relaxed">
                  Dr. Shah Alam is an Orthopedic Spine Specialist and Certified
                  Yoga Instructor dedicated to helping people make better
                  treatment decisions and achieve lasting recovery. For more
                  than a decade, he has worked with patients suffering from
                  PLID, sciatica, back pain, neck pain, and musculoskeletal
                  disorders.
                </p>
                <div className="space-y-6">
                  <div className="relative border-l-4 border-accent bg-accent/5 dark:bg-accent/10 rounded-r-2xl px-5 py-4">
                    <p className="text-sm font-bold uppercase tracking-wide text-text-main dark:text-white mb-2">
                      His mission is simple:
                    </p>
                    <blockquote className="text-sm md:text-base font-semibold italic text-primary dark:text-white leading-relaxed">
                      &ldquo;Help patients avoid unnecessary suffering,
                      unnecessary procedures, and unnecessary surgery.&rdquo;
                    </blockquote>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-xl border border-transparent hover:border-accent/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-primary text-xl shrink-0">
                          verified
                        </span>
                        <span className="text-sm font-semibold text-text-main dark:text-gray-200">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Link
                  className="inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors gap-2 group"
                  href="/about"
                >
                  Read Full Biography
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

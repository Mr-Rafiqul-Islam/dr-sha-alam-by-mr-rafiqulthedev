import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutSection() {
  return (
    <ScrollReveal direction="up">
      <section className="py-24 bg-white dark:bg-surface-dark overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
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
                  <span className="text-xs font-bold text-text-main dark:text-white">+2k Patients</span>
                </div>
                <p className="text-xs text-text-sub">Trusted by thousands for non-surgical recovery.</p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Meet The Specialist</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-6">Dr. Shah Alam</h3>
              <div className="space-y-6 text-text-sub">
                <p className="text-lg leading-relaxed">
                  Dr. Shah Alam is a renowned specialist who bridges the gap between modern orthopedic science and traditional yoga therapy. His philosophy is simple: the body has an incredible capacity to heal itself when given the right guidance.
                </p>
                <p className="text-base leading-relaxed">
                  Rejecting the &quot;surgery-first&quot; mindset, Dr. Alam has developed a proprietary rehabilitation protocol that has helped thousands of patients avoid invasive procedures. Whether you are an athlete recovering from an injury or a senior citizen managing arthritis, his personalized care plans focus on long-term wellness.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-xl">
                  <span className="material-symbols-outlined text-primary">school</span>
                  <span className="text-sm font-bold text-text-main dark:text-gray-200">MBBS, MS (Ortho)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-xl">
                  <span className="material-symbols-outlined text-primary">self_improvement</span>
                  <span className="text-sm font-bold text-text-main dark:text-gray-200">Certified Yoga Therapist</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-xl">
                  <span className="material-symbols-outlined text-primary">local_hospital</span>
                  <span className="text-sm font-bold text-text-main dark:text-gray-200">Pain Management Expert</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-background-dark rounded-xl">
                  <span className="material-symbols-outlined text-primary">award_star</span>
                  <span className="text-sm font-bold text-text-main dark:text-gray-200">Best Rehab Award 2023</span>
                </div>
              </div>
              <div className="mt-10">
                <Link className="inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors gap-2 group" href="/about">
                  Read Full Biography
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

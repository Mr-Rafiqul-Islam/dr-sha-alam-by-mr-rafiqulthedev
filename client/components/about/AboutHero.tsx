import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function AboutHero() {
  return (
    <section className="relative py-20 lg:py-28 bg-white dark:bg-surface-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal direction="right" className="relative order-2 lg:order-1">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl z-0"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
            <div className="relative z-10 min-h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background-light dark:border-background-dark transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image alt="Dr. Shah Alam Portrait" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXyswzoTx0Ks3xnTRTj39uHpQsl1ZuUMtsAAL9aHcJuQLx8alBskvzCXQXp8Oi4vlwgGBhwQaG70s3K0GJyOzq-GchzxNoFsAStwzkgWzPkat2_XMpTiGt8hmpOZR3JxvM6PFxuxtsWfxWpKzOMMQ4bh39Kd-6aTgnq5e7asU2WjtjG7TiHe6KRX39buIcw5iIq7cHHlDh5dWKWJIRshM8iluJ7k3EJWtyHQQq8ZlJyY2TzlNbeAMYY3NJE8t3-uwIIZsf1UtPcEU" fill sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30">
              <span className="material-symbols-outlined text-sm">medical_services</span>
              Meet Dr. Alam
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white leading-tight">
              About <span className="text-text-main dark:text-gray-200">Dr. Shah Alam</span>
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-accent dark:text-accent-dark">
              Orthopedic Specialist &amp; Yoga-Based Rehabilitation Expert
            </h2>
            <div className="space-y-6 text-lg text-text-sub dark:text-gray-400 leading-relaxed">
              <p>
                Dr. Shah Alam is a pioneer in integrating modern orthopedic science with ancient yoga therapy. His career is defined by a single, powerful conviction: <strong className="text-text-main dark:text-white">surgery should always be the last resort.</strong>
              </p>
              <p>
                With over a decade of clinical practice, Dr. Alam has developed unique non-invasive protocols for treating chronic back pain, PLID, and joint mobility issues. He believes in empowering patients to heal their own bodies through precise movement, lifestyle adjustments, and evidence-based rehabilitation.
              </p>
              <p>
                &quot;My goal isn&apos;t just to treat the pain, but to correct the root cause so you can live a life without limits—naturally.&quot;
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

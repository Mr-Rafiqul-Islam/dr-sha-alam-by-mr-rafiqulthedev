import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function AboutHero() {
  return (
    <section className="relative py-20 lg:py-28 bg-white dark:bg-surface-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal
            direction="right"
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl z-0"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
            <div className="relative z-10 min-h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background-light dark:border-background-dark transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                alt="Dr. Shah Alam Portrait"
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXyswzoTx0Ks3xnTRTj39uHpQsl1ZuUMtsAAL9aHcJuQLx8alBskvzCXQXp8Oi4vlwgGBhwQaG70s3K0GJyOzq-GchzxNoFsAStwzkgWzPkat2_XMpTiGt8hmpOZR3JxvM6PFxuxtsWfxWpKzOMMQ4bh39Kd-6aTgnq5e7asU2WjtjG7TiHe6KRX39buIcw5iIq7cHHlDh5dWKWJIRshM8iluJ7k3EJWtyHQQq8ZlJyY2TzlNbeAMYY3NJE8t3-uwIIZsf1UtPcEU"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal
            direction="left"
            className="space-y-8 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30">
              <span className="material-symbols-outlined text-sm">
                medical_services
              </span>
              MEET DR. SHAH ALAM
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white leading-tight">
              About{" "}
              <span className="text-text-main dark:text-gray-200">
                Dr. Shah Alam
              </span>
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-accent dark:text-accent-dark">
              Orthopedic Specialist | Spine Surgeon | Certified Yoga Instructor
            </h2>
            <div className="lg:space-y-6 space-y-4 text-base lg:text-lg text-text-sub dark:text-gray-400 leading-relaxed">
              <p>
                Dr. Shah Alam is dedicated to helping people overcome pain,
                restore mobility, and make confident treatment decisions through
                evidence-based orthopedic care and therapeutic yoga.
              </p>
              <p>
                With years of experience in spine care, rehabilitation, and
                patient education, he has helped thousands of individuals
                suffering from PLID, sciatica, back pain, neck pain, and
                musculoskeletal disorders regain control of their health and
                quality of life.
              </p>
              <p>
                His unique approach combines modern medical science with
                therapeutic yoga, lifestyle modification, and patient education
                to create long-term recovery strategies—not temporary symptom
                relief.
              </p>
              <div className="space-y-2">
              <h3 className="text-xl font-black text-black">Personal Philosophy</h3>
              <p className="italic">
                &quot;My mission is simple: Help patients understand their
                condition, choose the right treatment, and achieve lasting
                recovery without unnecessary suffering.&quot;
              </p>
              <strong>— Dr. Shah Alam</strong>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

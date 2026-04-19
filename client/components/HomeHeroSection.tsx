import Image from 'next/image';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomeHeroSection() {
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - 2011;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal direction="right" className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30">
              <span className="material-symbols-outlined text-sm">verified</span>
              Verified Specialist
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-white leading-[1.15]">
              Trusted Orthopedic<br/>
              <span className="text-text-main dark:text-gray-200">Treatment Without</span><br/>
              <span className="text-accent">Unnecessary Surgery</span>
            </h1>
            <p className="text-lg text-text-sub max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Expert Orthopedic & Yoga-Based Rehabilitation specializing in non-invasive recovery for chronic pain and mobility issues. Restore your life naturally with evidence-based care.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/book" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-base font-bold h-14 px-10 rounded-full transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 flex items-center justify-center">
                Book Appointment
              </Link>
              <button className="w-full sm:w-auto bg-white border-2 border-gray-100 hover:border-primary/30 text-text-main hover:text-primary text-base font-bold h-14 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined">play_circle</span>
                Learn More
              </button>
            </div>
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-4">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-text-main dark:text-white">
                  <AnimatedCounter value={yearsExperience} suffix="+" />
                </h3>
                <p className="text-sm text-text-sub">Years Experience</p>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-text-main dark:text-white">
                  <AnimatedCounter value={5} suffix="k+" />
                </h3>
                <p className="text-sm text-text-sub">Happy Patients</p>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-text-main dark:text-white">
                  <AnimatedCounter value={98} suffix="%" />
                </h3>
                <p className="text-sm text-text-sub">Success Rate</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2} className="relative lg:h-[650px] flex items-center justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/20 rounded-full blur-3xl transform scale-110 z-0"></div>
            <div className="relative z-10 w-full h-full max-w-md lg:max-w-full mx-auto">
              <div className="relative h-full min-h-[320px] lg:min-h-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-surface-dark">
                <Image
                  alt="Professional portrait of Dr Shah Alam consulting a patient"
                  className="object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXyswzoTx0Ks3xnTRTj39uHpQsl1ZuUMtsAAL9aHcJuQLx8alBskvzCXQXp8Oi4vlwgGBhwQaG70s3K0GJyOzq-GchzxNoFsAStwzkgWzPkat2_XMpTiGt8hmpOZR3JxvM6PFxuxtsWfxWpKzOMMQ4bh39Kd-6aTgnq5e7asU2WjtjG7TiHe6KRX39buIcw5iIq7cHHlDh5dWKWJIRshM8iluJ7k3EJWtyHQQq8ZlJyY2TzlNbeAMYY3NJE8t3-uwIIZsf1UtPcEU"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute bottom-10 -left-6 lg:-left-12 z-20 bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-800 flex items-center gap-4 max-w-xs animate-[bounce_4s_infinite]">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main dark:text-white">Board Certified</p>
                  <p className="text-xs text-text-sub">Orthopedic Specialist</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

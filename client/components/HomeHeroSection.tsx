import Image from 'next/image';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomeHeroSection() {
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - 2014;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <ScrollReveal direction="right" className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30">
              <span className="material-symbols-outlined text-sm">verified</span>
              ORTHOPEDIC SPECIALIST
            </div>
            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary dark:text-white leading-[1.15]">
            Avoid Unnecessary Surgery<br/>
              <span className="text-text-main dark:text-gray-200">Recover From PLID,</span><br/>
              <span className="text-accent">Back Pain & Sciatica With The Right Treatment Path</span>
            </h1>
            <p className="text-lg text-text-sub max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Helping patients overcome PLID, sciatica, back pain, neck pain, and nerve-related disorders through evidence-based medical care, therapeutic yoga, lifestyle correction, and patient education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/appointment" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white xl:text-base text-sm font-bold h-14 px-10 rounded-full transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 flex items-center justify-center">
                Book Appointment
              </Link>
              <Link href="/success-stories" className="w-full sm:w-auto bg-white border-2 border-gray-100 hover:border-primary/30 text-text-main hover:text-primary xl:text-base text-sm font-bold h-14 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Success Stories
              </Link>
            </div>
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-4 gap-2">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  <AnimatedCounter value={yearsExperience} suffix="+" />
                </h3>
                <p className="text-xs text-text-sub">Years of Spine Care Experience</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  <AnimatedCounter value={1000} suffix="+" />
                </h3>
                <p className="text-xs text-text-sub">Spine Surgeries Performed</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  <AnimatedCounter value={10000} suffix="+" />
                </h3>
                <p className="text-xs text-text-sub">Epidural Steroid Injections</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  Millions+
                </h3>
                <p className="text-xs text-text-sub">Patients Reached Through Health Education
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2} className="relative lg:h-[650px] flex items-center justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/20 rounded-full blur-3xl transform scale-110 z-0"></div>
            <div className="relative z-10 w-full h-full max-w-md lg:max-w-full mx-auto">
              <div className="relative h-full min-h-[320px] lg:min-h-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-surface-dark">
                <Image
                  alt="Professional portrait of Dr Shah Alam consulting a patient"
                  className="object-cover object-bottom"
                  src="/Dr. Shah Alam-4.jpeg"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute xl:bottom-10 bottom-4 -left-6 lg:-left-12 z-20 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-800 flex items-center gap-3 max-w-xs animate-[bounce_4s_infinite]">
                <div className="xl:w-10 xl:h-10 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-primary-dark border border-green-100">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-xs xl:text-sm font-bold text-text-main dark:text-white">CERTIFIED YOGA INSTRUCTOR</p>
                  <p className="text-[10px] lg:text-xs text-text-sub">Orthopedic Specialist</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

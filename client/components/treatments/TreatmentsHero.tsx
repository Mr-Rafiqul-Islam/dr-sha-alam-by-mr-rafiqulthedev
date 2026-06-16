import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function TreatmentsHero() {
  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-br from-blue-50 to-white dark:from-surface-dark dark:to-background-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="up" className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              ORTHOPEDIC & SPINE CARE
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-primary dark:text-white leading-tight">
            Find The Right Treatment Before It&apos;s Too Late
            </h1>
            <p className="text-xl lg:text-2xl font-medium text-text-main dark:text-gray-200">
              Evidence-Based Orthopedic Treatments for Long-Term Healing
            </p>
            <p className="text-base text-text-sub max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Helping patients recover from PLID, sciatica, back pain, neck pain, and joint disorders through evidence-based medical care, therapeutic yoga, lifestyle modification, advanced pain management, and surgery only when truly necessary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link href="/appointment" className="bg-primary hover:bg-primary-dark text-white text-base font-bold h-12 px-8 rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center">
              Book Consultation
              </Link>
              <Link href="/contact" className="bg-white border border-gray-200 hover:border-primary text-text-main hover:text-primary text-base font-bold h-12 px-8 rounded-full transition-all shadow-sm flex items-center justify-center">
              Talk To Our Team
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2} className="relative lg:h-[500px] flex items-center justify-center">
            <div className="relative z-10 w-full max-w-lg aspect-square rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-white shadow-2xl">
              <Image alt="Medical Illustration" className="object-cover hover:scale-105 transition-transform duration-700" src="/treatment.jpg" fill sizes="(max-width: 1024px) 100vw, 512px" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function CallToAction() {
  return (
    <section className="lg:py-24 py-12 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          direction="up"
          className="relative bg-gradient-to-r from-text-main to-footer-bg rounded-[2.5rem] p-10 md:p-20 text-center overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Don&apos;t Let PLID Control Your Life
            </h2>
            <p className="text-gray-300 lg:text-lg text-base mb-10">
              Thousands of patients have regained confidence, mobility, and
              peace of mind through proper diagnosis, personalized treatment,
              rehabilitation, and expert guidance. The sooner you understand
              your condition, the sooner you can begin your recovery.
            </p>
            <Link
              href="/appointment"
              className="inline-block bg-accent hover:bg-accent-dark hover:scale-105 text-white lg:text-lg text-base font-bold py-4 px-12 rounded-full transition-all duration-300 shadow-xl shadow-accent/20"
            >
              Start My Recovery Journey
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

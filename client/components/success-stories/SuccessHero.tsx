import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

export default function SuccessHero() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal
            direction="right"
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-xs uppercase tracking-wider border border-accent/20">
              <span className="material-symbols-outlined text-sm">
                favorite
              </span>
              PATIENT RECOVERY JOURNEYS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-white leading-[1.1]">
              Success Stories
              <span className="block text-text-main dark:text-gray-200 text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold">
                Real Patients, Real Recovery
              </span>
            </h1>
            <p className="text-sm lg:text-base text-text-sub max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Every recovery journey is unique. Discover how patients struggling
              with PLID, sciatica, back pain, neck pain, and other
              musculoskeletal conditions regained confidence, mobility, and
              quality of life through the right diagnosis, personalized
              treatment, therapeutic yoga, rehabilitation, and expert medical
              guidance. These stories demonstrate what is possible when patients
              understand their condition, follow the right treatment plan, and
              commit to their recovery journey.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-base font-bold h-14 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/30 flex items-center justify-center"
              >
                Start Your Journey
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal
            direction="left"
            delay={0.2}
            className="relative lg:h-[500px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl transform scale-90 z-0"></div>
            <div className="relative z-10 w-full h-full min-h-[280px] lg:min-h-0 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-surface-dark group">
              <Image
                alt="Smiling patient enjoying renewed mobility outdoors"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBup9j_Bta9rvZplDrDCCftNQRfMvIcBu-XB76-6jxypvguW3OqALlRiP95ZB9yfp2puihtoVzI3remBK7r2emI-DNB4q-K3kAMdM_n8liv0W2l_Fnr7hmnQxkpirr_pfmAvLdVUDEJ7gWUtWgZ6w8wJVHQKeKw5AZGyu0_5YKX_KNkIxt6GDbN40VSHi8tJnDImV9MLYTKiquZXVBWczVKhqDOk4XlBPMAf39rrCUewkPPFvbhuAAxgLtsOlc6fTOoRGhBp62XeAE"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                <p className="text-white font-bold text-lg">
                  &quot;I never thought I&apos;d walk pain-free again.&quot;
                </p>
                <p className="text-gray-200 text-sm">
                  — Anisul Islam, recovered from PLID
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

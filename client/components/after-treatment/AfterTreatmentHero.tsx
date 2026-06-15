import ScrollReveal from "@/components/ScrollReveal";

export default function AfterTreatmentHero() {
  return (
    <section className="bg-primary pt-16 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 mb-6">
            <span className="material-symbols-outlined text-sm">
              medical_services
            </span>
            PATIENT RECOVERY GUIDE
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            After Treatment Instructions
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Successful recovery depends not only on treatment but also on what
            you do afterward. Follow these guidelines carefully to support
            healing, reduce discomfort, and maximize long-term results.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

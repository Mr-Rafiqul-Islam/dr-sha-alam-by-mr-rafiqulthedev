import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

export default function PhilosophySection() {
  return (
    <section
      className="py-32 relative flex items-center justify-center bg-fixed bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage:
          "url('/team.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/80"></div>
      <ScrollReveal
        direction="up"
        className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center text-white"
      >
        <span className="material-symbols-outlined !text-6xl mb-6 text-accent">
          self_improvement
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
          &quot;Healing Begins With Understanding.&quot;
        </h2>
        <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-10">
          Many patients live with unnecessary fear because they do not fully
          understand their condition. Dr. Shah Alam believes that education is
          one of the most powerful forms of treatment. When patients understand
          what is happening inside their bodies, they can make better decisions,
          reduce anxiety, and actively participate in their own recovery. The
          goal is not simply to treat symptoms. The goal is to restore function,
          improve quality of life, and help patients build long-term health.
        </p>
        <Link
          className="inline-block bg-accent hover:bg-accent-dark text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          href="/appointment"
        >
          Book A Consultation
        </Link>
      </ScrollReveal>
    </section>
  );
}

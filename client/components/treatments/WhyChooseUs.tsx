import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function WhyChooseUs() {
  const reasons = [
    {
      title: "Conservative Treatment Whenever Appropriate",
      description:
        "Helping patients explore non-surgical options before considering surgery.",
    },
    {
      title: "Evidence-Based Medical Care",
      description:
        "Treatment recommendations guided by clinical expertise and scientific evidence.",
    },
    {
      title: "Therapeutic Yoga Integration",
      description:
        "Combining movement, posture correction, and rehabilitation principles to support recovery.",
    },
    {
      title: "Personalized Recovery Plans",
      description:
        "Every patient receives guidance tailored to their specific condition and goals.",
    },
  ];

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="right">
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">
              WHY PATIENTS TRUST US
            </h2>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-primary dark:text-white mb-6">
              A Patient-First Approach To Recovery
            </h3>
            <p className="text-text-sub text-lg mb-8">
              Many patients come to us feeling confused, worried, and uncertain
              about what treatment they truly need. Our approach focuses on
              helping patients understand their condition clearly before making
              major treatment decisions.
            </p>
            <ul className="space-y-6">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1 shrink-0">
                    <span className="material-symbols-outlined text-sm text-accent-dark font-bold">
                      check
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-text-main dark:text-white">
                      {reason.title}
                    </h5>
                    <p className="text-sm text-text-sub mt-1">
                      {reason.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal
            direction="left"
            delay={0.2}
            className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-surface-dark group"
          >
            <Image
              alt="Doctor Shah Alam Portrait"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              src="/sir-1.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
              <p className="text-white font-bold text-xl">
                &quot;Healing is a journey, not a destination.&quot;
              </p>
              <p className="text-gray-300 text-sm mt-1">— Dr. Shah Alam</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

export default function BlogCallToAction() {
  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          direction="up"
          className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Still Looking For Answers?
            </h2>
            <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
              Reading articles can help you learn. A consultation can help you
              move forward. If pain, numbness, tingling, weakness, or movement
              limitations are affecting your life, let Dr. Shah Alam help you
              understand the root cause and the most appropriate treatment
              options for your situation.
            </p>
            <Link
              href="/book"
              className="inline-flex bg-accent hover:bg-accent-dark text-white text-lg font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 items-center gap-2"
            >
              Schedule Your Consultation Today{" "}
              <span className="material-symbols-outlined">calendar_month</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

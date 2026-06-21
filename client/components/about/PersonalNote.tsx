import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function PersonalNote() {
  return (
    <section className="lg:py-24 py-12 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 lg:gap-16 gap-8 items-center">
          <ScrollReveal
            direction="right"
            className="relative order-2 lg:order-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <Image
                alt="Dr. Alam at seminar"
                className="rounded-2xl shadow-lg object-cover h-64 w-full transform translate-y-8"
                src="/treatment-1.jpg"
                width={600}
                height={256}
                sizes="(max-width: 1024px) 45vw, 400px"
              />
              <Image
                alt="Dr. Alam with patient"
                className="rounded-2xl shadow-lg object-cover h-64 w-full"
                src="/Dr. Shah Alam-3.jpeg"
                width={600}
                height={256}
                sizes="(max-width: 1024px) 45vw, 400px"
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl"></div>
          </ScrollReveal>
          <ScrollReveal
            direction="left"
            delay={0.2}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl font-extrabold text-text-main dark:text-white mb-6">
              A Personal Message
            </h2>
            <div className="prose dark:prose-invert text-text-sub text-lg leading-relaxed">
              <p className="mb-4">
                &quot;Every patient has a story. Some come with pain. Some come
                with fear. Some come after months or years of confusion about
                what treatment is right for them. My responsibility is not only
                to diagnose and treat. It is to listen carefully, explain
                clearly, and guide each patient toward the most appropriate path
                for recovery. &quot;
              </p>
              <p className="mb-4">
                &quot;Whether your journey involves lifestyle modification,
                rehabilitation, therapeutic yoga, advanced medical treatment, or
                surgery when truly necessary, my goal remains the same:{" "}
                <strong>
                  To help you move better, live healthier, and regain confidence
                  in your future.
                </strong>
                &quot;
              </p>
              <p>
                Thank you for trusting me to be part of your healthcare journey.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-gray-300 dark:bg-gray-700 w-16"></div>
              <span className="font-handwriting text-2xl font-bold text-primary italic">
                Dr. Shah Alam
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

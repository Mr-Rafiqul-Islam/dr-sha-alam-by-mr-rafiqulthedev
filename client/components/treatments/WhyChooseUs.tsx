import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function WhyChooseUs() {
  const reasons = [
    {
      title: 'Avoid Unnecessary Surgery',
      description: 'We exhaust all non-invasive options first, saving you from risks and downtime.'
    },
    {
      title: 'Holistic Yoga Integration',
      description: 'Combining modern orthopedics with ancient yoga wisdom for better mobility.'
    },
    {
      title: 'Personalized Care Plans',
      description: 'No cookie-cutter solutions. Your treatment is designed specifically for your body.'
    }
  ];

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="right">
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Why Choose Dr. Alam</h2>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-primary dark:text-white mb-6">Patient-Centered, Non-Invasive Approach</h3>
            <p className="text-text-sub text-lg mb-8">
              We believe in the body&apos;s natural ability to heal. Our methods prioritize your long-term well-being over quick, temporary fixes.
            </p>
            <ul className="space-y-6">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1 shrink-0">
                    <span className="material-symbols-outlined text-sm text-accent-dark font-bold">check</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-text-main dark:text-white">{reason.title}</h5>
                    <p className="text-sm text-text-sub mt-1">{reason.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2} className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-surface-dark group">
            <Image alt="Doctor Shah Alam Portrait" className="object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_LNiCeXAvPIoUTLppf7wYTjy2RGFc0-_EywOKq10U9lA6rUXXZd3CsbbziQ5ZgQrUpDOVhITmQTMKm8hGUY0e2PjlIDQUN3QBS27aXYWrBNBeNV_YDaLFm06K6Bjc9Frry6ggCNeVmO3lZkgxUzig3S1C2xHrqvzZY_y-TaEXwC0USE25n0P62jwBqTq-Fdda34tgmmVIP1vRCA6mexX-94JVBV3AsDzFJsmsmAdg93NpRxpvZcNpE6_UyBVXtBn3PUge_kI_OTY" fill sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8">
              <p className="text-white font-bold text-xl">&quot;Healing is a journey, not a destination.&quot;</p>
              <p className="text-gray-300 text-sm mt-1">— Dr. Shah Alam</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

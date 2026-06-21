import ScrollReveal from '@/components/ScrollReveal';

export default function ContactHero() {
  return (
    <section className="relative lg:py-20 py-12 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-5 pointer-events-none"></div>
      <ScrollReveal direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-white mb-6">
          Contact Us
        </h1>
        <p className="text-xl text-text-sub font-medium max-w-2xl mx-auto">
          Get in Touch for Your Recovery Journey
        </p>
        <div className="w-24 h-1 bg-accent mx-auto mt-8 rounded-full"></div>
      </ScrollReveal>
    </section>
  );
}

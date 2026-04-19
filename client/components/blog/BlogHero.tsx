import ScrollReveal from '@/components/ScrollReveal';

export default function BlogHero() {
  return (
    <section className="bg-white dark:bg-surface-dark py-16 lg:py-24 text-center">
      <ScrollReveal direction="up" className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Health Insights</h2>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary dark:text-white mb-6">
          Health Articles
        </h1>
        <p className="text-xl md:text-2xl text-text-sub font-medium mb-4">Doctor-Written Health Guides</p>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explore evidence-based articles on orthopedic health, rehabilitation exercises, and lifestyle adjustments designed to help you live a pain-free life.
        </p>
      </ScrollReveal>
    </section>
  );
}

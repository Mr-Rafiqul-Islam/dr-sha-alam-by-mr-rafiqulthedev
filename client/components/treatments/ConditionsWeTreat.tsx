import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function ConditionsWeTreat() {
  const conditions = [
    'Arthritis',
    'Frozen Shoulder',
    'Tennis Elbow',
    'Plantar Fasciitis',
    'Spondylolisthesis',
    'Sports Injuries',
    'Osteoporosis',
    'Knee Pain',
    'Hip Pain'
  ];

  return (
    <section className="py-20 bg-white dark:bg-surface-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-10">Conditions We Treat</h2>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1} className="flex flex-wrap justify-center gap-3">
          {conditions.map((condition, index) => (
            <Link 
              key={index} 
              href="#" 
              className="px-6 py-3 rounded-full bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-semibold"
            >
              {condition}
            </Link>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

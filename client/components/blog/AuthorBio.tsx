import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function AuthorBio() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl transform translate-x-2 translate-y-2"></div>
            <Image alt="Dr. Shah Alam Portrait" className="rounded-full object-cover border-4 border-white dark:border-background-dark shadow-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXyswzoTx0Ks3xnTRTj39uHpQsl1ZuUMtsAAL9aHcJuQLx8alBskvzCXQXp8Oi4vlwgGBhwQaG70s3K0GJyOzq-GchzxNoFsAStwzkgWzPkat2_XMpTiGt8hmpOZR3JxvM6PFxuxtsWfxWpKzOMMQ4bh39Kd-6aTgnq5e7asU2WjtjG7TiHe6KRX39buIcw5iIq7cHHlDh5dWKWJIRshM8iluJ7k3EJWtyHQQq8ZlJyY2TzlNbeAMYY3NJE8t3-uwIIZsf1UtPcEU" fill sizes="(max-width: 768px) 192px, 256px" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Meet the Author</h3>
            <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">Dr. Shah Alam</h2>
            <p className="text-text-sub text-lg leading-relaxed mb-6">
              As an Orthopedic Specialist and Certified Yoga Therapist, I believe in empowering patients with knowledge. These articles are curated to bridge the gap between complex medical science and practical, everyday recovery strategies. My goal is to help you understand your body better.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">15+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Years Exp.</span>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">5k+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Patients</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

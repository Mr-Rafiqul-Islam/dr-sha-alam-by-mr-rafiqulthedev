import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function AuthorBio() {
  const bioParagraphs = [
    'Dr. Shah Alam is dedicated to helping people understand their health conditions, make informed treatment decisions, and achieve long-term recovery.',
    'Through a unique combination of modern orthopedic science, therapeutic yoga, rehabilitation principles, and patient education, he has helped thousands of patients overcome PLID, sciatica, back pain, neck pain, and musculoskeletal disorders.',
    'His mission is to empower patients with knowledge, confidence, and practical recovery strategies that lead to healthier and more active lives.',
  ];

  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl transform translate-x-2 translate-y-2"></div>
            <Image
              alt="Dr. Shah Alam Portrait"
              className="rounded-full object-cover object-center border-4 border-white dark:border-background-dark shadow-xl"
              src="/sir-3.jpg"
              fill
              sizes="(max-width: 768px) 192px, 256px"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">
              Meet the Author
            </h3>
            <h2 className="text-3xl font-bold text-text-main dark:text-white mb-3">
              Dr. Shah Alam
            </h2>
            <p className="text-primary dark:text-accent font-semibold text-sm md:text-base mb-6 leading-relaxed">
              Orthopedic Spine Specialist | Certified Yoga Instructor | Health Educator
            </p>
            <div className="space-y-4 text-text-sub text-base md:text-lg leading-relaxed">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { getInitials } from '@/lib/utils';

const stories = [
  {
    name: 'Rahman Ali',
    title: 'PLID Recovery Journey',
    quote:
      'I was terrified when my MRI showed a disc prolapse. I thought surgery was unavoidable. Dr. Shah Alam explained my condition clearly and guided me through a structured recovery plan. Today, my leg pain and numbness are almost gone, and I\'m back to my normal routine.',
  },
  {
    name: 'Fatema Begum',
    title: 'Sciatica Relief',
    quote:
      'For months, I couldn\'t sit comfortably for more than 10 minutes because of severe sciatica. The treatment plan, exercises, and guidance helped me recover step by step. I can now travel, work, and sleep comfortably again.',
  },
  {
    name: 'Md. Hasan',
    title: 'Avoided Unnecessary Surgery',
    quote:
      'Several people told me I needed surgery immediately. After consulting Dr. Shah Alam, I learned that surgery wasn\'t necessary in my case. With proper treatment and rehabilitation, my symptoms improved significantly.',
  },
  {
    name: 'Shila Akter',
    title: 'PLID Rehabilitation Success',
    quote:
      'The pain in my lower back and leg affected every part of my life. I lost confidence and became afraid of movement. The recovery program helped me regain strength, flexibility, and peace of mind.',
  },
  {
    name: 'Abdul Karim',
    title: 'Recovery From Severe Nerve Pain',
    quote:
      'My leg pain was so intense that I could barely walk. I was worried about permanent nerve damage. Thanks to proper evaluation and treatment, the pain gradually disappeared, and I can now walk without fear.',
  },
  {
    name: 'Nurjahan Begum',
    title: 'Back To Daily Activities',
    quote:
      'Simple tasks like praying, cooking, and walking became difficult because of PLID. The personalized treatment plan gave me a clear direction. I\'m now able to perform my daily activities with much greater comfort.',
  },
  {
    name: 'Kamrul Islam',
    title: 'Return To Work',
    quote:
      'As a working professional, I was worried that my back problem would affect my career. Dr. Shah Alam helped me understand the condition and taught me how to manage it properly. I\'m back at work and feeling much more confident.',
  },
  {
    name: 'Jannatul Ferdous',
    title: 'Relief From Tingling & Numbness',
    quote:
      'The constant tingling and numbness in my leg made me anxious. I feared the condition would worsen over time. After following the treatment plan consistently, those symptoms improved dramatically.',
  },
  {
    name: 'Saiful Rahman',
    title: 'Long-Term Improvement',
    quote:
      'What impressed me most was the honest guidance. Instead of rushing into procedures, Dr. Shah Alam focused on understanding the root cause of my problem. My pain is now under control, and my quality of life has improved greatly.',
  },
  {
    name: 'Mizanur Rahman',
    title: 'Regained Confidence',
    quote:
      'PLID affected not only my body but also my mental well-being. I constantly worried about my future. The combination of medical guidance, rehabilitation, and lifestyle advice helped me regain confidence and return to an active life.',
  },
];

export default function MoreStories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      const cards = container.querySelectorAll('.story-card');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount =
      container.clientWidth >= 1024
        ? container.clientWidth / 3
        : container.clientWidth >= 768
          ? container.clientWidth / 2
          : container.clientWidth;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="lg:py-20 pt-12 pb-4 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex flex-col sm:flex-row justify-between items-start sm:items-end lg:mb-12 mb-6 gap-6">
          <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">
            More Recovery Stories
          </h3>
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white dark:bg-surface-dark"
              aria-label="Previous stories"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20"
              aria-label="Next stories"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </ScrollReveal>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-8 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {stories.map((story, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                key={story.name}
                className={`story-card min-w-[100%] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.33rem)] snap-center bg-white dark:bg-surface-dark p-6 rounded-2xl transition-all duration-500 relative group h-full ${
                  isActive
                    ? 'scale-105 shadow-2xl shadow-primary/20 border-b-4 border-accent z-10'
                    : 'scale-95 shadow-sm opacity-60 hover:opacity-100 hover:shadow-md z-0'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center ring-2 ring-accent/30 shrink-0"
                    aria-hidden="true"
                  >
                    {getInitials(story.name)}
                  </div>
                  <div>
                    <h5 className="font-bold text-text-main dark:text-white">{story.name}</h5>
                    <div className="flex text-yellow-400 text-xs">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <i key={starIndex} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                </div>
                <h6 className="font-bold text-primary mb-2">{story.title}</h6>
                <p className="text-text-sub text-sm">&quot;{story.quote}&quot;</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

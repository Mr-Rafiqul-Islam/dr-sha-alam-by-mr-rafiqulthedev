'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import VideoCard from './VideoCard';

const videoTestimonials = [
  {
    title: 'অপারেশন ছাড়াই PLID মুক্ত জীবন! কিভাবে সম্ভব হলো?',
    filename:
      'https://player.mux.com/Uo302PHyYCsBQelpYM4Y5BSO02cOTavxvX3GSMt5W01neU',
  },
  {
    title: 'এপিডুরাল ইনজেকশন দেওয়ার ৩ বছর পরও রোগী সুস্থ',
    filename:
      'https://player.mux.com/wNMznxcuQRo6mLOfsNYymaybA00kvfQ3tylFr6n9veGk',
  },
  {
    title: 'আমি শুধু যোগ ব্যায়াম করেছি— আজ আলহামদুলিল্লাহ পরিপূর্ণ সুস্থ',
    filename: 'https://player.mux.com/SsmoY62q1E5O6K0100CiIIZ5mq8HGRhH017vlEHIueZFjs',
  },
  {
    title: 'অপারেশনের আগে জ্বালা, অবশ, ফুটড্রপ—৪ মাস ১৩ দিনে কীভাবে বদলে গেল অবস্থা',
    filename:
      'https://player.mux.com/fOzEfT1iJMPzFXxwdCZQJi6a8v2e91y4xvsiA3NtY00g',
  },
  {
    title: '১.৫ মাসেই কোমর ব্যথা উধাও! জানুন পিএলআইডি রোগীর অবিশ্বাস্য সুস্থতার গল্প',
    filename:
      'https://player.mux.com/H9JPAul39O4KRVxBI8egh8FTRaQajVygfcE5cCCnCU8',
  },
  {
    title: '৫ জন ডাক্তার বলেছিল অপারেশন লাগবে, আল্লাহর রহমতে সুস্থ হলেন ইনজেকশনেই',
    filename:
      'https://player.mux.com/edt01aDWf6301Ngft95TgxY025irvvGL2j52bn7xO701U7w',
  },
];

export default function VideoTestimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      const cards = container.querySelectorAll('.video-card-slide');
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
    <section className="py-20 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          direction="up"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">
            Hear Their Recovery Stories In Their Own Words
          </h3>
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white dark:bg-surface-dark"
              aria-label="Previous video"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20"
              aria-label="Next video"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </ScrollReveal>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-4 px-4 -mx-4 touch-pan-x overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {videoTestimonials.map((video) => (
            <div
              key={video.filename}
              className="video-card-slide min-w-[100%] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.33rem)] snap-center"
            >
              <VideoCard
                title={video.title}
                videoUrl={video.filename}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-2">
          {videoTestimonials.map((video, index) => (
            <button
              key={video.filename}
              type="button"
              onClick={() => {
                const container = scrollContainerRef.current;
                const card = container?.querySelectorAll('.video-card-slide')[index];
                card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

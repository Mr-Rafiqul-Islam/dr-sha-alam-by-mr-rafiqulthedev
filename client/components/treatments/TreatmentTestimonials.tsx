'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { getInitials } from '@/lib/utils';

export default function TreatmentTestimonials() {
  const testimonials = [
    {
      name: 'Rahman Khan',
      quote: 'The PLID treatment plan was a miracle. I can walk without pain for the first time in 2 years. Highly recommended!'
    },
    {
      name: 'Fatema Begum',
      quote: 'I was skeptical about yoga for sciatica, but Dr. Alam\'s approach is scientific and effective. Very grateful.'
    },
    {
      name: 'Md. Hasan',
      quote: 'Professional, kind, and extremely knowledgeable. The best orthopedic specialist I have visited in Dhaka.'
    },
    {
      name: 'Sarah Ahmed',
      quote: 'I was skeptical about yoga for sciatica, but Dr. Alam\'s approach is scientific and effective. Very grateful.'
    },
    {
      name: 'Md. Hasan',
      quote: 'Professional, kind, and extremely knowledgeable. The best orthopedic specialist I have visited in Dhaka.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Duplicate testimonials to create an infinite loop effect
  const extendedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= testimonials.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  return (
    <section className="lg:py-20 py-12 bg-background-light dark:bg-background-dark overflow-hidden">
      <style>{`
        .carousel-track {
          --slide-amount: -100%;
        }
        @media (min-width: 768px) {
          .carousel-track {
            --slide-amount: -50%;
          }
        }
        @media (min-width: 1024px) {
          .carousel-track {
            --slide-amount: -33.333333%;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center lg:mb-16 mb-8">
          <h2 className="text-3xl font-extrabold text-primary dark:text-white">What Our Patients Say</h2>
        </ScrollReveal>

        <div className="relative overflow-hidden -mx-4 px-4 py-4 -my-4">
          <div
            className={`flex carousel-track ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
            style={{
              transform: 'translateX(calc(var(--current-index) * var(--slide-amount)))',
              '--current-index': currentIndex,
            } as React.CSSProperties}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center ring-2 ring-primary/20 shrink-0"
                      aria-hidden="true"
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <h5 className="font-bold text-text-main dark:text-white">{testimonial.name}</h5>
                      <div className="flex text-yellow-400 text-xs mt-1">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-text-sub italic flex-grow">&quot;{testimonial.quote}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 lg:mt-10 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === (currentIndex % testimonials.length) ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-gray-700 w-2 hover:bg-primary/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

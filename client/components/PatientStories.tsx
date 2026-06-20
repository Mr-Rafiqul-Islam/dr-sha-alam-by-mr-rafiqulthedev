'use client';

import { useRef, useState, useEffect } from 'react';
import { getInitials } from '@/lib/utils';

const stories = [
  {
    id: 1,
    quote: "After understanding my condition and following the recovery roadmap, my pain improved significantly and I returned to normal activities.",
    name: "Mizanur Rahman",
    condition: "Recovered from PLID",
  },
  {
    id: 2,
    quote: "I was struggling with severe sciatica. Proper evaluation helped me avoid unnecessary surgery and recover faster.",
    name: "Jannatul Ferdous",
    condition: "Recovered from Sciatica",
  },
  {
    id: 3,
    quote: "Dr. Shah Alam explained my condition clearly. For the first time, I knew exactly what treatment I needed.",
    name: "Saiful Rahman",
    condition: "Shoulder Mobility Restored",
  },
  {
    id: 4,
    quote: "After years of chronic neck pain, the holistic approach finally gave me relief. The posture correction techniques are something I use every day.",
    name: "Aisha Rahman",
    condition: "Relieved from Neck Pain",
  }
];

// const stories = [
//   {
//     id: 1,
//     name: 'Rahman Ali',
//     condition: 'PLID Recovery Journey',
//     quote:
//       'I was terrified when my MRI showed a disc prolapse. I thought surgery was unavoidable. Dr. Shah Alam explained my condition clearly and guided me through a structured recovery plan. Today, my leg pain and numbness are almost gone, and I\'m back to my normal routine.',
//   },
//   {
//     id: 2,
//     name: 'Fatema Begum',
//     condition: 'Sciatica Relief',
//     quote:
//       'For months, I couldn\'t sit comfortably for more than 10 minutes because of severe sciatica. The treatment plan, exercises, and guidance helped me recover step by step. I can now travel, work, and sleep comfortably again.',
//   },
//   {
//     id: 3,
//     name: 'Md. Hasan',
//     condition: 'Avoided Unnecessary Surgery',
//     quote:
//       'Several people told me I needed surgery immediately. After consulting Dr. Shah Alam, I learned that surgery wasn\'t necessary in my case. With proper treatment and rehabilitation, my symptoms improved significantly.',
//   },
//   {
//     id: 4,
//     name: 'Shila Akter',
//     condition: 'PLID Rehabilitation Success',
//     quote:
//       'The pain in my lower back and leg affected every part of my life. I lost confidence and became afraid of movement. The recovery program helped me regain strength, flexibility, and peace of mind.',
//   },
//   {
//     id: 5,
//     name: 'Abdul Karim',
//     condition: 'Recovery From Severe Nerve Pain',
//     quote:
//       'My leg pain was so intense that I could barely walk. I was worried about permanent nerve damage. Thanks to proper evaluation and treatment, the pain gradually disappeared, and I can now walk without fear.',
//   },
//   {
//     id: 6,
//     name: 'Nurjahan Begum',
//     condition: 'Back To Daily Activities',
//     quote:
//       'Simple tasks like praying, cooking, and walking became difficult because of PLID. The personalized treatment plan gave me a clear direction. I\'m now able to perform my daily activities with much greater comfort.',
//   },
//   {
//     id: 7,
//     name: 'Kamrul Islam',
//     condition: 'Return To Work',
//     quote:
//       'As a working professional, I was worried that my back problem would affect my career. Dr. Shah Alam helped me understand the condition and taught me how to manage it properly. I\'m back at work and feeling much more confident.',
//   },
//   {
//     id: 8,
//     name: 'Jannatul Ferdous',
//     condition: 'Relief From Tingling & Numbness',
//     quote:
//       'The constant tingling and numbness in my leg made me anxious. I feared the condition would worsen over time. After following the treatment plan consistently, those symptoms improved dramatically.',
//   },
//   {
//     id: 9,
//     name: 'Saiful Rahman',
//     condition: 'Long-Term Improvement',
//     quote:
//       'What impressed me most was the honest guidance. Instead of rushing into procedures, Dr. Shah Alam focused on understanding the root cause of my problem. My pain is now under control, and my quality of life has improved greatly.',
//   },
//   {
//     id: 10,
//     name: 'Mizanur Rahman',
//     condition: 'Regained Confidence',
//     quote:
//       'PLID affected not only my body but also my mental well-being. I constantly worried about my future. The combination of medical guidance, rehabilitation, and lifestyle advice helped me regain confidence and return to an active life.',
//   },
// ];

export default function PatientStories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Default to second item on desktop

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

    // Initial check
    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth >= 1024 ? current.clientWidth / 3 : current.clientWidth >= 768 ? current.clientWidth / 2 : current.clientWidth;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="lg:py-24 pt-12 bg-background-light overflow-hidden" id="success-stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end lg:mb-16 mb-4 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Patient Stories</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary">Real Patients. Real Recovery Stories.</h3>
            <p className="text-text-sub text-sm lg:text-base mt-2">Thousands of patients have regained confidence, movement, and quality of life through the right treatment approach.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 bg-white"
              aria-label="Previous story"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20"
              aria-label="Next story"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pt-8 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {stories.map((story, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={story.id}
                className={`story-card min-w-[100%] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.33rem)] snap-center bg-white p-8 rounded-3xl transition-all duration-500 relative group
                  ${isActive 
                    ? 'scale-105 shadow-2xl shadow-primary/20 border-b-4 border-accent z-10' 
                    : 'scale-95 shadow-sm opacity-60 hover:opacity-100 hover:shadow-md z-0'
                  }
                `}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-primary/20">format_quote</span>
                </div>
                <div className="flex gap-1 text-yellow-400 mb-6">
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                  <span className="material-symbols-outlined text-sm fill-current">star</span>
                </div>
                <p className="text-text-main mb-8 text-lg leading-relaxed relative z-10">&quot;{story.quote}&quot;</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div
                    className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center ring-2 ring-offset-2 ring-primary/20 shrink-0"
                    aria-hidden="true"
                  >
                    {getInitials(story.name)}
                  </div>
                  <div>
                    <h5 className="font-bold text-text-main">{story.name}</h5>
                    <p className="text-xs text-text-sub font-medium">{story.condition}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

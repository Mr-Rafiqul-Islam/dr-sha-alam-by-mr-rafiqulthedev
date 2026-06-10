'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

const stories = [
  {
    id: 1,
    quote: "After understanding my condition and following the recovery roadmap, my pain improved significantly and I returned to normal activities.",
    name: "Rahman Khan",
    condition: "Recovered from PLID",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUmaPVbPNx_wkwUKO6yQCE23MeytyZNNs0PHyKEKubJYwopu7Z25myusFo2ct2xB1HBhqsT5lAyMax83RCg844HmfostNthsW2_c0dxfw2lh6W-orM46HktkU6fU3g3VGaS5PebsxCZ8tkhYwjVbqoqYAOHLbSZp16iUUmvVQl8G06Wk1bZQS7mSDahydriS7ERCLLwJJcuFJ_BAqxEGhigdmjme9vhyKVuwFdMTLYjl9Pxz3_lTp-BtabfSqn3S-N2Ts2xBLgoxY",
  },
  {
    id: 2,
    quote: "I was struggling with severe sciatica. Proper evaluation helped me avoid unnecessary surgery and recover faster.",
    name: "Sarah Ahmed",
    condition: "Recovered from Sciatica",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmcOC0zZjsNKoYJx-YRKI8lewO5-QT4vfQW6dQnvq91n-WgKI0aczFhkhfVA-V3EL5CcTPJnJ_-dOLQVOFFB9pZB9EtIprizpBPOCt975DlEHS-IvJ2RRwSJofygXcEmJRlaGte5EVu3GGygnI1Lqkd095w2yEv0zsSnPuN6sa461QEssVAVSNABmxAuUgwo32O_d5xzOwAhEvAaJJIAelfcTcmaHb_894l0rDLet2r12GvTkZgYA9blXimmH5wyvqKBjLP12-JOg",
  },
  {
    id: 3,
    quote: "Dr. Shah Alam explained my condition clearly. For the first time, I knew exactly what treatment I needed.",
    name: "James Wilson",
    condition: "Shoulder Mobility Restored",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHJW2_Ueex3EXL5Qm1ynM3CDW_ngk9ABTRhBqlYy00Hm5ild8A74BOrumslVmZ7DA93O8Bh-MWFZ3CrSPIW3ZdmYNYUxeQszmLe-f2YCLH63r06O9-9vmxVTwxz9iKmtEpJzc3m4OEQhfSkoYF_nJ6nk-PsYpDzarNbuhTbJotueF8x23NsQWPHTLeONZrUgUmHe7iuU2FGxDZQ9VKqUcfB5dfUJWEtMMpfK526StBGfZLpSAkYOKtGOVcdoNCrnOMDWuIGbquntk",
  },
  {
    id: 4,
    quote: "After years of chronic neck pain, the holistic approach finally gave me relief. The posture correction techniques are something I use every day.",
    name: "Aisha Rahman",
    condition: "Relieved from Neck Pain",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbOQjK5YuQNIv5cj5L_IY8BAA1mSR_oLVoeuAW-Gi1kTeGR3jMnZTCgx9_g1kRGy6OQP-6agJ73NYoQNEBNfbggmv_x1m1VS7slWVGRYmTV1FcrDj3QR8Zr88sICFCcUvDbURgLMfG4e-N3F3gkuZd4tTaW3FePZRES5iRm8RRZVVxfag4C_ybp7njxxTOHXUGHcv3rIXVOAVXCqncORaczdUAAKFtUbZFJnUh4YiwUufQ9ECkHBtPua2C2FzxwxxTLtyYjBavqAQ",
  }
];

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
    <section className="lg:py-24 py-16 bg-background-light overflow-hidden" id="success-stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
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
                  <Image alt={`Portrait of ${story.name}`} className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-primary/20" src={story.image} width={48} height={48} sizes="48px" />
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

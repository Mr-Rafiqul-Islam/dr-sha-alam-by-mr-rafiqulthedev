"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styles from "@/app/CustomCarousel.module.css";

const fallbackSlides = [
  {
    id: 1,
    title: "PLID & Spine Recovery Programs",
    description: "Personalized decompression, strengthening and lifestyle tuning.",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
  },
  {
    id: 2,
    title: "Chronic Pain Management",
    description: "Evidence-led physiotherapy to relieve stubborn pain safely.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
  },
  {
    id: 3,
    title: "Lifestyle Disease Correction",
    description: "Holistic rehab programs to reset posture, sleep and energy.",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function CustomCarousel({
  slides = fallbackSlides,
  autoPlayInterval = AUTO_PLAY_INTERVAL,
}) {
  const safeSlides = useMemo(() => (slides?.length ? slides : fallbackSlides), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const getSlidesToShow = (width) => {
      if (width >= 1280) return 3; // desktop
      if (width >= 1024) return 2; // laptop
      if (width >= 768) return 2; // tablet
      return 1; // mobile
    };

    const updateSlidesToShow = () => {
      if (typeof window === "undefined") return;
      setSlidesToShow(getSlidesToShow(window.innerWidth));
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const goToSlide = (nextIndex) => {
    setActiveIndex((prev) => {
      const newIndex =
        typeof nextIndex === "number"
          ? nextIndex
          : (prev + 1 + safeSlides.length) % safeSlides.length;
      return (newIndex + safeSlides.length) % safeSlides.length;
    });
  };

  const handlePrevious = () => goToSlide(activeIndex - 1);
  const handleNext = () => goToSlide(activeIndex + 1);

  useEffect(() => {
    if (isPaused || safeSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSlides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, isPaused, safeSlides.length]);

  const visibleCount = Math.min(slidesToShow, safeSlides.length);
  const visibleSlides = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, offset) => {
      const actualIndex = (activeIndex + offset) % safeSlides.length;
      return { slide: safeSlides[actualIndex], actualIndex };
    });
  }, [activeIndex, safeSlides, visibleCount]);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Service highlights"
    >
      <div className={styles.viewport}>
        <div className={styles.slidesRow} style={{ "--visible-count": visibleCount }}>
          {visibleSlides.map(({ slide, actualIndex }) => (
            <article
              key={slide?.id ?? `${slide?.title ?? "slide"}-${actualIndex}`}
              className={`${styles.slide} ${styles.slideVisible}`}
              aria-label={`${slide?.title ?? "carousel"} slide`}
            >
              <div className={styles.slideInner}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={slide?.image}
                    alt={slide?.title ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className={styles.image}
                    priority={actualIndex === 0}
                  />
                  <div className={styles.overlay}>
                    <p className={styles.indexLabel}>
                      {String(actualIndex + 1).padStart(2, "0")}/
                      {String(safeSlides.length).padStart(2, "0")}
                    </p>
                    <h3>{slide?.title}</h3>
                    <p>{slide?.description}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {safeSlides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            className={`${styles.navBtn} ${styles.prev}`}
            onClick={handlePrevious}
          >
            <IoIosArrowBack />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className={`${styles.navBtn} ${styles.next}`}
            onClick={handleNext}
          >
            <IoIosArrowForward />
          </button>

          <div className={styles.dots} role="tablist" aria-label="Carousel navigation dots">
            {safeSlides.map((slide, index) => (
              <button
                key={slide.id ?? index}
                type="button"
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === activeIndex}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


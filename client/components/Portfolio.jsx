import CustomCarousel from "./CustomCarousel";
import { Suspense } from "react";
import SectionHeading from "./SectionHeading";

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-9 md:py-16">
      <div className="container mx-auto px-4 lg:px-0">
        {/* section heading */}
        <SectionHeading
          subtitle="Our Portfolio"
          title="We Don’t Just Treat Pain — We Transform Your Healing Experience"
          description="From PLID and spine care to knee pain and lifestyle correction — We
            deliver a complete, science-based and natural approach designed for
            real, lasting results."
          sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
        />
        <Suspense fallback={<div>Loading...</div>}>
          <CustomCarousel />
        </Suspense>
      </div>
    </section>
  );
}

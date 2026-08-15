import SuccessHero from '@/components/success-stories/SuccessHero';
import FeaturedTransformations from '@/components/success-stories/FeaturedTransformations';
import MoreStories from '@/components/success-stories/MoreStories';
import VisualEvidence from '@/components/success-stories/VisualEvidence';
import VideoTestimonials from '@/components/success-stories/VideoTestimonials';
import SuccessStats from '@/components/success-stories/SuccessStats';
import CallToAction from '@/components/success-stories/CallToAction';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Success Stories | Dr. Shah Alam",
  alternates: {
    canonical: "/success-stories",
  },
};

export default function SuccessStoriesPage() {
  return (
    <main className="flex-grow">
      <SuccessHero />
      <FeaturedTransformations />
      <VideoTestimonials />
      <VisualEvidence />
      <MoreStories />
      <SuccessStats />
      <CallToAction />
    </main>
  );
}

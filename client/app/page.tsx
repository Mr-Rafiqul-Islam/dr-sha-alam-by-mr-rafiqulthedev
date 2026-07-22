import AboutSection from '@/components/AboutSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import HomeBlogSection from '@/components/HomeBlogSection';
import HomeContactSection from '@/components/HomeContactSection';
import HomeHeroSection from '@/components/HomeHeroSection';
import HomePatientStoriesSection from '@/components/HomePatientStoriesSection';
import VideoTestimonials from '@/components/success-stories/VideoTestimonials';
import { getAllBlogs } from '@/server-actions/getAllBlogs';
import type { PublicBlog } from '@/types/blog';

export default async function Home() {
  let blogs: PublicBlog[] = [];

  try {
    ({ blogs } = await getAllBlogs({ limit: 3 }));
  } catch {
    blogs = [];
  }

  return (
    <>
      <HomeHeroSection />
      <ExpertiseSection />
      <HomePatientStoriesSection />
      <AboutSection />
      <VideoTestimonials />
      <HomeBlogSection blogs={blogs} />
      <HomeContactSection />
    </>
  );
}

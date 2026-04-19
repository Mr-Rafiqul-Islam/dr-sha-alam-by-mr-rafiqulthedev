import AboutSection from '@/components/AboutSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import HomeBlogSection from '@/components/HomeBlogSection';
import HomeContactSection from '@/components/HomeContactSection';
import HomeHeroSection from '@/components/HomeHeroSection';
import HomePatientStoriesSection from '@/components/HomePatientStoriesSection';

export default function Home() {
  return (
    <>
      <HomeHeroSection />
      <ExpertiseSection />
      <HomePatientStoriesSection />
      <AboutSection />
      <HomeBlogSection />
      <HomeContactSection />
    </>
  );
}

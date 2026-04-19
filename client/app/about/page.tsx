import AboutHero from '@/components/about/AboutHero';
import AboutStats from '@/components/about/AboutStats';
import EducationAndAwards from '@/components/about/EducationAndAwards';
import PhilosophySection from '@/components/about/PhilosophySection';
import VisitChamber from '@/components/about/VisitChamber';
import PersonalNote from '@/components/about/PersonalNote';

export default function AboutPage() {
  return (
    <main className="flex-grow">
      <AboutHero />
      <AboutStats />
      <EducationAndAwards />
      <PhilosophySection />
      <VisitChamber />
      <PersonalNote />
    </main>
  );
}

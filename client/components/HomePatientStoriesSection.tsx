import PatientStories from '@/components/PatientStories';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomePatientStoriesSection() {
  return (
    <ScrollReveal direction="up">
      <PatientStories />
    </ScrollReveal>
  );
}

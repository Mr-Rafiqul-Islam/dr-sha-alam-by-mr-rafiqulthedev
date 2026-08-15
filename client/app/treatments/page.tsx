import TreatmentsHero from '@/components/treatments/TreatmentsHero';
import CoreTreatments from '@/components/treatments/CoreTreatments';
import TreatmentJourney from '@/components/treatments/TreatmentJourney';
import WhyChooseUs from '@/components/treatments/WhyChooseUs';
import ConditionsWeTreat from '@/components/treatments/ConditionsWeTreat';
import TreatmentTestimonials from '@/components/treatments/TreatmentTestimonials';
import TreatmentFAQ from '@/components/treatments/TreatmentFAQ';
import TreatmentCallToAction from '@/components/treatments/TreatmentCallToAction';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Treatments | Dr. Shah Alam",
  alternates: {
    canonical: "/treatments",
  },
};

export default function TreatmentsPage() {
  return (
    <main className="flex-grow">
      <TreatmentsHero />
      <CoreTreatments />
      <TreatmentJourney />
      <WhyChooseUs />
      <ConditionsWeTreat />
      <TreatmentTestimonials />
      <TreatmentFAQ />
      <TreatmentCallToAction />
    </main>
  );
}

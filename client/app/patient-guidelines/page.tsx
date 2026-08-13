import PatientGuidelinesHero from '@/components/patient-guidelines/PatientGuidelinesHero';
import PatientGuidelinesNav from '@/components/patient-guidelines/PatientGuidelinesNav';
import PatientGuidelinesBeforeVisit from '@/components/patient-guidelines/PatientGuidelinesBeforeVisit';
import PatientGuidelinesPostTreatment from '@/components/patient-guidelines/PatientGuidelinesPostTreatment';
import PatientGuidelinesExercise from '@/components/patient-guidelines/PatientGuidelinesExercise';
import PatientGuidelinesEmergency from '@/components/patient-guidelines/PatientGuidelinesEmergency';
import PatientGuidelinesContact from '@/components/patient-guidelines/PatientGuidelinesContact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Patient Guidelines | Dr. Shah Alam",
  alternates: {
    canonical: "/patient-guidelines",
  },
};

export default function PatientGuidelinesPage() {
  return (
    <main className="flex-grow">
      <PatientGuidelinesHero />
      <PatientGuidelinesNav />
      <PatientGuidelinesBeforeVisit />
      <PatientGuidelinesPostTreatment />
      <PatientGuidelinesExercise />
      <PatientGuidelinesEmergency />
      <PatientGuidelinesContact />
    </main>
  );
}
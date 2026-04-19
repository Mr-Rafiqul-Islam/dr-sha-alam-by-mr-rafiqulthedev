import PatientGuidelinesHero from '@/components/patient-guidelines/PatientGuidelinesHero';
import PatientGuidelinesNav from '@/components/patient-guidelines/PatientGuidelinesNav';
import PatientGuidelinesBeforeVisit from '@/components/patient-guidelines/PatientGuidelinesBeforeVisit';
import PatientGuidelinesPostTreatment from '@/components/patient-guidelines/PatientGuidelinesPostTreatment';
import PatientGuidelinesEmergency from '@/components/patient-guidelines/PatientGuidelinesEmergency';
import PatientGuidelinesContact from '@/components/patient-guidelines/PatientGuidelinesContact';

export default function PatientGuidelinesPage() {
  return (
    <main className="flex-grow">
      <PatientGuidelinesHero />
      <PatientGuidelinesNav />
      <PatientGuidelinesBeforeVisit />
      <PatientGuidelinesPostTreatment />
      <PatientGuidelinesEmergency />
      <PatientGuidelinesContact />
    </main>
  );
}
import AppointmentHero from "./_component/AppointmentHero";
import AppointmentAccordion from "./_component/AppointmentAccordion";
import CommonSection from "@/components/CommonSection";
import {
  sectionOneData,
  sectionTwoData,
  sectionThreeData,
} from "@/app/appointment/data";
import { Suspense } from "react";

export default async function AppointmentPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AppointmentHero />
      </Suspense>
      <CommonSection
        data={sectionOneData}
        style={1}
        className="bg-gray-100 py-9"
      />
      <CommonSection data={sectionTwoData} style={2} className="py-9" />
      <CommonSection
        data={sectionThreeData}
        style={1}
        className="bg-gray-100 py-9"
      />
      <AppointmentAccordion />
    </>
  );
}

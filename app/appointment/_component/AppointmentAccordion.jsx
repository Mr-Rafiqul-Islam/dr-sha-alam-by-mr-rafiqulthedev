import { Accordion } from "@/components/Accordion";
import { faqData } from "@/app/appointment/data";

export default function AppointmentAccordion() {
  return (
    <section className="bg-white py-9">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-black font-base">
            সিরিয়াল দেয়া নিয়ে কিছু প্রশ্ন:
          </h2>
          <Accordion
            data={faqData?.data}
            type="single"
            collapsible
            defaultValue={0}
          />
        </div>
      </div>
    </section>
  );
}

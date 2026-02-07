import Card from "@/components/Card";
import { ServiceData } from "@/constrain/data";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import SectionHeading from "./SectionHeading";

export default function Service() {
  return (
    <section id="services" className="py-8 md:py-16 bg-sky-100">
      <div className="container mx-auto px-4 lg:px-0">
        <SectionHeading
          subtitle="Dr Md Shah Alam"
          title="Expert Care, True Serve"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 md:gap-10 lg:gap-14 items-center mt-4 md:mt-16">
          {ServiceData &&
            ServiceData.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                desc={item.desc}
                image={item.image}
                progressPercentage={item.progressPercentage}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

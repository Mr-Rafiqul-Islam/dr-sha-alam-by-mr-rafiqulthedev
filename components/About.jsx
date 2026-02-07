import Image from "next/image";
import AboutBanner from "@/app/assets/About.jpg";
import Link from "next/link";
import { BenefitsData } from "@/constrain/data";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="bg-gray-100 py-9">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-10 ">
          <div className="relative w-[300px] h-[400px] md:w-[500px] md:h-[600px] rounded-lg order-2 md:order-1 mx-auto md:mx-0">
            {/* Image */}
            <div className="relative about-card-image w-full h-full">
              <Image
                src={AboutBanner || ""}
                alt="about"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 300px, 500px"
              />
            </div>
          </div>

          {/* content */}
          <div className="max-w-3xl order-1 md:order-2">
            <SectionHeading
              title="Our Mission Is Simple — Healing People with Science, Nature & Compassion."
              subtitle="Dr Md Shah Alam"
              sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
            />

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="md:border-r border-t border-gray-200 p-5">
                <div className="text-black font-bold text-xl mb-1">
                  <span className="text-primary">500K +</span>
                  <p className="text-base">
                    Lives Improved Through Our Natural Remedy System
                  </p>
                </div>
                <div className="text-black font-bold text-xl border-t border-tertiary pt-1 mb-1">
                  <span className="text-primary">100M+</span>
                  <p className="text-base">
                    PLID Patient Support through our contents
                  </p>
                </div>
                <div className="text-black font-bold text-xl border-t border-tertiary pt-1 mb-1">
                  <span className="text-primary">1000+</span>
                  <p className="text-base">PLID Surgery</p>
                </div>
                <div className="text-black font-bold text-xl border-t border-tertiary pt-1 mb-1">
                  <span className="text-primary">100K+</span>
                  <p className="text-base">PLID Patient Served Directly</p>
                </div>
                <div className="text-black font-bold text-xl border-t border-tertiary pt-1 mb-1">
                  <span className="text-primary">13+ Years</span>
                  <p className="text-base">
                    Expertise in Orthopedics, Spine & Yoga
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-5">
                <div className="">
                  <SectionHeading
                    description="To provide safe, transparent, and effective treatment
                    without unnecessary medicine or surgery. We focus on
                    root-cause healing, lifestyle correction, and long-term
                    wellness — empowering people to take control of their health
                    naturally and scientifically."
                    subtitle="Our Mission"
                    sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
                  />
                  <button className="flex items-center gap-3 bg-black hover:bg-primary/90 transition-colors duration-500 ease-linear text-white font-medium py-2 px-4 rounded-md cursor-pointer">
                    <Link href="#explore More">Explore More</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* second part */}
        <div className="mt-5 lg:mt-10">
          <div className="max-w-2xl text-start flex flex-col items-start mb-3 md:mb-5">
            <SectionHeading
              title="Your Health, Our Promise — Healing Smarter Together"
              subtitle="Benefits"
              sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {BenefitsData &&
                BenefitsData.gridCard.map((item, index) => (
                  <div
                    className="p-3 text-left bg-white rounded-lg shadow-md"
                    key={index}
                  >
                    <span className="text-primary">{item?.icon}</span>
                    <h6 className="text-lg md:text-xl text-black font-bold mt-5 mb-2">
                      {item?.title}
                    </h6>
                    <p className="text-sm md:text-lg text-tertiary">
                      {item?.desc}
                    </p>
                  </div>
                ))}
            </div>
            {BenefitsData && BenefitsData.singleCard && (
              <div className="p-4 bg-primary rounded-lg text-white">
                <h6 className="text-lg md:text-xl font-bold mt-5 mb-2 ">
                  {BenefitsData?.singleCard?.title}
                </h6>
                <p className="text-sm md:text-lg">
                  {BenefitsData?.singleCard?.desc}
                </p>
                <div className="mt-5 rounded-lg overflow-hidden mx-auto">
                  <Image
                    src={BenefitsData?.singleCard?.image}
                    alt={BenefitsData?.singleCard?.title}
                    width={300}
                    height={300}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

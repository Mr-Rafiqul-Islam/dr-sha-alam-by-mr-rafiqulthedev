"use client";
import { useState } from "react";
import Image from "next/image";
import { tabData } from "@/constrain/data";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import TrustBanner from "@/app/assets/Trust.jpg";
import SectionHeading from "./SectionHeading";

export default function Expertise() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentDoctor = tabData[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? tabData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === tabData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="expertise" className="py-9">
      <div className="container mx-auto px-4 lg:px-0">
        {/* Section Header */}
        <SectionHeading
          subtitle="Our Expertise"
          title="Our Areas of Effort in PLID & Orthopedics Healing"
          description="We combine orthopedics, yoga and natural healing remedy system to
            deliver faster relief and long-term recovery for PLID, Sciatica,
            Disc Bulge, and Knee Pain."
          sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
        />

        {/* Name Tabs */}
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          {tabData.map((doctor, index) => (
            <button
              key={doctor.name}
              onClick={() => setActiveIndex(index)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeIndex === index
                  ? "bg-[#4AB7B6] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {doctor.name}
            </button>
          ))}
        </div>

        {/* Tabs Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto transition-all duration-300">
          {/* Image */}
          <div className="w-full md:w-1/3">
            <Image
              src={currentDoctor.image}
              alt={currentDoctor.name}
              width={300}
              height={300}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-black flex items-center gap-2">
                {currentDoctor.name}
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </h3>
              <p className="text-gray-500">{currentDoctor.expertise} Expert</p>
              <p className="text-yellow-500 font-medium">
                ⭐ {currentDoctor.ratting}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {currentDoctor.description}
            </p>

            {/* Highlights */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Highlights</h4>
              <div className="flex gap-4 flex-wrap">
                {currentDoctor.highlight.map((highlight, index) => (
                  <div
                    key={index}
                    className="border rounded-lg px-4 py-2 text-gray-600"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button className="bg-[#4AB7B6] text-white px-6 py-2 rounded-md hover:bg-[#3da3a2] transition">
                Appointment
              </button>
              <button className="border border-[#4AB7B6] text-[#4AB7B6] px-6 py-2 rounded-md hover:bg-[#e8f7f7] transition">
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4AB7B6] text-white hover:bg-[#3da3a2] transition"
          >
            <FaArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 md:mt-16 gap-10">
          <SectionHeading
            subtitle="Why PLID Patients Trust Us"
            title="We avoid unnecessary investigation, We give Injections only when
              really needed, We avoid Surgery in 90% patients"
            description="Research on PLID tell us that more 80-90 PLID need no surgery.
              Their non-surgical treatment is enough for life-time PLID recovery"
            sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
          />
          <div className="relative h-[300px] md:h-[400px] lg:h-[600px]">
            <Image
              src={TrustBanner}
              alt=""
              fill
              className="object-cover rounded-lg shadow"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-5 sm:mt-8 md:mt-16 gap-10">
          <div className="shadow-lg text-black p-5 group hover:bg-primary hover:text-white rounded-lg">
            <h6 className="text-lg md:text-xl font-bold font-montserrat">
              <span className="text-primary group-hover:text-white">
                Fast Pain Relief
              </span>{" "}
              Success Rate
            </h6>
            <h5 className="text-xl md:text-2xl lg:text-3xl font-bold font-montserrat mt-3 sm:mt-5 md:mt-8 lg:mt-10 mb-5">
              92%+
            </h5>
            <p className="text-base sm:text-lg">
              Most patients experience faster symptom improvement with our
              combined medical and natural healing approach.
            </p>
          </div>

          <div className="shadow-lg text-black p-5 group hover:bg-primary hover:text-white rounded-lg">
            <h6 className="text-lg md:text-xl font-bold font-montserrat">
              <span className="text-primary group-hover:text-white">
                Long-Term Recovery
              </span>{" "}
              Without Surgery
            </h6>
            <h5 className="text-xl md:text-2xl lg:text-3xl font-bold font-montserrat mt-3 sm:mt-5 md:mt-8 lg:mt-10 mb-5">
              78%+
            </h5>
            <p className="text-base sm:text-lg">
              Our PLID and spine programs help many patients avoid surgery
              through root-cause treatment and lifestyle correction.
            </p>
          </div>

          <div className="shadow-lg text-black p-5 group hover:bg-primary hover:text-white rounded-lg">
            <h6 className="text-lg md:text-xl font-bold font-montserrat">
              <span className="text-primary group-hover:text-white">
                Patient
              </span>{" "}
              Satisfaction Score
            </h6>
            <h5 className="text-xl md:text-2xl lg:text-3xl font-bold font-montserrat mt-3 sm:mt-5 md:mt-8 lg:mt-10 mb-5">
              4.9/5
            </h5>
            <p className="text-base sm:text-lg">
              Based on follow-up surveys from PLID and chronic pain cases.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

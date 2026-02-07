"use client";
import Image from "next/image";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { TestimonialData } from "@/constrain/data"; // adjust path if needed
import { TfiLayoutLineSolid } from "react-icons/tfi";
import SectionHeading from "./SectionHeading";

export default function Testimonial() {
  const { title, feedback } = TestimonialData;

  return (
    <section id="testimonial" className="py-9 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 lg:px-0">
        {/* Section Heading */}
        <SectionHeading
          subtitle="Testimonial"
          title={title}
          description="Real stories from people who found relief from PLID, spine, knee and
            chronic pain through our non-surgical, science + nature approach."
          sectionClass="space-y-2 mb-4 md:mb-6 lg:mb-10"
        />

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedback.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-semibold text-black">
                    {item.name
                      .split(" ")
                      .map((w) => w[0])
                      .join(" ")}
                  </span>
                )}
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                “{item.comment}”
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h4>

                  {/* Star Rating */}
                  <div className="flex items-center text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => {
                      const full = i + 1 <= item.ratting;
                      const half = !full && i + 0.5 <= item.ratting; // fractional part check

                      return (
                        <span key={i}>
                          {full ? (
                            <FaStar className="text-yellow-500" />
                          ) : half ? (
                            <FaStarHalfAlt className="text-yellow-500" />
                          ) : (
                            <FaRegStar className="text-gray-300" />
                          )}
                        </span>
                      );
                    })}

                    <span className="ml-2 text-sm text-gray-600">
                      {item.ratting}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

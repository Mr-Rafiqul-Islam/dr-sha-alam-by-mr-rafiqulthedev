import Image from "next/image";
import { AiOutlineExport } from "react-icons/ai";
import HeroDoctor from "@/app/assets/Hero.jpg";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-20 md:py-24 pb-16 bg-primary/10"
    >
      <div className="container mx-auto px-4 lg:px-0 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-7 md:gap-10">
        {/* Left Content */}
        <div className="max-w-3xl space-y-2">
          <SectionHeading
            title="Biological Healing — Fast Relief, Root-Cause Treatment, Timeless Principles."
            description="We combine advanced medical science with proven natural remedy systems to deliver fast relief and long-term recovery — without unnecessary medicines or surgery."
            subtitle="Dr Md Shah Alam"
            title2="• Orthopedics Specialist, Spine Surgeion, Yoga Instructor"
            sectionClass="space-y-2"
          />

          {/* Desktop Button */}
          <div className="w-fit mt-5">
            <Link
              href="/appointment"
              className="flex items-center gap-3 bg-primary hover:bg-primary/90 transition-colors duration-500 ease-linear text-white font-medium py-2 px-4 rounded-md cursor-pointer"
            >
              Book Appointment
              <AiOutlineExport size={22} />
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="relative w-[320px] h-[420px] md:w-[460px] md:h-[560px] rounded-[20px] overflow-hidden shadow-lg">
            <Image
              src={HeroDoctor || ""}
              alt="doctor"
              fill
              className="object-cover w-auto h-auto"
              sizes="(max-width: 768px) 320px, 460px"
              priority
              quality={75}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

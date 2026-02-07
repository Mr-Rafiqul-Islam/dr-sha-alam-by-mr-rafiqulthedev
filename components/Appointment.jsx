"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import AppointmentBanner from "@/app/assets/WebImage.jpg";
import SectionHeading from "./SectionHeading";

export default function Appointment() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    phone: "",
    location: "",
    appointmentDate: "",
    doctorId: process.env.NEXT_PUBLIC_DOCTOR_ID,
    problem: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------------------------------
  // SUBMIT → CALL BACKEND PAYMENT START API
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const date = new Date(form.appointmentDate).toISOString();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            appointmentDate: date,
            userId: "",
            siteRef: "DOCTOR_SHA_ALAM",
          }),
        }
      );

      const result = await response.json();

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        alert("Payment initialization failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <section id="appointment" className="py-9 md:py-16">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 justify-between mt-5 sm:mt-8 md:mt-10 lg:mt-16">
          <div className="text-start">
            <SectionHeading
              subtitle="Appointment"
              title="Book Your Appointment With Dr. Shah Alam From Home — No phone
              calls, just a fast, simple, and secure online system through
              ‘SSLCOMMERZ’."
              description="Schedule your appointment at your convenience using our smart
              online booking system. We make the process faster, easier, and
              completely hassle-free. Your information and payment are fully
              protected through ‘SSLCOMMERZ’ secure platform"
              sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
            />
            <form
              className="space-y-4 bg-primary p-6 rounded-lg text-white mt-5 sm:mt-7 md:mt-10"
              onSubmit={handleSubmit}
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Your Name"
                  onChange={handleChange}
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md placeholder-white/70 focus:outline-none focus:border-accent"
                />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md focus:outline-none focus:border-accent"
                >
                  <option className="text-black">Gender</option>
                  <option className="text-black">Male</option>
                  <option className="text-black">Female</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  placeholder="Mobile Number"
                  onChange={handleChange}
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md placeholder-white/70 focus:outline-none focus:border-accent"
                />
                <input
                  type="location"
                  name="location"
                  value={form.location}
                  placeholder="Your Location"
                  onChange={handleChange}
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md placeholder-white/70 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  placeholder="Appointment Date"
                  onChange={handleChange}
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md text-white focus:outline-none focus:border-accent"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-medium py-2 rounded-md hover:opacity-90 transition cursor-pointer"
              >
                {loading ? "Processing..." : "SUBMIT"}
              </button>
            </form>
          </div>

          <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={AppointmentBanner || ""}
              alt="appointment"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

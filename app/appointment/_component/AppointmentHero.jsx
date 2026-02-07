"use client";

import { useState } from "react";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import Player from "next-video/player";
import AppointmentVideo from "@/videos/কেন-অগ্রিম-পেমেন্ট-করে-সিরিয়াল-দিতে-হবে-720p.mp4.json";
import Thumbnail from "@/app/assets/Thumbnail-scaled.jpg";
import SectionHeading from "@/components/SectionHeading";

export default function AppointmentHero() {
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
    console.log(form);
    console.log(date);

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
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="text-start">
          <SectionHeading
            title="সরাসরি ডা. শাহ্‌ আলমের এপয়েন্টমেন্ট পেতে পারেন ঘরে বসে, কাউকে ফোন না
            করে, আপনার সুবিধামত সময় ও তারিখে এবং নিরাপদ পেমেন্ট সিস্টেম
            ‘SSLCOMMERZ’ এর মাধ্যমে"
            subtitle="এপয়েন্টমেন্ট"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 justify-between items-center mt-5 sm:mt-8 md:mt-10 lg:mt-16">
            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-primary p-6 rounded-lg text-white h-auto"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md placeholder-white/70 focus:outline-none focus:border-accent"
                />

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md focus:outline-none focus:border-accent"
                >
                  <option value="">Gender</option>
                  <option className="text-black" value="Male">
                    Male
                  </option>
                  <option className="text-black" value="Female">
                    Female
                  </option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Mobile Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md placeholder-white/70 focus:outline-none focus:border-accent"
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="bg-transparent border border-white/30 px-3 py-2 rounded-md placeholder-white/70 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="appointmentDate"
                  value={form.appointmentDate}
                  onChange={handleChange}
                  required
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

            {/* VIDEO */}
            <div className="rounded-xl overflow-hidden">
              <Player
                key={{ apikey: process.env.MUX_TOKEN_ID }}
                className="rounded-xl"
                src={AppointmentVideo.sources[0].src}
                poster={Thumbnail.src}
                blurDataURL={AppointmentVideo.blurDataURL}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

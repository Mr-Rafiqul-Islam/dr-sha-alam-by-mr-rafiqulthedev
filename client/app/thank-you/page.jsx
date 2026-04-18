import ThankYouVideo from "@/videos/আপনার-এপয়েন্টমেন্ট-সঠিকভাবে-সম্পন্ন-হয়েছে.1.mp4.json";
import Thumbnail from "@/app/assets/Thumbnail-Thank-You.jpg";
import Video from "@/components/Video";
import { notFound } from "next/navigation";

// Input sanitization function to prevent injection attacks
function sanitizeAppointmentId(id) {
  if (!id || typeof id !== "string") {
    return null;
  }
  // Only allow alphanumeric characters and hyphens (for UUIDs)
  // Remove any potentially dangerous characters
  const sanitized = id.replace(/[^a-zA-Z0-9-]/g, "");
  // Limit length to prevent DoS (UUIDs are typically 36 chars)
  return sanitized.length > 50 ? null : sanitized;
}

export default async function ThankPage(props) {
  const searchParams = await props.searchParams;

  // Sanitize and validate appointmentId to prevent injection attacks
  const rawAppointmentId = searchParams?.appointmentId;
  const appointmentId = sanitizeAppointmentId(rawAppointmentId);

  if (!appointmentId) {
    notFound();
  }

  let appointmentData;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/appointment/single/${encodeURIComponent(appointmentId)}`,
      { 
        cache: "no-store",
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }
    );
    
    if (!response.ok) {
      notFound();
    }
    
    appointmentData = await response.json();
    
    // Validate response structure
    if (!appointmentData?.appointment) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    notFound();
  }

  return (
    <section className="py-9 md:py-24">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-xl md:text-3xl font-bold font-montserrat text-black mb-5 md:mb-10">
            Thank You For Your Appointment
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="border border-primary rounded-xl p-5 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-black mb-5">
              Appointment Details
            </h2>
            <p className="text-lg md:text-xl font-medium font-montserrat text-black mb-5">
              <span className="font-bold">Transaction ID:</span>{" "}
              {appointmentData?.appointment?.transactionId}
            </p>
            <p className="text-lg md:text-xl font-medium font-montserrat text-black mb-5">
              <span className="font-bold">Patient Name:</span>{" "}
              {appointmentData?.appointment?.name}
            </p>
            <p className="text-lg md:text-xl font-medium font-montserrat text-black mb-5">
              <span className="font-bold">Phone Number:</span>{" "}
              {appointmentData?.appointment?.phone}
            </p>
            <p className="text-lg md:text-xl font-medium font-montserrat text-black mb-5">
              <span className="font-bold">Location:</span>{" "}
              {appointmentData?.appointment?.location}
            </p>
            <p className="text-lg md:text-xl font-medium font-montserrat text-black mb-5">
              <span className="font-bold">Appointment Date:</span>{" "}
              {appointmentData?.appointment?.appointmentDate}
            </p>
          </div>
          {/* VIDEO */}
          <Video
            video={ThankYouVideo.sources[0].src}
            poster={Thumbnail.src}
            blurDataURL={Thumbnail.src}
          />
        </div>
      </div>
    </section>
  );
}

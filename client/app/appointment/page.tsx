import AppointmentSteps from "@/components/appointment/AppointmentSteps";
import BookingForm from "@/components/booking/BookingForm";
import Image from "next/image";
import Link from "next/link";

export default function BookAppointment() {
  const beforeConsultationList = [
    "Arrive at least 15 minutes before your scheduled appointment.",
    "Bring previous MRI reports, X-rays, prescriptions, and relevant medical documents.",
    "Wear comfortable clothing if a physical examination may be required.",
    "Prepare a list of symptoms, concerns, and questions you would like to discuss.",
    "Inform us in advance if you need to cancel or reschedule.",
  ];

  const bookingFaqs = [
    {
      question: "How much is the consultation fee?",
      answer:
        "Consultation fees may vary depending on consultation type and service requirements. Our team will provide details during appointment confirmation.",
    },
    {
      question: "Do I need an MRI before booking?",
      answer:
        "No. Many patients can be evaluated before obtaining an MRI. Additional investigations are recommended only when necessary.",
    },
    {
      question: "Can I book an appointment for a family member?",
      answer:
        "Yes. You may book consultations on behalf of family members, provided accurate patient information is supplied.",
    },
    {
      question: "Can I upload my reports before the appointment?",
      answer:
        "Yes. MRI reports, X-rays, prescriptions, and other medical records may be uploaded through this form or shared with our team before your consultation.",
    },
  ];
  return (
    <>
      <section className="relative bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-surface-dark lg:pt-16 lg:pb-20 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wide uppercase">
                <span className="material-symbols-outlined text-lg">
                  calendar_month
                </span>
                Easy Online Booking
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary dark:text-white leading-tight">
                Book Appointment
              </h1>
              <p className="text-base text-text-sub max-w-2xl mx-auto lg:mx-0 font-medium">
                Whether you&apos;re suffering from PLID, sciatica, back pain, neck
                pain, joint pain, or movement limitations, Dr. Shah Alam will
                help you understand your condition, explore your treatment
                options, and choose the right path toward recovery.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl transform translate-x-4 translate-y-4"></div>
                <Image
                  alt="Professional photo of Dr Shah Alam"
                  className="z-10 object-cover rounded-full border-8 border-white dark:border-surface-dark shadow-2xl"
                  src="/sir-3.jpg"
                  fill
                  sizes="(max-width: 768px) 288px, 384px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentSteps />
        </div>
      </section>

      <BookingForm />

      <section className="lg:py-20 py-12 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-primary dark:text-white mb-6">
                TruCare Diagnostic Centre
                </h2>
                <p className="text-text-sub text-lg leading-relaxed mb-8">
                  Our modern facility is equipped with the latest rehabilitation
                  technology. Visit us for a consultation and start your journey
                  to recovery.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white text-lg">
                      Address
                    </h4>
                    <p className="text-text-sub mt-1">
                    49, Mohakhali, Beside Square Centre, Wireless Gate, Mohakhali, Dhaka 1212
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white text-lg">
                      Chamber Hours
                    </h4>
                    <p className="text-text-sub mt-1">
                      Saturday - Thursday: 9:00 AM – 8:00 PM
                      <br />
                      Friday: Closed
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white text-lg">
                      Contact for Booking
                    </h4>
                    <p className="text-text-sub mt-1">
                    09613-668866
                    <br />
                    01701-313001
                    <br />
                    01701-313002
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-background-dark relative group">
              <Image
                alt="Map location"
                className="object-cover"
                src="/chamber-view-1.jpeg"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
              <Link
                className="absolute bottom-6 right-6 bg-white text-primary px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
                href="https://maps.app.goo.gl/9QeTRrQ9PtqQk6Rj8"
              >
                Get Directions
                <span className="material-symbols-outlined">directions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:py-16 py-12 bg-primary dark:bg-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-6">
            Need Immediate Assistance?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            If you have questions regarding appointments, reports, symptoms, or
            consultation preparation, our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1"
              href="https://wa.me/+8801789639174"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp text-2xl"></i>
              WhatsApp Support
            </Link>
            <a
              className="inline-flex items-center justify-center gap-3 bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1"
              href="tel:+8801701313001"
            >
              <span className="material-symbols-outlined">call</span>
              Call Our Team
            </a>
          </div>
        </div>
      </section>

      <section className="lg:py-20 py-12 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-12 shadow-soft border-l-8 border-accent">
            <div className="flex items-start gap-6">
              <div className="hidden md:flex w-16 h-16 bg-accent/10 rounded-full items-center justify-center shrink-0 text-accent">
                <span className="material-symbols-outlined text-4xl">info</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                  Before Your Consultation
                </h3>
                <p className="text-text-sub text-sm mb-6">
                  To help us provide the best possible care, please remember:
                </p>

                <ul className="space-y-4">
                  {beforeConsultationList.map((text, idx) => (
                    <li className="flex items-start gap-3" key={idx}>
                      <span className="material-symbols-outlined text-accent mt-0.5">
                        check_circle
                      </span>
                      <span className="text-text-sub">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lg:py-20 py-12 bg-white dark:bg-surface-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-primary dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {bookingFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-background-light dark:bg-background-dark rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
              >
                <summary className="flex items-center justify-between gap-1.5 text-text-main dark:text-white font-bold text-lg">
                  <h4 className="text-left">{faq.question}</h4>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-gray-500">
                    expand_more
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-text-sub text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

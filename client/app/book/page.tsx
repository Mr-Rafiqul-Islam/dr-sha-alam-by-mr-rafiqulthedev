import BookingForm from '@/components/booking/BookingForm';
import Image from 'next/image';
import Link from 'next/link';

export default function BookAppointment() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-surface-dark pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wide uppercase">
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                Easy Online Booking
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary dark:text-white leading-tight">
                Book Appointment
              </h1>
              <p className="text-xl text-text-sub max-w-2xl mx-auto lg:mx-0 font-medium">
                Book your consultation with Doctor Shah Alam easily. Skip the queue and secure your slot for personalized orthopedic care.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl transform translate-x-4 translate-y-4"></div>
                <Image alt="Professional photo of Dr Shah Alam" className="z-10 object-cover rounded-full border-8 border-white dark:border-surface-dark shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXyswzoTx0Ks3xnTRTj39uHpQsl1ZuUMtsAAL9aHcJuQLx8alBskvzCXQXp8Oi4vlwgGBhwQaG70s3K0GJyOzq-GchzxNoFsAStwzkgWzPkat2_XMpTiGt8hmpOZR3JxvM6PFxuxtsWfxWpKzOMMQ4bh39Kd-6aTgnq5e7asU2WjtjG7TiHe6KRX39buIcw5iIq7cHHlDh5dWKWJIRshM8iluJ7k3EJWtyHQQq8ZlJyY2TzlNbeAMYY3NJE8t3-uwIIZsf1UtPcEU" fill sizes="(max-width: 768px) 288px, 384px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">edit_document</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white">1. Fill the form</h3>
              <p className="text-sm text-text-sub">Provide your details</p>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10"></div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">support_agent</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white">2. We contact you</h3>
              <p className="text-sm text-text-sub">To confirm availability</p>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10"></div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white">3. Confirm</h3>
              <p className="text-sm text-text-sub">Receive confirmation</p>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10"></div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 relative group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">medical_services</span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white">4. Visit Chamber</h3>
              <p className="text-sm text-text-sub">Meet Dr. Shah Alam</p>
            </div>
          </div>
        </div>
      </section>

      <BookingForm/>

      <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Visit Us</h2>
                <h3 className="text-3xl font-extrabold text-primary dark:text-white mb-6">Chamber Location</h3>
                <p className="text-text-sub text-lg leading-relaxed mb-8">
                  Our modern facility is equipped with the latest rehabilitation technology. Visit us for a consultation and start your journey to recovery.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white text-lg">Address</h4>
                    <p className="text-text-sub mt-1">House 42, Road 7, Sector 3, Uttara Model Town, Dhaka - 1230</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white text-lg">Chamber Hours</h4>
                    <p className="text-text-sub mt-1">Saturday - Thursday: 9:00 AM - 10:00 PM<br/>Friday: Closed</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white text-lg">Contact for Booking</h4>
                    <p className="text-text-sub mt-1">+880 1712 345 678<br/>appointment@drshahalam.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full min-h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-background-dark relative group">
              <Image alt="Map location" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_XhY7dbV--FNwz0DYaTdRVQBV5ha5qA3L3XmuwNFJX1yy41E10_9m10F2DQ0ABe1GjW0GeBCf629me4oyOPdwKV9vh5gRLKBkqx6OXbTWN2CmAqxR6BG7PbsPgAZ5Ot6zj6CUtcCTFxC15Xrrh3ZyIG3cTPwh06eOF6CKbuwtGd_SWTGoxjnzMowTIHoFqS3sXLeiZzdFSIZHEaSE5wAoNYUILy-fa0s7D-WIx4F33zdJvRwpDP6yUZiV2yH4hxMvuSPtnzfboRk" fill sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
              <Link className="absolute bottom-6 right-6 bg-white text-primary px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2" href="#">
                Get Directions
                <span className="material-symbols-outlined">directions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary dark:bg-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-6">Need Immediate Assistance?</h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">If you have urgent queries or need help with booking, reach out directly via WhatsApp or Phone call.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1" href="https://wa.me/+8801312353577" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp text-2xl"></i>
              WhatsApp Us
            </Link>
            <a className="inline-flex items-center justify-center gap-3 bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1" href="tel:+8801701313001">
              <span className="material-symbols-outlined">call</span>
              +880 1701 313 001
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 md:p-12 shadow-soft border-l-8 border-accent">
            <div className="flex items-start gap-6">
              <div className="hidden md:flex w-16 h-16 bg-accent/10 rounded-full items-center justify-center shrink-0 text-accent">
                <span className="material-symbols-outlined text-4xl">info</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-6">Before You Visit</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent mt-0.5">check_circle</span>
                    <span className="text-text-sub">Please arrive at least 15 minutes before your scheduled appointment time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent mt-0.5">check_circle</span>
                    <span className="text-text-sub">Bring all previous medical reports, X-rays, and prescriptions relevant to your condition.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent mt-0.5">check_circle</span>
                    <span className="text-text-sub">Wear comfortable clothing that allows for easy examination of the affected area.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent mt-0.5">check_circle</span>
                    <span className="text-text-sub">If you need to cancel, please inform us at least 24 hours in advance.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-surface-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">FAQ</h2>
            <h3 className="text-3xl font-extrabold text-primary dark:text-white">Common Questions</h3>
          </div>
          <div className="space-y-4">
            <details className="group bg-background-light dark:bg-background-dark rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <summary className="flex items-center justify-between gap-1.5 text-text-main dark:text-white font-bold text-lg">
                <h4 className="text-left">How much is the consultation fee?</h4>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-gray-500">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-text-sub text-sm">
                The initial consultation fee is BDT 1500. Follow-up visits within 15 days are BDT 1000. Fees may vary for specific procedures or therapies.
              </p>
            </details>
            <details className="group bg-background-light dark:bg-background-dark rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <summary className="flex items-center justify-between gap-1.5 text-text-main dark:text-white font-bold text-lg">
                <h4 className="text-left">Do I need a referral?</h4>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-gray-500">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-text-sub text-sm">
                No, you do not strictly need a referral to book an appointment with Dr. Shah Alam. However, if you have been referred by another doctor, please bring the referral note.
              </p>
            </details>
            <details className="group bg-background-light dark:bg-background-dark rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <summary className="flex items-center justify-between gap-1.5 text-text-main dark:text-white font-bold text-lg">
                <h4 className="text-left">Can I book for someone else?</h4>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-gray-500">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-text-sub text-sm">
                Yes, absolutely. When filling out the form, simply use the patient&apos;s name and details. You can put your own contact number if you are managing the appointment for them.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}

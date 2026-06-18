import ScrollReveal from '@/components/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';

export default function VisitChamber() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 md:w-3/5">
            <h2 className="text-3xl font-bold text-text-main dark:text-white">Visit Our Chamber</h2>
            <p className="text-text-sub">Come visit us for a consultation. We prioritize listening to your history before suggesting any treatment plan.</p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white">TruCare Diagnostic Centre</h4>
                  <p className="text-text-sub text-sm">49, Mohakhali, Beside Square Centre, Wireless Gate,
                  Mohakhali, Dhaka 1212</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white">Visiting Hours</h4>
                  <p className="text-text-sub text-sm">Saturday to Thursday: 9:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-2/5 w-full flex flex-col gap-4">
            <div className="aspect-video rounded-xl overflow-hidden shadow-md bg-gray-200">
              <Image alt="Clinic Location Map" width={500} height={500} className="w-full h-full object-cover" src="/chamber-view.jpeg"/>
            </div>
            <Link href="/appointment" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2">
              Book Appointment Now
              <span className="material-symbols-outlined">calendar_month</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

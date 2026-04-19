import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function TreatmentCallToAction() {
  return (
    <section className="py-16 px-4">
      <ScrollReveal direction="up" className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-primary to-primary-dark overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 p-12 lg:p-20 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to Live Pain-Free?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Don&apos;t let pain dictate your life. Schedule your consultation with Dr. Shah Alam today and take the first step towards recovery.
          </p>
          <Link href="/book" className="inline-block bg-accent hover:bg-white hover:text-primary text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg transform hover:-translate-y-1">
            Book Appointment
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

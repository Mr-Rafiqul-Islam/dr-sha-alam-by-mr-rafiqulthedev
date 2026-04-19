import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function FAQContact() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up" className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-10 md:p-14 shadow-soft">
          <h2 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">Still have questions?</h2>
          <p className="text-text-sub mb-8 max-w-lg mx-auto">Can&apos;t find what you&apos;re looking for? Please chat with our friendly team.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group w-full sm:w-auto justify-center" href="#">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <i className="fab fa-whatsapp text-xl"></i>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-semibold uppercase">Chat with us</p>
                <p className="text-sm font-bold text-text-main dark:text-white">+880 1712 345 678</p>
              </div>
            </a>
            <a className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group w-full sm:w-auto justify-center" href="#">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-semibold uppercase">Call anytime</p>
                <p className="text-sm font-bold text-text-main dark:text-white">+880 1XXX-XXXXXX</p>
              </div>
            </a>
          </div>
          <div className="mt-10">
            <Link href="/book" className="inline-block bg-[#00CBC0] hover:bg-accent-dark text-white text-base font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Book Appointment
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

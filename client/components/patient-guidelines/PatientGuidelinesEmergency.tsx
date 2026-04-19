import ScrollReveal from '@/components/ScrollReveal';

export default function PatientGuidelinesEmergency() {
  return (
    <section className="py-16 bg-background-light dark:bg-background-dark" id="emergency-info">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="bg-primary rounded-3xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-4xl text-white">notification_important</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-extrabold text-white mb-3">In Case of Emergency</h3>
              <p className="text-accent text-lg font-medium mb-4">Sudden severe pain? Numbness? Don&apos;t wait.</p>
              <p className="text-white/90 leading-relaxed text-sm md:text-base">
                If you experience sudden, unbearable pain, loss of bowel/bladder control, or severe numbness in your limbs, please proceed to the nearest emergency room immediately or contact our emergency line.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a className="inline-flex items-center justify-center bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 gap-2" href="tel:+8801701313001">
                <span className="material-symbols-outlined">call</span>
                Emergency Call
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
import ScrollReveal from '@/components/ScrollReveal';

export default function PatientGuidelinesContact() {
  return (
    <section className="py-16 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">Need Clarification?</h2>
          <p className="text-text-sub mb-8 max-w-xl mx-auto">If you have questions about your condition, treatment plan, rehabilitation exercises, medications, or recovery process, our team is here to help. <br />
          </p>
          <a className="inline-flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 gap-3" href="https://wa.me/+8801312353577" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp text-2xl"></i>
            <span>WhatsApp Support</span>
          </a>

          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
            <blockquote className="text-lg md:text-xl text-text-main dark:text-white italic leading-relaxed max-w-2xl mx-auto mb-4">
              &quot;Understanding your condition is the first step toward recovery.&quot;
            </blockquote>
            <p className="font-handwriting text-xl font-bold text-primary italic">
              — Dr. Shah Alam
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
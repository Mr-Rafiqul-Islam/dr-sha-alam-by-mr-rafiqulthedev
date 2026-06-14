import ScrollReveal from "@/components/ScrollReveal";

export default function ContactForm() {
  return (
    <div className="bg-background-light dark:bg-background-dark p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">
          Send Us A Message
        </h2>
        <p className="text-text-sub text-sm">
          Have questions about your condition, treatment options, MRI findings,
          online consultation, or appointment booking?<br /> Fill out the form below
          and our team will get back to you as soon as possible.
        </p>
      </div>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              person
            </span>
            <input
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Your Name"
              type="text"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
          Phone / WhatsApp Number
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              call
            </span>
            <input
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Your Phone Number"
              type="tel"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
          How Can We Help You?
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
              medical_services
            </span>
            <select
              defaultValue=""
              className="w-full pl-12 pr-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option disabled value="">
                Select a Service
              </option>
              <option value="plid-consultation">PLID Consultation</option>
              <option value="general-consultation">General Consultation</option>
              <option value="online-consultation">
                Online Consultation
              </option>
              <option value="yoga-program">Yoga Program</option>
              <option value="technical-support">Technical Support</option>
              <option value="collaboration">Collaboration</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              expand_more
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text-main dark:text-gray-300">
            Your Message
          </label>
          <textarea
            className="w-full px-5 py-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all shadow-sm"
            placeholder="Tell us about your condition or query..."
            rows={5}
          ></textarea>
        </div>
        <button className="w-full bg-[#00CBC0] hover:bg-accent-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">send</span>
          Send My Request
        </button>
      </form>
    </div>
  );
}

export default function BookingForm() {
  return (
    <section
      className="py-20 bg-background-light dark:bg-background-dark"
      id="booking-form"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-soft p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white mb-4 text-center">
          Request Your Consultation
          </h2>
          <p className="text-text-sub text-sm text-center mb-8">Complete the form below and our team will contact you shortly to confirm your appointment.</p>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="Enter patient's name"
                  required
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="017XXXXXXXX"
                  required
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Home Address <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  placeholder="Kalighat, Sreemangal, Sylhet"
                  required
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                Describe Your Problem
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                placeholder="Briefly describe the symptoms or condition..."
                rows={3}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  required
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-text-main dark:text-gray-300">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all appearance-none">
                    <option>Select Time Slot</option>
                    <option>PLID (Present at - 9:00 AM)</option>
                    <option>Old PLID (Present at - 4:00 PM)</option>
                    <option>General Patient (Present at - 5:00 PM)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full bg-[#00CBC0] hover:bg-[#00a89f] text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Request Appointment
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
              </button>
              <p className="text-center text-xs text-text-sub mt-4">
                By submitting this form, you agree to our Privacy Policy and
                Terms & Conditions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

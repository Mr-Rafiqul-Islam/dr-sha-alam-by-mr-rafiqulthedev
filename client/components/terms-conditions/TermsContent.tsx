import ScrollReveal from '@/components/ScrollReveal';

export default function TermsContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal direction="up" className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="prose prose-lg dark:prose-invert max-w-none text-text-main dark:text-gray-300">
          <p className="lead text-lg font-medium text-gray-700 dark:text-gray-300 mb-8">
            Welcome to the official website of Dr. Shah Alam (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using this website, you agree to comply with and be bound by the following terms and conditions of use. If you disagree with any part of these terms and conditions, please do not use our website.
          </p>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">1. Medical Disclaimer</h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-400">
            The content provided on this website, including text, graphics, images, and other material, is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <ul className="list-disc ml-5 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
            <li>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</li>
            <li>Never disregard professional medical advice or delay in seeking it because of something you have read on this website.</li>
            <li>If you think you may have a medical emergency, call your doctor or emergency services immediately.</li>
          </ul>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">2. Use of Services</h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-400">
            By booking an appointment or using our rehabilitation services, you acknowledge that:
          </p>
          <ol className="list-decimal ml-5 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
            <li>You will provide accurate and complete health history information to ensure safe treatment.</li>
            <li>Results from treatments may vary from person to person depending on individual conditions and adherence to prescribed rehabilitation protocols.</li>
            <li>Dr. Shah Alam reserves the right to refuse service to anyone for any reason at any time, particularly if a condition is deemed outside our scope of practice.</li>
          </ol>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">3. Appointment Policy</h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-400">
            We value your time and the time of our medical staff. Please review our appointment policies:
          </p>
          <ul className="list-disc ml-5 text-gray-600 dark:text-gray-400 space-y-2 mb-6">
            <li><strong>Cancellations:</strong> Please provide at least 24 hours&apos; notice if you need to cancel or reschedule an appointment. Late cancellations may be subject to a fee.</li>
            <li><strong>Late Arrivals:</strong> Arriving late may result in a shortened session time to accommodate the next patient.</li>
            <li><strong>No-Shows:</strong> Repeated no-shows may result in the inability to book future appointments.</li>
          </ul>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">4. Privacy &amp; Data Protection</h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-400">
            Your privacy is critically important to us. We are committed to protecting your personal and medical information in accordance with applicable medical privacy laws.
          </p>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-400">
            We collect personal information solely for the purpose of providing medical care and improving our services. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as required by law or for necessary medical referrals.
          </p>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">5. Intellectual Property</h2>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-400">
            All content included on this site, such as text, graphics, logos, images, video clips, and digital downloads, is the property of Dr. Shah Alam or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of Dr. Shah Alam.
          </p>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">6. Limitation of Liability</h2>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-400">
            In no event shall Dr. Shah Alam, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract. Dr. Shah Alam, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
          </p>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">7. Governing Law</h2>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-400">
            These Terms shall be governed by and interpreted in accordance with the laws of Bangladesh, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Bangladesh for the resolution of any disputes.
          </p>

          <h2 className="text-primary font-bold text-2xl mt-10 mb-4">8. Changes to Terms</h2>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-400">
            We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="font-bold text-lg text-text-main dark:text-white mb-2">Contact Us</p>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about these Terms &amp; Conditions, please contact us at:<br/>
              <a className="text-primary hover:text-accent font-medium transition-colors" href="mailto:info@drshahalam.com">info@drshahalam.com</a> or call us at <span className="font-medium text-text-main dark:text-white">+880 1712 345 678</span>.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
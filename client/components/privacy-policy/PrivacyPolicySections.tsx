import ScrollReveal from '@/components/ScrollReveal';

export default function PrivacyPolicySections() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-text-main dark:text-gray-300">
      <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">1. Information We Collect</h2>
        <p className="text-text-sub mb-4">
          To provide you with the best possible orthopedic and rehabilitation care, we may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent">
          <li><strong>Personal Identification:</strong> Name, age, gender, date of birth, and contact details (phone number, email, address).</li>
          <li><strong>Medical History:</strong> Previous diagnoses, current symptoms, medication history, X-rays, MRI reports, and other relevant health records.</li>
          <li><strong>Appointment Details:</strong> Scheduling preferences, reason for visit, and insurance information if applicable.</li>
          <li><strong>Website Usage Data:</strong> Information collected automatically through cookies when you visit our website, such as IP address and browser type.</li>
        </ul>
      </ScrollReveal>

      <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">2. How We Use Your Data</h2>
        <p className="text-text-sub mb-4">
          We use the information we collect strictly for medical and administrative purposes, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent">
          <li><strong>Diagnosis &amp; Treatment:</strong> To create personalized rehabilitation plans, including yoga therapy and non-surgical interventions.</li>
          <li><strong>Communication:</strong> To send appointment reminders, follow-up on your recovery progress, and respond to your inquiries.</li>
          <li><strong>Clinic Operations:</strong> For internal record keeping, billing, and improving our services.</li>
          <li><strong>Legal Compliance:</strong> To comply with local medical regulations and healthcare laws.</li>
        </ul>
      </ScrollReveal>

      <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">3. Data Security</h2>
        <p className="text-text-sub mb-4">
          We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online and offline.
        </p>
        <p className="text-text-sub">
          Your medical records are stored in a secure, encrypted database accessible only to authorized medical personnel directly involved in your care.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">4. Sharing of Information</h2>
        <p className="text-text-sub mb-4">
          We respect your privacy and do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
        </p>
        <p className="text-text-sub">
          We may release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others&apos; rights, property, or safety.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">5. Your Rights</h2>
        <p className="text-text-sub mb-4">
          As a patient, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent">
          <li>Access your personal and medical records upon request.</li>
          <li>Request corrections to any inaccurate information.</li>
          <li>Request deletion of your data, subject to medical record retention laws.</li>
          <li>Withdraw consent for marketing communications at any time.</li>
        </ul>
      </ScrollReveal>

      <ScrollReveal direction="up" className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">6. Contact Us</h2>
        <p className="text-text-sub mb-4">
          If you have any questions regarding this privacy policy or how we handle your data, you may contact us using the information below:
        </p>
        <p className="font-bold text-text-main dark:text-white">Doctor Shah Alam Clinic</p>
        <p className="text-text-sub">House 42, Road 7, Sector 3, Uttara, Dhaka - 1230</p>
        <p className="text-text-sub">Email: privacy@drshahalam.com</p>
        <p className="text-text-sub">Phone: +880 1712 345 678</p>
      </ScrollReveal>
    </div>
  );
}

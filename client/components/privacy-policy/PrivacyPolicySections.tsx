import ScrollReveal from "@/components/ScrollReveal";

const cardClass =
  "bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10";

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-text-sub">
      <span className="text-accent shrink-0 font-bold">✔</span>
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPolicySections() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-text-main dark:text-gray-300">
      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          1. Information We Collect
        </h2>
        <p className="text-text-sub mb-6">
          To provide safe and effective care, we may collect:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="order-1 sm:order-1">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3 mt-0">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-6">
              <li>Full Name</li>
              <li>Age and Date of Birth</li>
              <li>Gender</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Residential Address</li>
            </ul>
          </div>

          <div className="order-4 sm:order-2">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3 mt-0">
              Website Usage Information
            </h3>
            <p className="text-text-sub mb-3">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent">
              <li>IP Address</li>
              <li>Browser Type</li>
              <li>Device Information</li>
              <li>Website Activity Data</li>
              <li>Cookies and Analytics Information</li>
            </ul>
          </div>

          <div className="order-2 sm:order-3">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3 mt-0">
              Appointment Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-6">
              <li>Consultation Requests</li>
              <li>Appointment Preferences</li>
              <li>Follow-Up Details</li>
              <li>Patient Communications</li>
            </ul>
          </div>
          <div className="order-3 sm:order-4">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3 mt-0">
              Medical Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-6">
              <li>Medical History</li>
              <li>Current Symptoms</li>
              <li>Previous Diagnoses</li>
              <li>Medication History</li>
              <li>MRI Reports</li>
              <li>X-Ray Reports</li>
              <li>Laboratory Results</li>
              <li>Treatment Records</li>
            </ul>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          2. How We Use Your Information
        </h2>
        <p className="text-text-sub mb-6">Your information may be used to:</p>

        <div className="space-y-4 text-text-sub">
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">
              Deliver Healthcare Services
            </p>
            <p>
              Provide consultations, evaluations, treatment recommendations, and
              follow-up care.
            </p>
          </div>
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">
              Appointment Management
            </p>
            <p>
              Schedule, confirm, reschedule, and remind you about appointments.
            </p>
          </div>
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">
              Patient Communication
            </p>
            <p>
              Respond to inquiries and provide important healthcare updates.
            </p>
          </div>
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">
              Medical Record Management
            </p>
            <p>
              Maintain accurate clinical documentation and treatment records.
            </p>
          </div>
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">
              Improve Services
            </p>
            <p>Analyze website performance and improve patient experience.</p>
          </div>
          <div>
            <p className="font-bold text-text-main dark:text-white mb-1">
              Legal &amp; Regulatory Compliance
            </p>
            <p>
              Comply with applicable healthcare laws, professional regulations,
              and legal obligations.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          3. Data Security
        </h2>
        <p className="font-bold text-text-main dark:text-white mb-4">
          Protecting Your Information Is A Priority
        </p>
        <p className="text-text-sub mb-4">
          We take reasonable administrative, technical, and physical measures to
          safeguard your personal and medical information. Your records are
          stored securely and access is restricted to authorized personnel
          involved in your care.
        </p>
        <p className="text-text-sub">
          Despite our best efforts, no electronic system can guarantee absolute
          security. However, we continuously work to maintain appropriate
          safeguards.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          4. Sharing of Information
        </h2>
        <p className="font-bold text-text-main dark:text-white mb-4">
          We Respect Your Confidentiality
        </p>
        <p className="text-text-sub mb-4">
          We do not sell, rent, or trade your personal information. Information
          may only be shared under the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
          <li>With healthcare professionals involved in your care</li>
          <li>With service providers assisting clinic operations</li>
          <li>When required by law</li>
          <li>To protect patient safety or public health</li>
          <li>With your explicit consent</li>
        </ul>
        <p className="text-text-sub">
          Any third parties receiving information are expected to maintain
          appropriate confidentiality standards.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          5. Your Rights
        </h2>
        <p className="text-text-sub mb-4">
          As a patient, you have the right to:
        </p>
        <ul className="space-y-3 mb-4">
          <ChecklistItem>
            Request access to your personal information
          </ChecklistItem>
          <ChecklistItem>
            Request correction of inaccurate information
          </ChecklistItem>
          <ChecklistItem>
            Request updates to medical records when appropriate
          </ChecklistItem>
          <ChecklistItem>
            Withdraw consent for non-essential communications
          </ChecklistItem>
          <ChecklistItem>
            Request clarification regarding how your information is used
          </ChecklistItem>
        </ul>
        <p className="text-text-sub">
          Certain requests may be subject to legal, medical, or regulatory
          requirements.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          6. Cookies &amp; Website Analytics
        </h2>
        <p className="text-text-sub mb-4">
          Our website may use cookies and analytics tools to improve
          functionality and user experience. These technologies help us
          understand website usage patterns and optimize our services.
        </p>
        <p className="text-text-sub">
          You may disable cookies through your browser settings; however, some
          website features may not function properly.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          7. Third-Party Links
        </h2>
        <p className="text-text-sub mb-4">
          Our website may contain links to external websites for educational or
          informational purposes. We are not responsible for the privacy
          practices, content, or security of third-party websites.
        </p>
        <p className="text-text-sub">
          We encourage users to review the privacy policies of any external
          websites they visit.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          8. Children&apos;s Privacy
        </h2>
        <p className="text-text-sub mb-4">
          Our services are not intended to collect personal information from
          children without appropriate parental or guardian involvement.
        </p>
        <p className="text-text-sub">
          If you believe a child has provided personal information without
          consent, please contact us immediately.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          9. Changes to This Policy
        </h2>
        <p className="text-text-sub mb-4">
          We may update this Privacy Policy periodically to reflect changes in
          healthcare regulations, technology, or clinic operations.
        </p>
        <p className="text-text-sub mb-4">
          Any updates will be published on this page with the revised effective
          date.
        </p>
        <p className="text-text-sub">
          Continued use of our services indicates acceptance of the updated
          policy.
        </p>
      </ScrollReveal>

      <ScrollReveal
        direction="up"
        className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mb-10"
      >
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">
          10. Contact Us
        </h2>
        <p className="font-bold text-text-main dark:text-white mb-4">
          Questions About Privacy?
        </p>
        <p className="text-text-sub mb-4">
          If you have questions regarding this Privacy Policy or how your
          information is handled, please contact us.
        </p>
        <p className="font-bold text-text-main dark:text-white mb-2">
          Dr. Shah Alam
        </p>
        <p className="text-text-sub mb-1">
          49, Mohakhali, Beside Square Centre, Wireless Gate, Mohakhali, Dhaka
          1212,
        </p>
        <p className="text-text-sub mb-1">
          Phone:{" "}
          <a
            className="text-primary hover:text-accent font-medium transition-colors"
            href="tel:+8801701313002"
          >
            +880 1701313002
          </a>
        </p>
        <p className="text-text-sub mb-1">
          Email:{" "}
          <a
            className="text-primary hover:text-accent font-medium transition-colors"
            href="mailto:contact@doctorshahalam.com"
          >
            contact@doctorshahalam.com
          </a>
        </p>
        <p className="text-text-sub">
          Website:{" "}
          <a
            className="text-primary hover:text-accent font-medium transition-colors"
            href="https://doctorshahalam.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            doctorshahalam.com
          </a>
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className="text-center pt-4">
        
        <blockquote className="text-lg md:text-xl text-text-main dark:text-white italic leading-relaxed max-w-2xl mx-auto mb-4">
          &quot;Your trust is important to us. We are committed to protecting
          your personal information and maintaining the confidentiality of your
          healthcare journey.&quot;
        </blockquote>
        <p className="font-handwriting text-xl font-bold text-primary italic">
          — Dr. Shah Alam
        </p>
      </ScrollReveal>
    </div>
  );
}

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

const cardClass =
  'bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-10';

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-text-sub">
      <span className="text-accent shrink-0 font-bold">✔</span>
      <span>{children}</span>
    </li>
  );
}

export default function TermsContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg dark:prose-invert max-w-none text-text-main dark:text-gray-300">
        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">1. Medical Information Disclaimer</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Educational Information Only</p>
          <p className="text-text-sub mb-4">
            The information provided on this website is intended for general educational and informational purposes only.
            Content found on this website, including articles, videos, success stories, blog posts, and educational resources, should not be considered medical advice, diagnosis, or treatment.
          </p>
          <p className="font-bold text-text-main dark:text-white mb-3">Important Reminder</p>
          <ul className="space-y-3">
            <ChecklistItem>Always consult a qualified healthcare professional regarding your medical condition.</ChecklistItem>
            <ChecklistItem>Never ignore professional medical advice because of information found on this website.</ChecklistItem>
            <ChecklistItem>Individual treatment recommendations require a proper medical evaluation.</ChecklistItem>
          </ul>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">2. Use of Our Services</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Patient Responsibilities</p>
          <p className="text-text-sub mb-4">By booking a consultation or receiving services from Dr. Shah Alam, you agree to:</p>
          <ul className="space-y-3 mb-6">
            <ChecklistItem>Provide accurate and complete personal and medical information.</ChecklistItem>
            <ChecklistItem>Inform us of any significant changes in your medical condition.</ChecklistItem>
            <ChecklistItem>Follow treatment recommendations and safety instructions.</ChecklistItem>
            <ChecklistItem>Attend scheduled appointments or provide notice if unable to attend.</ChecklistItem>
          </ul>
          <p className="font-bold text-text-main dark:text-white mb-3">Right To Refuse Service</p>
          <p className="text-text-sub">
            Dr. Shah Alam reserves the right to decline or discontinue services when medically appropriate, unsafe, or outside the scope of practice.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">3. Appointment Policy</h2>
          <div className="space-y-5 text-text-sub">
            <div>
              <p className="font-bold text-text-main dark:text-white mb-2">Booking Appointments</p>
              <p className="mb-2">Appointments may be scheduled through our website, WhatsApp, phone, or clinic staff.</p>
              <p>Submitting an appointment request does not guarantee a confirmed appointment until confirmation has been provided by our team.</p>
            </div>
            <div>
              <p className="font-bold text-text-main dark:text-white mb-2">Cancellation &amp; Rescheduling</p>
              <p className="mb-2">We kindly request advance notice if you need to cancel or reschedule your appointment.</p>
              <p>This helps us accommodate other patients who may be waiting for care.</p>
            </div>
            <div>
              <p className="font-bold text-text-main dark:text-white mb-2">Late Arrivals</p>
              <p>Patients arriving significantly late may need to wait, shorten their consultation, or reschedule depending on clinic availability.</p>
            </div>
            <div>
              <p className="font-bold text-text-main dark:text-white mb-2">Missed Appointments</p>
              <p>Repeated missed appointments without notice may affect future scheduling priority.</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">4. Online Consultations</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Limitations Of Virtual Care</p>
          <p className="text-text-sub mb-4">Online consultations may be available for selected conditions. However:</p>
          <ul className="space-y-3 mb-4">
            <ChecklistItem>Physical examination limitations exist.</ChecklistItem>
            <ChecklistItem>Certain conditions may require in-person evaluation.</ChecklistItem>
            <ChecklistItem>Emergency conditions should never rely solely on online consultation.</ChecklistItem>
          </ul>
          <p className="text-text-sub">The treating physician may recommend an in-person visit whenever necessary.</p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">5. Privacy &amp; Data Protection</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Protection Of Personal Information</p>
          <p className="text-text-sub mb-4">
            We are committed to protecting your privacy and maintaining the confidentiality of your personal and medical information.
            Information collected through our website or clinic is handled according to our Privacy Policy and applicable healthcare regulations.
          </p>
          <p className="text-text-sub">
            For more details, please review our{' '}
            <Link className="text-primary hover:text-accent font-medium transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">6. Intellectual Property</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Ownership Of Website Content</p>
          <p className="text-text-sub mb-4">All content on this website, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
            <li>Text</li>
            <li>Images</li>
            <li>Graphics</li>
            <li>Logos</li>
            <li>Videos</li>
            <li>Educational Materials</li>
            <li>Blog Articles</li>
            <li>Course Materials</li>
          </ul>
          <p className="text-text-sub mb-4">is the intellectual property of Dr. Shah Alam unless otherwise stated.</p>
          <p className="text-text-sub">
            No content may be copied, reproduced, distributed, modified, or used commercially without prior written permission.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">7. Success Stories &amp; Testimonials</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Individual Results May Vary</p>
          <p className="text-text-sub mb-4">
            Patient testimonials and success stories represent individual experiences.
            Recovery outcomes depend on multiple factors, including:
          </p>
          <ul className="space-y-3 mb-4">
            <ChecklistItem>Diagnosis</ChecklistItem>
            <ChecklistItem>Severity of condition</ChecklistItem>
            <ChecklistItem>Patient compliance</ChecklistItem>
            <ChecklistItem>Lifestyle factors</ChecklistItem>
            <ChecklistItem>Overall health status</ChecklistItem>
          </ul>
          <p className="text-text-sub">Testimonials should not be interpreted as guarantees of specific results.</p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">8. Limitation of Liability</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Website Use At Your Own Risk</p>
          <p className="text-text-sub mb-4">
            While every effort is made to provide accurate and current information, Dr. Shah Alam makes no guarantees regarding the completeness, accuracy, or applicability of website content.
          </p>
          <p className="text-text-sub">
            Dr. Shah Alam shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or reliance upon its content.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">9. External Links</h2>
          <p className="text-text-sub mb-4">
            This website may contain links to third-party websites for educational or informational purposes.
            We are not responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
            <li>Third-party content</li>
            <li>Privacy practices</li>
            <li>Website availability</li>
            <li>Services provided by external websites</li>
          </ul>
          <p className="text-text-sub">Users access third-party websites at their own discretion.</p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">10. Emergency Medical Conditions</h2>
          <p className="font-bold text-text-main dark:text-white mb-3">Do Not Use This Website For Emergencies</p>
          <p className="text-text-sub mb-4">If you experience:</p>
          <ul className="space-y-3 mb-4">
            <ChecklistItem>Severe chest pain</ChecklistItem>
            <ChecklistItem>Sudden weakness</ChecklistItem>
            <ChecklistItem>Loss of bladder or bowel control</ChecklistItem>
            <ChecklistItem>Difficulty breathing</ChecklistItem>
            <ChecklistItem>Severe injury</ChecklistItem>
            <ChecklistItem>Any life-threatening condition</ChecklistItem>
          </ul>
          <p className="text-text-sub">
            Please contact emergency services or visit the nearest emergency department immediately.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">11. Modifications to Terms</h2>
          <p className="text-text-sub mb-4">
            We reserve the right to update, modify, or replace these Terms &amp; Conditions at any time.
          </p>
          <p className="text-text-sub mb-4">
            Changes become effective immediately upon publication on this website.
          </p>
          <p className="text-text-sub">
            Continued use of the website constitutes acceptance of any revised terms.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className={cardClass}>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">12. Governing Law</h2>
          <p className="text-text-sub mb-4">
            These Terms &amp; Conditions shall be governed and interpreted in accordance with the laws of Bangladesh.
          </p>
          <p className="text-text-sub">
            Any disputes arising from the use of this website or services shall be subject to the jurisdiction of the courts of Bangladesh.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">13. Contact Information</h2>
          <p className="font-bold text-text-main dark:text-white mb-4">Questions About These Terms?</p>
          <p className="text-text-sub mb-4">
            If you have questions regarding these Terms &amp; Conditions, please contact us:
          </p>
          <p className="font-bold text-text-main dark:text-white mb-2">Dr. Shah Alam</p>
          <p className="text-text-sub mb-1">
            49, Mohakhali, Beside Square Centre, Wireless Gate, Mohakhali, Dhaka 1212, Bangladesh
          </p>
          <p className="text-text-sub mb-1">
            Phone:{' '}
            <a className="text-primary hover:text-accent font-medium transition-colors" href="tel:+8801701313002">
              +880 1701313002
            </a>
          </p>
          <p className="text-text-sub mb-1">
            Email:{' '}
            <a className="text-primary hover:text-accent font-medium transition-colors" href="mailto:contact@doctorshahalam.com">
              contact@doctorshahalam.com
            </a>
          </p>
          <p className="text-text-sub">
            Website:{' '}
            <a className="text-primary hover:text-accent font-medium transition-colors" href="https://doctorshahalam.com" target="_blank" rel="noopener noreferrer">
              doctorshahalam.com
            </a>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

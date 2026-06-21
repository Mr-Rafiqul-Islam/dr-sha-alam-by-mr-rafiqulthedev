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

function CrossItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-text-sub">
      <span className="text-red-500 shrink-0 font-bold">❌</span>
      <span>{children}</span>
    </li>
  );
}

export default function MedicalDisclaimerSections() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-text-main dark:text-gray-300">
      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">No Doctor–Patient Relationship</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Website Use Does Not Create A Medical Relationship</p>
        <p className="text-text-sub mb-4">
          Accessing this website, reading articles, watching videos, downloading resources, or contacting us through online forms does not establish a doctor–patient relationship.
        </p>
        <p className="text-text-sub">
          A formal doctor–patient relationship begins only after an official consultation and acceptance of care.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">No Medical Advice</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Educational Content Only</p>
        <p className="text-text-sub mb-4">All website content, including:</p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
          <li>Articles</li>
          <li>Blog Posts</li>
          <li>Videos</li>
          <li>Success Stories</li>
          <li>Patient Guides</li>
          <li>FAQs</li>
          <li>Social Media Content</li>
          <li>Educational Resources</li>
        </ul>
        <p className="text-text-sub mb-4">is intended solely for general education. This information should not be interpreted as:</p>
        <ul className="space-y-3 mb-4">
          <CrossItem>Personal medical advice</CrossItem>
          <CrossItem>Diagnosis</CrossItem>
          <CrossItem>Treatment recommendations</CrossItem>
          <CrossItem>Emergency medical guidance</CrossItem>
        </ul>
        <p className="text-text-sub">
          Always consult your physician or healthcare provider regarding any medical condition.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Emergency Medical Conditions</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Do Not Delay Emergency Care</p>
        <p className="text-text-sub mb-4">If you experience any of the following:</p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
          <li>Sudden loss of bladder or bowel control</li>
          <li>Severe weakness in the legs or arms</li>
          <li>Difficulty breathing</li>
          <li>Severe chest pain</li>
          <li>Stroke-like symptoms</li>
          <li>Major injury or trauma</li>
          <li>Any life-threatening condition</li>
        </ul>
        <p className="text-text-sub mb-4">
          Please contact emergency medical services or visit the nearest emergency department immediately.
        </p>
        <p className="text-text-sub">
          This website should never be used as a substitute for emergency medical care.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Website Content Accuracy</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Medical Knowledge Continuously Evolves</p>
        <p className="text-text-sub mb-4">
          We strive to provide accurate, up-to-date, and evidence-based information. However:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
          <li>Medical knowledge changes over time.</li>
          <li>Research findings may evolve.</li>
          <li>Treatment recommendations may differ between individuals.</li>
        </ul>
        <p className="text-text-sub mb-4">
          Therefore, we cannot guarantee that all information on this website will always be complete, current, or applicable to every situation.
        </p>
        <p className="text-text-sub">
          Users are encouraged to verify information through professional consultation.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Individual Results May Vary</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Every Recovery Journey Is Different</p>
        <p className="text-text-sub mb-4">
          The information shared on this website reflects general principles and educational content.
          Recovery outcomes depend on numerous factors, including:
        </p>
        <ul className="space-y-3 mb-4">
          <ChecklistItem>Diagnosis</ChecklistItem>
          <ChecklistItem>Severity of condition</ChecklistItem>
          <ChecklistItem>Overall health</ChecklistItem>
          <ChecklistItem>Patient compliance</ChecklistItem>
          <ChecklistItem>Lifestyle factors</ChecklistItem>
          <ChecklistItem>Response to treatment</ChecklistItem>
        </ul>
        <p className="text-text-sub">
          Results achieved by one patient may not necessarily be achieved by another.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Testimonials &amp; Success Stories</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Real Experiences, Not Guaranteed Results</p>
        <p className="text-text-sub mb-4">
          Patient testimonials, reviews, and success stories shared on this website represent individual experiences.
        </p>
        <p className="text-text-sub">
          These stories are intended to provide insight into patient experiences and should not be interpreted as promises, guarantees, or predictions of future outcomes.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">External Links</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Third-Party Websites</p>
        <p className="text-text-sub mb-4">
          Our website may contain links to external websites for educational purposes.
          We do not control and are not responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
          <li>Content accuracy</li>
          <li>Privacy practices</li>
          <li>Services provided</li>
          <li>Security standards</li>
        </ul>
        <p className="text-text-sub">
          of third-party websites. Accessing external websites is done at the user&apos;s own discretion.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Exercise &amp; Rehabilitation Disclaimer</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Exercise At Your Own Risk</p>
        <p className="text-text-sub mb-4">
          Any exercise, rehabilitation, stretching, yoga, or movement-related content presented on this website is intended for general educational purposes.
        </p>
        <p className="text-text-sub mb-4">
          Not every exercise is suitable for every individual. Before beginning any exercise program, consult your physician or qualified healthcare provider.
        </p>
        <p className="text-text-sub mb-4">Stop immediately and seek medical advice if you experience:</p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent">
          <li>Severe pain</li>
          <li>Dizziness</li>
          <li>Weakness</li>
          <li>Numbness</li>
          <li>Loss of balance</li>
          <li>Worsening symptoms</li>
        </ul>
      </ScrollReveal>

      <ScrollReveal direction="up" className={cardClass}>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Limitation of Liability</h2>
        <p className="font-bold text-text-main dark:text-white mb-3">Use Of This Website Is At Your Own Risk</p>
        <p className="text-text-sub mb-4">
          Dr. Shah Alam and affiliated parties shall not be liable for any loss, injury, or damages arising from:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-text-sub marker:text-accent mb-4">
          <li>Use of website content</li>
          <li>Reliance upon educational information</li>
          <li>Delayed medical treatment</li>
          <li>Self-diagnosis</li>
          <li>Self-treatment decisions</li>
        </ul>
        <p className="text-text-sub">
          Users assume full responsibility for how they use information obtained from this website.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className="bg-primary/5 p-8 rounded-3xl border border-primary/10 mb-10">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-4 mt-0">Contact Information</h2>
        <p className="font-bold text-text-main dark:text-white mb-4">Questions About This Disclaimer?</p>
        <p className="text-text-sub mb-4">
          If you have any questions regarding this Medical Disclaimer, please contact us:
        </p>
        <p className="font-bold text-text-main dark:text-white mb-2">Dr. Shah Alam</p>
        <p className="text-text-sub mb-1">49, Mohakhali, Beside Square Centre, Wireless Gate, Mohakhali, Dhaka 1212, Bangladesh</p>
        <p className="text-text-sub mb-1">
          Phone:{' '}
          <a className="text-primary hover:text-accent font-medium transition-colors" href="tel:+8801701313001">
            +880 1701313001
          </a>
        </p>
        <p className="text-text-sub mb-1">
          Email:{' '}
          <a className="text-primary hover:text-accent font-medium transition-colors" href="mailto:info@doctorshahalam.com">
            info@doctorshahalam.com
          </a>
        </p>
        <p className="text-text-sub">
          Website:{' '}
          <a className="text-primary hover:text-accent font-medium transition-colors" href="https://doctorshahalam.com" target="_blank" rel="noopener noreferrer">
            doctorshahalam.com
          </a>
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" className="text-center pt-4">
        <h4 className="text-2xl font-bold text-primary dark:text-white mb-4">Our Commitment</h4>
        <blockquote className="text-lg md:text-xl text-text-main dark:text-white italic leading-relaxed max-w-3xl mx-auto mb-4">
          We are committed to providing reliable health education, evidence-based information, and patient-centered guidance.
          However, nothing on this website should replace personalized medical evaluation, diagnosis, or treatment from a qualified healthcare professional.
          <br /> <strong>Your health decisions should always be made in consultation with a licensed medical professional.</strong>
        </blockquote>
    </ScrollReveal>
    </div>
  );
}

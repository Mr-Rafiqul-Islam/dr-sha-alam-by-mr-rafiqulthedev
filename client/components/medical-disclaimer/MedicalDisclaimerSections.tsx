import ScrollReveal from '@/components/ScrollReveal';

export default function MedicalDisclaimerSections() {
  const sections = [
    {
      icon: 'medical_services',
      title: 'No Medical Advice',
      content: 'The content on <strong>Dr. Shah Alam\'s</strong> website, including text, graphics, images, and other material contained on the website ("Content"), is for informational purposes only. No material on this site is intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or treatment and before undertaking a new health care regimen, and never disregard professional medical advice or delay in seeking it because of something you have read on this website.'
    },
    {
      icon: 'emergency',
      title: 'Medical Emergencies',
      content: 'If you think you may have a medical emergency, call your doctor, go to the nearest hospital emergency department, or call the emergency services immediately. Dr. Shah Alam does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on the website. Reliance on any information provided by this website is solely at your own risk.'
    },
    {
      icon: 'health_and_safety',
      title: 'Website Content Accuracy',
      content: 'While we strive to keep the information on this website current and accurate, medical knowledge changes quickly. Therefore, some information may be out of date. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.'
    },
    {
      icon: 'record_voice_over',
      title: 'Testimonials and Success Stories',
      content: 'The testimonials and success stories found on this website are from actual patients of Dr. Shah Alam. However, these are individual results and results may vary. We do not claim that they are typical results that consumers will generally achieve. The testimonials are not necessarily representative of all of those who will use our products and/or services.'
    },
    {
      icon: 'link',
      title: 'External Links',
      content: 'This website may contain links to other websites which are not under the control of Dr. Shah Alam. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.'
    }
  ];

  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <ScrollReveal key={index} direction="up" delay={index * 0.1}>
          <section>
            <h3 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined">{section.icon}</span>
              {section.title}
            </h3>
            <p className="text-text-sub leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
          </section>
        </ScrollReveal>
      ))}
    </div>
  );
}

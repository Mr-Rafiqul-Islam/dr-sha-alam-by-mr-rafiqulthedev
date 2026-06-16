import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/doctorshahalam",
      iconClass: "fab fa-facebook-f",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/c/DoctorShahAlam",
      iconClass: "fab fa-youtube",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@doctorshahalam",
      iconClass: "fab fa-tiktok",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/doctorshahalam",
      iconClass: "fab fa-linkedin-in",
    },
  ];
  return (
    <footer className="bg-footer-bg text-gray-300 pt-20 pb-12 border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 mb-16">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-in-dark.png"
                alt="Dr. Shah Alam"
                width={180}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="space-y-3 pt-2">
              <p className="text-gray-400 text-sm leading-relaxed">
              49, Mohakhali, Beside Square Centre, Wireless Gate, Mohakhali, Dhaka 1212, Bangladesh
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Chamber Time: Sat—Thu, 9AM—7PM
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Phone: +880 1701313001
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                WhatsApp: +880 1312353577
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Email: contact@doctorshahalam.com
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors text-white"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <i className={`${social.iconClass} text-sm`}></i>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/treatments"
                >
                  Treatments
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/success-stories"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="https://yogawithdoctor.com/courses"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/appointment"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/patient-guidelines"
                >
                  Patient Guidelines
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/before-visit-instructions"
                >
                  Before Visit Instructions
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/after-treatment-instructions"
                >
                  After Treatment Instructions
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/terms-conditions"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  href="/medical-disclaimer"
                >
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex justify-center">
          <p className="text-gray-500 text-sm text-center">
            © {currentYear} Doctor Shah Alam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

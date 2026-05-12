import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-footer-bg text-gray-300 pt-20 pb-12 border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-lg font-bold">
                D
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white leading-none">
                  Dr. Shah Alam
                </h2>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-gray-400 text-sm leading-relaxed">
                House 42, Road 7, Sector 3 Uttara, Dhaka - 1230, Bangladesh
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Chamber Time: Sat—Thu, 9AM—5PM
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
              <Link
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors text-white"
                href="https://www.facebook.com/doctorshahalam/"
                target="_blank"
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </Link>
              <Link
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors text-white"
                href="#"
              >
                <i className="fab fa-instagram text-sm"></i>
              </Link>
              <Link
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors text-white"
                href="#"
              >
                <i className="fab fa-youtube text-sm"></i>
              </Link>
              <Link
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent transition-colors text-white"
                href="#"
              >
                <i className="fab fa-twitter text-sm"></i>
              </Link>
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
                  href="/book"
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

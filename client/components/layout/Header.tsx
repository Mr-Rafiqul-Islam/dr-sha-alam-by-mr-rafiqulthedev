"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: "Home", href: "/", target: "_self" },
    { name: "Treatments", href: "/treatments", target: "_self" },
    { name: "Success Stories", href: "/success-stories", target: "_self" },
    { name: "Blog", href: "/blog", target: "_self" },
    { name: "Courses", href: "https://yogawithdoctor.com/courses", target: "_blank" },
    { name: "About", href: "/about", target: "_self" },
    { name: "Contact", href: "/contact", target: "_self" },
  ];

  return (
    <header className="sticky-header w-full transition-all duration-300 border-b border-gray-100 dark:border-gray-800 relative z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Dr. Shah Alam"
              width={180}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href.split("#")[0]) &&
                  link.href.split("#")[0] !== "/");
              return (
                <Link
                  key={link.name}
                  className={`text-sm xl:text-base font-medium transition-colors ${isActive ? "text-primary dark:text-accent" : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-accent"}`}
                  href={link.href}
                  target={link.target}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Book Button */}
          <div className="hidden lg:flex flex-shrink-0">
            <Link
              href="/appointment"
              className="bg-[#00CBC0] hover:bg-accent-dark text-white text-sm xl:text-base font-bold py-3 px-6 xl:px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="text-text-main dark:text-white p-2 focus:outline-none"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shadow-xl absolute top-full left-0 w-full"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" &&
                    pathname.startsWith(link.href.split("#")[0]) &&
                    link.href.split("#")[0] !== "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target={link.target}
                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                    onClick={closeMenu}
                    className={`text-lg font-bold transition-colors ${isActive ? "text-primary dark:text-accent" : "text-text-main dark:text-white hover:text-primary dark:hover:text-accent"}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href="/appointment"
                  onClick={closeMenu}
                  className="flex justify-center w-full bg-[#00CBC0] hover:bg-accent-dark text-white text-lg font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-md"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import { AiOutlineClose, AiOutlineExport } from "react-icons/ai";

export default function Navbar({ menu }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:block">
        <ul className="flex gap-3 items-center">
          {menu?.map((item, index) => (
            <li
              key={index}
              className={`px-4 font-bold duration-300 ease-linear cursor-pointer ${
                pathname === item.link
                  ? "text-secondary"
                  : "text-black hover:text-secondary"
              }`}
            >
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className={`lg:hidden text-3xl cursor-pointer transition-colors duration-300 ease-linear text-black hover:text-primary`}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <AiOutlineClose /> : <HiMenu />}
      </button>

      {/* Mobile Dropdown */}
      <div
        className={`fixed inset-0 bg-primary/10 transition-opacity duration-300 lg:hidden z-40 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out pl-5 pt-5 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-black hover:text-primary transition-colors duration-300 ease-linear text-3xl cursor-pointer"
            aria-label="Toggle menu"
          >
            <AiOutlineClose />
          </button>

          <ul className="flex flex-col gap-3 mt-3">
            {menu?.map((item, index) => (
              <li
                key={index}
                onClick={toggleMobileMenu}
                className={`font-bold duration-300 ease-linear cursor-pointer py-2 border-b border-gray-200 ${
                  pathname === item.link ? "text-primary" : "text-black"
                }`}
              >
                <Link href={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <Link
              href="/appointment"
              className="flex items-center gap-3 bg-black hover:bg-primary/90 transition-colors duration-500 ease-linear text-white font-medium py-2 px-4 rounded-md cursor-pointer"
            >
              Book Appointment
              <AiOutlineExport size={22} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

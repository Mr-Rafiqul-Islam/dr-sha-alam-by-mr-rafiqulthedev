import Image from "next/image";
import Link from "next/link";
import { AiOutlineExport } from "react-icons/ai";
import HeartIcon from "@/app/assets/heart.png";
import { HeaderFooterMenu } from "@/constrain/data";
import Navbar from "./Navbar";
import Logo from "@/app/assets/logo.png";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-linear bg-white shadow-md">
      <div className="py-5 relative">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="flex justify-between items-center">
            {/* logo */}
            <div className="">
              <Link href="/">
                <Image src={Logo} alt="heart" width={150} height={150} />
              </Link>
            </div>

            {/* Navbar (client component handles active + scroll logic) */}
            <Navbar menu={HeaderFooterMenu} />

            {/* Desktop Button */}
            <div className="hidden lg:block">
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
      </div>
    </header>
  );
}

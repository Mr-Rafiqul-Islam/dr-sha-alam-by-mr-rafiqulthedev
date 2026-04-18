import { HeaderFooterMenu, IconsList, NewsData } from "@/constrain/data";
import Logo from "@/app/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { IoIosCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

export default function Footer() {
  const recentPost = NewsData.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <footer className="bg-tertiary/90 py-3">
      {/* footer top */}
      <div className="container mx-auto px-4 lg:px-0">
        <div className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center space-y-4 md:space-y-0">
            {/* left */}
            <div className="flex flex-col gap-[30px]">
              <div className="">
                <Link href="/">
                  <Image
                    src={Logo}
                    alt="heart"
                    width={300}
                    height={300}
                  /> 
                </Link>
              </div>
              {/* contact info */}
              <div className="">
                <p className="flex gap-2 items-center text-base md:text-lg text-white">
                  <FaLocationDot className="size-6" /> Address: 123 Main Street,
                  City
                </p>
                <p className="flex gap-2 items-center text-base md:text-lg text-white">
                  <IoIosCall className="size-6" /> Call Us: +880 1234 5678
                </p>
              </div>
              {/* icon list */}
              <ul className="flex gap-[30px]">
                {IconsList &&
                  IconsList.map((item, index) => (
                    <Link
                      href={item.link}
                      key={index}
                      className="text-2xl text-white hover:text-tertiary duration-200 ease-linear cursor-pointer"
                    >
                      {item.icon}
                    </Link>
                  ))}
              </ul>
            </div>

            {/* center */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Menu</h3>
              {/* menu list */}
              <ul className="flex flex-col gap-3">
                {HeaderFooterMenu &&
                  HeaderFooterMenu.map((item, index) => (
                    <li
                      key={index}
                      className="text-white text-base sm:text-lg md:text-xl hover:text-tertiary duration-300 ease-linear cursor-pointer"
                    >
                      <Link href={item.link}>{item.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* right */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">News</h3>
              {/* news list */}
              <ul className="flex flex-col gap-3">
                {recentPost &&
                  recentPost.map((item, index) => (
                    <li
                      key={index}
                      className="text-white text-base sm:text-lg md:text-xl hover:text-tertiary duration-300 ease-linear cursor-pointer flex gap-5 items-center border-b border-tertiary pb-2 last:border-0 last:pb-0"
                    >
                      <Image
                        src={item.image}
                        alt="news"
                        width={50}
                        height={41}
                        className="rounded-lg"
                        style={{ height: "auto" }}
                      />
                      <div className="">
                        <Link href={`/news/details/${item.id}`}>
                          {item.title}
                        </Link>
                        <span className="flex gap-2 items-center ml-auto mt-2">
                          <FaCalendarAlt className="size-6" />
                          {item.date}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* footer bottom */}
      <div className="border-t border-tertiary">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 justify-between items-center mt-6 space-y-4 md:space-y-0 px-4 md:px-0">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Dr Sha Alam. All rights reserved.
          </p>
          <div className="flex lg:gap-[30px] items-center lg:justify-end-safe">
            <Link href={"/"} className="text-white">
              Privacy Policy
            </Link>
            <Link href={"/"} className="text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { TfiLayoutLineSolid } from "react-icons/tfi";
import { FaCalendarAlt } from "react-icons/fa";
import { NewsData } from "@/constrain/data";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

export default function News() {
  const featuredNews = NewsData.filter((item) => item.isFeatured === true);

  const FeaturedNews = featuredNews.reduce((acc, item, index) => {
    const key = `news${index + 1}`;
    acc[key] = item;
    return acc;
  }, {});

  const { news1, news2, news3, news4 } = FeaturedNews;

  return (
    <section className="bg-gray-100 py-9 md:py-16" id="news">
      <div className="container mx-auto px-4 lg:px-0">
        {/* section heading */}
        <SectionHeading
          subtitle="HealthTips"
          title="Our Latest Health News & Expert Advice"
          sectionClass="space-y-2 mb-2 sm:mb-4 md:mb-6 lg:mb-10"
        />

        {/* responsive grid */}
        <div
          className="grid grid-cols-1 
            sm:grid-cols-2 lg:grid-cols-10 auto-rows-[minmax(200px,auto)]
            gap-4 md:h-auto lg:h-[750px]
          "
        >
          {/* news1 */}
          <div
            className="
            md:col-span-full lg:col-span-4 lg:row-span-3 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-5 md:p-10
            "
          >
            <div className="relative rounded-lg h-[220px] sm:h-[300px] md:h-[350px] mb-5 md:mb-8">
              <Image
                src={news1?.image || ""}
                alt={news1?.title || ""}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                loading="lazy"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-tertiary text-sm mb-3">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="w-4 h-4" />
                {news1?.date}
              </span>
              <span className="px-2 border border-accent text-tertiary rounded-full">
                {news1?.category}
              </span>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-3">
              {news1?.title}
            </h3>
            <p className="text-gray-600 text-base md:text-lg mb-3">
              {news1?.shortDesc}
            </p>
            <Link
              href={`/news/details/${news1?.slug}`}
              className="px-3 py-2 bg-primary text-white hover:text-black hover:bg-accent rounded-lg transition-colors duration-200"
            >
              Read More
            </Link>
          </div>

          {/* news2 */}
          <Link
            href={`/news/details/${news2?.id}`}
            className="sm:col-span-2 lg:col-span-6 lg:row-span-1 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-5 grid md:grid-cols-2 gap-4
            "
          >
            <div className="relative rounded-lg h-[200px] md:h-[250px]">
              <Image
                src={news2?.image || ""}
                alt={news2?.title || ""}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                loading="lazy"
              />
            </div>
            <div>
              <span className="flex items-center gap-1.5 px-2 border border-accent text-tertiary rounded-full w-fit mb-2">
                {news2?.category}
              </span>
              <h3 className="font-bold text-lg lg:text-2xl mb-2">
                {news2?.title}
              </h3>
              <p className="text-gray-600 text-base lg:text-lg mb-3">
                {news2?.shortDesc?.slice(0, 60)}...
              </p>
            </div>
          </Link>

          {/* news3 */}
          <Link
            href={`/news/details/${news3?.id}`}
            className="sm:col-span-1 lg:col-span-3 lg:row-span-2 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-5
            "
          >
            <div className="relative rounded-lg h-[200px] md:h-[180px] mb-5">
              <Image
                src={news3?.image || ""}
                alt={news3?.title || ""}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                loading="lazy"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-tertiary text-sm mb-3">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="w-4 h-4" />
                {news3?.date}
              </span>
              <span className="px-2 border border-accent text-tertiary rounded-full">
                {news3?.category}
              </span>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-2">
              {news3?.title}
            </h3>
            <p className="text-gray-600 text-base md:text-lg mb-3">
              {news3?.shortDesc}
            </p>
          </Link>

          {/* news4 */}
          <Link
            href={`/news/details/${news4?.id}`}
            className="sm:col-span-1 lg:col-span-3 lg:row-span-2 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 p-5
            "
          >
            <div className="relative rounded-lg h-[200px] md:h-[180px] mb-5">
              <Image
                src={news4?.image || ""}
                alt={news4?.title || ""}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                loading="lazy"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-tertiary text-sm mb-3">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="w-4 h-4" />
                {news4?.date}
              </span>
              <span className="px-2 border border-accent text-tertiary rounded-full">
                {news4?.category}
              </span>
            </div>
            <h3 className="font-bold text-xl md:text-2xl mb-2">
              {news4?.title}
            </h3>
            <p className="text-gray-600 text-base md:text-lg mb-3">
              {news4?.shortDesc}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

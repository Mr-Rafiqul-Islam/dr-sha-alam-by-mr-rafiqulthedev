import Image from "next/image";
import { CiCalendar, CiUser, CiHeart} from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";

import Link from "next/link";

export default function NewsCard({
  image,
  title,
  desc,
  date,
  author,
  views,
  likes,
  slug,
}) {


  const Desc = desc.length > 200 ? `${desc.slice(0, 200)}...` : desc

  return (
    <div href={`/news/details/${slug}`} className="flex flex-col justify-start">
      <div className="relative w-full h-[300px]">
        <Image
          src={image || ""}
          alt={title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 300px, 500px"
        />
      </div>
      <div className="flex gap-6 mt-6 mb-2 flex-wrap">
        <div className="flex gap-2">
          <CiCalendar className="text-primary" />
          <span>{date}</span>
        </div>
        <div className="flex gap-2">
          <CiUser className="text-secondary" />
          <span>{author}</span>
        </div>
        <div className="flex gap-2">
          <IoEyeOutline className="text-primary" />
          <span>{views}</span>
        </div>
        <div className="flex gap-2">
          <CiHeart className="text-red-400" />
          <span>{likes}</span>
        </div>
      </div>
      <div className="mb-6">
        <h6 className="text-xl md:text-2xl lg:text-3xl font-medium text-primary mb-4">
          {title}
        </h6>
        <p className="text-sm md:text-lg text-black">{Desc}</p>
      </div>
      <Link
        href={`/news/details/${slug}`}
        className="px-[26px] py-[13px] text-primary bg-accent hover:text-accent hover:bg-primary transition-colors duration-300 ease-in flex items-center gap-2 rounded-[50px] justify-center w-fit"
      >
        Read More <IoIosArrowRoundForward />
      </Link>
    </div>
  );
}

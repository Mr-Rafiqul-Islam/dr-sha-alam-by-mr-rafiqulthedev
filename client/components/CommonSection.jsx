import Image from "next/image";
import { TfiLayoutLineSolid } from "react-icons/tfi";

export default function CommonSection({ data, className, id, style = 1 }) {
  return (
    <section id={id} className={className}>
      <div className="container mx-auto px-4 lg:px-0">
        <div className="mx-auto">
          <h2 className="text-base md:text-3xl font-extrabold leading-tight text-gray-900 flex gap-2 items-center mb-3 md:mb-5">
            {data?.title} <TfiLayoutLineSolid />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center items-center">
          <div
            className={`${style === 2 ? "order-2" : "order-1"} relative w-full h-[400px] rounded-lg`}
          >
            <Image
              src={data?.banner || ""}
              alt={data?.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 550px) 100vw, 50vw"
              quality={75}
              loading="lazy"
            />
          </div>
          <div className={`${style === 2 ? "order-1" : "order-2"}`}>
            <ul className="flex flex-col gap-8">
              {data?.data.map((item, index) => (
                <li
                  key={index}
                  className="border-b border-tertiary last:border-b-0 text-sm sm:text-base md:text-lg text-tertiary font-base pb-2"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import Star from "@/components/icons/Star";
import Image from "next/image";

export default function ReviewCard({ name, address, comment, ratting, image }) {
  return (
    <div className="px-4 py-[30px] bg-white rounded-xl">
      <div className="">
        {/* card top */}
        <div className="flex flex-col md:flex-row gap-2 mb-6">
            {/* image */}
            <div className="mx-auto md:mx-0">
              <Image src={image} alt="avatar" width={100} height={80} />
            </div>

          <div className="flex justify-between items-center">
            {/* name and ratting */}
            <div className="">
              <h3 className="text-[20px] font-bold font-mono">{name}</h3>
              <p className="text-tertiary font-sans font-semibold">{address}</p>
            </div>
            <div className="flex gap-2">
              <Star className="text-tertiary w-6 h-6" />
              <p className="text-tertiary font-semibold font-mono text-sm md:text-lg">
                {ratting}
              </p>
            </div>
          </div>
        </div>

        {/* card bottom */}
        <div className="text-sm md:text-lg text-secondary font-sans">
          <p>{comment}</p>
        </div>
      </div>
    </div>
  );
}

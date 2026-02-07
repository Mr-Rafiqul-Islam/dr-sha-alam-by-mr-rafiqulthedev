"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function Card({
  title,
  desc,
  onClick,
  image,
  imageClass,
  progressPercentage,
  ...props
}) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (progressPercentage) {
      // Animate circle fill
      const progressOffset =
        circumference - (progressPercentage / 100) * circumference;
      setOffset(progressOffset);

      // Animate number counter
      let start = 0;
      const duration = 1500; // match CSS animation duration (1.5s)
      const increment = progressPercentage / (duration / 20); // update every 20ms

      const counterInterval = setInterval(() => {
        start += increment;
        if (start >= progressPercentage) {
          start = progressPercentage;
          clearInterval(counterInterval);
        }
        setDisplayPercent(Math.floor(start));
      }, 20);

      return () => clearInterval(counterInterval);
    }
  }, [progressPercentage, circumference]);

  return (
    <div
      className="h-[300px] group rounded-lg flex flex-col items-center cursor-pointer text-center duration-300 ease-linear relative overflow-hidden"
      onClick={onClick}
      {...props}
    >
      <div className="w-full h-full relative">
        <Image
          src={image || ""}
          alt={title}
          fill
          className={`object-cover ${imageClass}`}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
          loading="lazy"
        />
      </div>

      <div className="absolute w-4/5 bottom-0 left-0 bg-white rounded-tr-lg p-2 transition-all duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-bold font-mono text-black group-hover:text-black my-5">
            {title}
          </h3>

          {progressPercentage ? (
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full absolute top-0 left-0 -rotate-90"
                viewBox="0 0 80 80"
                style={{
                  "--offset": offset,
                }}
              >
                <defs>
                  <linearGradient id="GradientColor">
                    <stop offset="0%" stopColor="#DA22FF" />
                    <stop offset="100%" stopColor="#9733EE" />
                  </linearGradient>
                </defs>

                {/* Background track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#eee"
                  strokeWidth="15"
                  fill="none"
                />

                {/* Animated progress circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  strokeLinecap="round"
                  fill="none"
                  stroke="url(#GradientColor)"
                  strokeWidth="15"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  className="animate-progress"
                />
              </svg>

              <div className="w-full h-full rounded-full flex items-center justify-center outerShadow">
                <div className="w-16 h-16 rounded-full shadow-sm innerShadow flex items-center justify-center bg-white">
                  <div className="text-tertiary text-sm font-bold">
                    {displayPercent}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <FaArrowRight className="text-2xl rotate-[-45deg]" />
            </div>
          )}
        </div>

        <p className="text-secondary text-sm group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
          {desc}
        </p>
      </div>
    </div>
  );
}

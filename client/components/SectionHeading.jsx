import { TfiLayoutLineSolid } from "react-icons/tfi";

export default function SectionHeading({
  title,
  description,
  subtitle,
  title2,
  sectionClass,
}) {
  return (
    <div className={`max-w-3xl ${sectionClass}`}>
      {subtitle && (
        <p className="text-primary font-semibold text-sm flex gap-2 items-center">
          <TfiLayoutLineSolid />{" "}
          <strong >{subtitle}</strong>
        </p>
      )}
      {title2 && <p className="text-primary font-semibold text-sm">{title2}</p>}
      {title && (
        <h1 className="text-base md:text-3xl font-extrabold leading-tight text-gray-900">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-gray-600 mt-2 md:mt-6 text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    icon: "description",
    title: "1. Share Your Information",
    description:
      "Tell us about your symptoms, concerns, and medical history.",
  },
  {
    icon: "support_agent",
    title: "2. Our Team Contacts You",
    description:
      "We confirm your appointment details and answer any questions.",
  },
  {
    icon: "check_circle",
    title: "3. Receive Confirmation",
    description:
      "Get your confirmed consultation date, time, and visit instructions.",
  },
  {
    icon: "medical_services",
    title: "4. Meet Dr. Shah Alam",
    description:
      "Receive a personalized evaluation and treatment guidance.",
  },
] as const;

function StepCard({
  icon,
  title,
  description,
  showConnector,
}: {
  icon: string;
  title: string;
  description: string;
  showConnector?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 relative group">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-text-main dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-text-sub">{description}</p>
      {showConnector ? (
        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10" />
      ) : null}
    </div>
  );
}

export default function AppointmentSteps() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const extendedSteps = [...steps, ...steps];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= steps.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  return (
    <>
      <div className="md:hidden overflow-hidden">
        <div
          className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSteps.map((step, index) => (
            <div key={`${step.title}-${index}`} className="w-full shrink-0 px-2">
              <StepCard
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex % steps.length
                  ? "bg-primary w-8"
                  : "bg-gray-300 dark:bg-gray-700 w-2 hover:bg-primary/50"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <StepCard
            key={step.title}
            icon={step.icon}
            title={step.title}
            description={step.description}
            showConnector={index < steps.length - 1}
          />
        ))}
      </div>
    </>
  );
}

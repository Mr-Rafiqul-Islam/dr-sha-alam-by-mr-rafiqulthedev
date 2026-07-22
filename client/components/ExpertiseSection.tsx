"use client";

import Link from "next/link";
import { motion, Variants } from "motion/react";

const treatments = [
  {
    title: "PLID (Lumbar Disc Prolapse)",
    description:
      "Understand your MRI, reduce nerve irritation, and recover safely with a structured treatment plan.",
    icon: "accessibility_new",
  },
  {
    title: "Sciatica & Nerve Compression",
    description:
      "Relieve radiating leg pain, tingling, numbness, and weakness through targeted care.",
    icon: "personal_injury",
  },
  {
    title: "Chronic Back Pain",
    description:
      "Identify the real cause of persistent pain and create a long-term recovery strategy.",
    icon: "healing",
  },
  {
    title: "Neck Pain & Cervical Problems",
    description:
      "Evidence-based treatment for cervical disc issues, neck stiffness, and arm pain.",
    icon: "directions_walk",
  },
  {
    title: "Epidural Steroid Injection",
    description:
      "Advanced non-surgical treatment for selected patients suffering from nerve inflammation.",
    icon: "syringe",
  },
  {
    title: "Spine Surgery Consultation",
    description:
      "Helping patients make confident and informed surgical decisions.",
    icon: "medical_information",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ExpertiseSection() {
  return (
    <section
      className="lg:py-24 py-12 bg-white dark:bg-surface-dark relative"
      id="treatments"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto lg:mb-16 mb-8"
        >
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-4">
            Holistic Care for Your Recovery
          </h3>
          <p className="text-text-sub text-lg">
            We specialize in treating chronic conditions through a unique blend
            of orthopedic science and therapeutic yoga.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {treatments.map((treatment, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-background-light dark:bg-background-dark p-5 rounded-3xl border border-transparent hover:border-accent/20 transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
            >
              <Link href="/treatments">
                <div className="w-12 h-12 bg-white dark:bg-surface-dark rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">
                    {treatment.icon}
                  </span>
                </div>
                <h4 className="text-sm md:text-base font-bold text-text-main dark:text-white mb-3">
                  {treatment.title}
                </h4>
                <p className="text-text-sub text-xs mb-6 leading-relaxed">
                  {treatment.description}
                </p>
                <span className="inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors">
                  Learn more{" "}
                  <span className="material-symbols-outlined text-xs ml-1 transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

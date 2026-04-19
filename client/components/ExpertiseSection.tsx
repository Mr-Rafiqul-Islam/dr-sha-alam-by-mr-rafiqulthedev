'use client';

import Link from 'next/link';
import { motion, Variants } from 'motion/react';

const treatments = [
  {
    title: 'PLID (Disc Prolapse)',
    description: 'Non-surgical spinal decompression and posture correction techniques to heal without knives.',
    icon: 'accessibility_new',
  },
  {
    title: 'Chronic Back Pain',
    description: 'Targeted exercises and ergonomic adjustments to strengthen the spine and reduce inflammation.',
    icon: 'personal_injury',
  },
  {
    title: 'Migraine Relief',
    description: 'Holistic approaches combining manual therapy and relaxation to reduce headache frequency.',
    icon: 'healing',
  },
  {
    title: 'Sciatica & Nerve',
    description: 'Nerve mobilization techniques to alleviate shooting leg pain and restore comfortable movement.',
    icon: 'directions_walk',
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
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export default function ExpertiseSection() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark relative" id="treatments">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-4">Holistic Care for Your Recovery</h3>
          <p className="text-text-sub text-lg">We specialize in treating chronic conditions through a unique blend of orthopedic science and therapeutic yoga.</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {treatments.map((treatment, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group bg-background-light dark:bg-background-dark p-8 rounded-3xl border border-transparent hover:border-accent/20 transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-white dark:bg-surface-dark rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                <span className="material-symbols-outlined text-4xl">{treatment.icon}</span>
              </div>
              <h4 className="text-xl font-bold text-text-main dark:text-white mb-3">{treatment.title}</h4>
              <p className="text-text-sub text-sm mb-6 leading-relaxed">{treatment.description}</p>
              <Link className="inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors" href="/treatments">
                Learn more <span className="material-symbols-outlined text-base ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

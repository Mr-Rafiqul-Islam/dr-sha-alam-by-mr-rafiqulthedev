import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomeBlogSection() {
  return (
    <ScrollReveal direction="up">
      <section className="py-24 bg-background-light dark:bg-background-dark" id="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Health Insights</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">Latest Articles</h3>
            <p className="text-text-sub mt-4 max-w-2xl mx-auto">Evidence-based articles from Dr. Shah Alam on spine care, joint health, therapeutic yoga, posture correction, nutrition, and natural recovery strategies to help you move better and live pain-free.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <Image alt="Person doing yoga stretch" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfVy-hECVBOGFvnbBAq98jhu2deQmdnGQPyKmxaUPMVIJ0vWY-1oLCLh83-7dKhjon8k0n-s6T68LyWsUCDWfPIWHPepKRLhMzCFk7qduw7ab4qTGf81kQCVsKAjmH1CMo4RQGc1atnYsN5LW36XFAsiQO0crLozphvXNMiTR1wlZWQY_MDR9WnItGQV5hpWkO4PCFLBy83SA4tApD0TbvNTDZKiAsxJ0HD5fLdn3QOeoEAOkF055LuRfYg68iHlm8_tulxhjDZL0" fill sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
                  Rehabilitation
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-sub mb-3 font-medium uppercase tracking-wide">
                  <span className="material-symbols-outlined text-base">calendar_today</span> October 24, 2023
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">5 Yoga Poses for Lower Back Pain Relief</h4>
                <p className="text-text-sub text-sm mb-6 line-clamp-3 leading-relaxed">Discover the simple yet effective yoga postures that can alleviate chronic lower back tension without medication.</p>
                <Link className="mt-auto inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors gap-1" href="#">
                  Read Article <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </article>
            <article className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <Image alt="Person holding neck in pain" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ-CvPS372aG8HpsunbWMa8zlYouzK_Bx_VvS-_zEuKQ3Yq06n3r1Tvq7nKre9A6676DRHIs2EPQaAbIrdyqYd-EPrm7zUcKj92l5uxcTflqtRTOOwR8eL1y5bzzyiPbTlRJcjwdhHkSEk8EYiqCaPGkFeLsZNsWNSEaLQALcWJFEsYkvwMO8u_OJNCJJoXvT8GIyJKlmnFZYCWqPWzEOOQbHHPNrA-7RGn3iTCXXN3CKJN3Z-YkqjJLbBb--tRGQGitx6X4JaQyg" fill sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
                  Lifestyle
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-sub mb-3 font-medium uppercase tracking-wide">
                  <span className="material-symbols-outlined text-base">calendar_today</span> October 10, 2023
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">Tech Neck: Prevention and Cure</h4>
                <p className="text-text-sub text-sm mb-6 line-clamp-3 leading-relaxed">Modern life involves hours of screen time. Learn how to prevent the dreaded &apos;Tech Neck&apos; and correct your posture.</p>
                <Link className="mt-auto inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors gap-1" href="#">
                  Read Article <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </article>
            <article className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <Image alt="Healthy food bowl" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbOQjK5YuQNIv5cj5L_IY8BAA1mSR_oLVoeuAW-Gi1kTeGR3jMnZTCgx9_g1kRGy6OQP-6agJ73NYoQNEBNfbggmv_x1m1VS7slWVGRYmTV1FcrDj3QR8Zr88sICFCcUvDbURgLMfG4e-N3F3gkuZd4tTaW3FePZRES5iRm8RRZVVxfag4C_ybp7njxxTOHXUGHcv3rIXVOAVXCqncORaczdUAAKFtUbZFJnUh4YiwUufQ9ECkHBtPua2C2FzxwxxTLtyYjBavqAQ" fill sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
                  Nutrition
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-sub mb-3 font-medium uppercase tracking-wide">
                  <span className="material-symbols-outlined text-base">calendar_today</span> September 28, 2023
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">Anti-Inflammatory Diet for Joint Pain</h4>
                <p className="text-text-sub text-sm mb-6 line-clamp-3 leading-relaxed">What you eat affects how you feel. A guide to foods that naturally reduce inflammation in your joints.</p>
                <Link className="mt-auto inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors gap-1" href="#">
                  Read Article <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

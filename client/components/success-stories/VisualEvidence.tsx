import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function VisualEvidence() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">See What&apos;s Possible</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">Real Progress. Real Recovery. Real Confidence.</h3>
          <p className="text-text-sub max-w-2xl mx-auto text-sm lg:text-base mt-2">Recovery is not just about reducing pain. It&apos;s about restoring movement, improving function, and helping patients return to the activities they love.</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal direction="up" delay={0.1} className="bg-background-light dark:bg-background-dark p-6 rounded-3xl">
            <h4 className="text-xl font-bold text-center mb-6 text-text-main dark:text-white">
              PLID Recovery &amp; Posture Improvement
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  BEFORE
                </div>
                <Image
                  alt="PLID recovery before posture"
                  className="object-cover filter grayscale opacity-80 transition-transform duration-300 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE8XH6fB-qBfjjN5OYJkFAVdZSM5MGvcyf2SbjzwCaHk_8oD-h4YH6UyBHteI7o5UVd9jGuWixW-nVlhhVkfaO2qUM3UFfTgqe6_LJZtfYiruOF9rIqRtmQ3TfiIHYkH0-iQuvTpQv-ACmaE2KyLKCgMlYgG5jrRPInW7ls5dH1jj6EE7keTHvh5SYJonbU3mxMdniFmrGo1weE1gdc2ldjDvpZfihYm5g2DAR4MCYEIViE0NhY1NwJNxT4dHz8diw2V5URt-t6To"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Severe lower back pain, poor posture, difficulty standing for long periods, and fear of movement caused by PLID and nerve irritation.
                  </p>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  AFTER (12 Weeks)
                </div>
                <Image
                  alt="PLID recovery after posture improvement"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqGOE6WVOx9bUiXmoWMlx_p6wEzc0JHnLJWuURLDztvzIi3pH4aHyg_Yy4WV669wTKUNxRqh5XBMaV5bzV0tVoLDPlQeQKKJ92B9m35pQy3Ql6SPpbDsZt3o6ESq8a4H6rEQrC2-_nxaOPC-CbEmGltl6gRat-c3e5gSoCjP_0rv66dUw8gwv6gNxpZbWxcLxs9R0GXpB-Nqj6DTpryLTNIdAhPRP-UWb86FlyQejOmkA-OZzd5qa5IBMjVxiBfb3C4aebI2ypB68"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Improved posture, better spinal stability, increased confidence in movement, and significant reduction in pain and stiffness through structured rehabilitation and therapeutic yoga.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-text-sub mt-4">
              Case: PLID Patient Successfully Recovered Through Conservative Treatment &amp; Therapeutic Yoga
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="bg-background-light dark:bg-background-dark p-6 rounded-3xl">
            <h4 className="text-xl font-bold text-center mb-6 text-text-main dark:text-white">
              Sciatica &amp; Leg Pain Recovery
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  BEFORE
                </div>
                <Image
                  alt="Sciatica and leg pain before recovery"
                  className="object-cover filter grayscale opacity-80 transition-transform duration-300 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhTGHZH_tVhunqU02gLYkQeRWW8aroNv8osjeXGsibyxNCbSE-6ArcXLQ5B3vtG2GlbgjSzZMBLUkp54R_bLFm55bqV7yPo8mzltYGHnvHDa3Uzj7HQMHI3wkRKMQAlkWiLhOqcwYPg7mW0U6i8VDCckrTQbERH1BuB8N5X0uYHJ2jH2A5cL-_jA1Q-KnMYiU7N1uTCtVVSNT8txcB20X0zk6gPCqsuH6Bw3SjEJKKz20Yfa7cmDi0e7XDUrJakZR3YGuBZUARakk"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Persistent leg pain, tingling, numbness, and difficulty walking due to sciatic nerve compression caused by PLID.
                  </p>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl h-64 cursor-pointer">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                  AFTER (8 Weeks)
                </div>
                <Image
                  alt="Sciatica and leg pain after recovery"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5W4oJBSyqMRhFxyzxBLpytWKudk91QDeKhXemcBA9exoBM0HDmg5vqfRy5Vd0IZmyHaMwytMqSRfybA-Zari2fEiBQHSMW0XHkh8wVcCqFutUNdRQwQQIR2DkahsDtxCdU21fL9SchGqo8kQyGn9Yc0G_zTIhuvDuvlV7_6zIofy4ApLZIXUtrYzI4JEKcGfYwk1MEMMrphQ2GqH9luWElaCQZvnkh69wMBiLGd66Fo-IziNfJDMewpSYo0t79nnaJcLGKTe1ADs"
                  fill
                  sizes="(max-width: 1024px) 45vw, 400px"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10">
                  <p className="text-white text-xs sm:text-sm text-center leading-relaxed">
                    Reduced nerve pain, improved walking ability, restored daily function, and greater independence without surgery.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-text-sub mt-4">
              Case: PLID With Sciatica Successfully Managed Through Personalized Recovery Program
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

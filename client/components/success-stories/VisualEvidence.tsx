import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function VisualEvidence() {
  return (
    <section className="py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Visual Evidence</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">See The Difference</h3>
        </ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal direction="up" delay={0.1} className="bg-background-light dark:bg-background-dark p-6 rounded-3xl">
            <h4 className="text-xl font-bold text-center mb-6 text-text-main dark:text-white">Spinal Posture Correction</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-xl h-64">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">BEFORE</div>
                <Image alt="Posture Before" className="object-cover filter grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE8XH6fB-qBfjjN5OYJkFAVdZSM5MGvcyf2SbjzwCaHk_8oD-h4YH6UyBHteI7o5UVd9jGuWixW-nVlhhVkfaO2qUM3UFfTgqe6_LJZtfYiruOF9rIqRtmQ3TfiIHYkH0-iQuvTpQv-ACmaE2KyLKCgMlYgG5jrRPInW7ls5dH1jj6EE7keTHvh5SYJonbU3mxMdniFmrGo1weE1gdc2ldjDvpZfihYm5g2DAR4MCYEIViE0NhY1NwJNxT4dHz8diw2V5URt-t6To" fill sizes="(max-width: 1024px) 45vw, 400px" />
              </div>
              <div className="relative group overflow-hidden rounded-xl h-64">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">AFTER (12 Weeks)</div>
                <Image alt="Posture After" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqGOE6WVOx9bUiXmoWMlx_p6wEzc0JHnLJWuURLDztvzIi3pH4aHyg_Yy4WV669wTKUNxRqh5XBMaV5bzV0tVoLDPlQeQKKJ92B9m35pQy3Ql6SPpbDsZt3o6ESq8a4H6rEQrC2-_nxaOPC-CbEmGltl6gRat-c3e5gSoCjP_0rv66dUw8gwv6gNxpZbWxcLxs9R0GXpB-Nqj6DTpryLTNIdAhPRP-UWb86FlyQejOmkA-OZzd5qa5IBMjVxiBfb3C4aebI2ypB68" fill sizes="(max-width: 1024px) 45vw, 400px" />
              </div>
            </div>
            <p className="text-center text-sm text-text-sub mt-4">Case: Severe Kyphosis treated with bracing &amp; yoga.</p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="bg-background-light dark:bg-background-dark p-6 rounded-3xl">
            <h4 className="text-xl font-bold text-center mb-6 text-text-main dark:text-white">Knee Swelling Reduction</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden rounded-xl h-64">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">BEFORE</div>
                <Image alt="Knee Before" className="object-cover filter grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhTGHZH_tVhunqU02gLYkQeRWW8aroNv8osjeXGsibyxNCbSE-6ArcXLQ5B3vtG2GlbgjSzZMBLUkp54R_bLFm55bqV7yPo8mzltYGHnvHDa3Uzj7HQMHI3wkRKMQAlkWiLhOqcwYPg7mW0U6i8VDCckrTQbERH1BuB8N5X0uYHJ2jH2A5cL-_jA1Q-KnMYiU7N1uTCtVVSNT8txcB20X0zk6gPCqsuH6Bw3SjEJKKz20Yfa7cmDi0e7XDUrJakZR3YGuBZUARakk" fill sizes="(max-width: 1024px) 45vw, 400px" />
              </div>
              <div className="relative group overflow-hidden rounded-xl h-64">
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">AFTER (8 Weeks)</div>
                <Image alt="Knee After" className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5W4oJBSyqMRhFxyzxBLpytWKudk91QDeKhXemcBA9exoBM0HDmg5vqfRy5Vd0IZmyHaMwytMqSRfybA-Zari2fEiBQHSMW0XHkh8wVcCqFutUNdRQwQQIR2DkahsDtxCdU21fL9SchGqo8kQyGn9Yc0G_zTIhuvDuvlV7_6zIofy4ApLZIXUtrYzI4JEKcGfYwk1MEMMrphQ2GqH9luWElaCQZvnkh69wMBiLGd66Fo-IziNfJDMewpSYo0t79nnaJcLGKTe1ADs" fill sizes="(max-width: 1024px) 45vw, 400px" />
              </div>
            </div>
            <p className="text-center text-sm text-text-sub mt-4">Case: Acute knee inflammation treated with cryotherapy.</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

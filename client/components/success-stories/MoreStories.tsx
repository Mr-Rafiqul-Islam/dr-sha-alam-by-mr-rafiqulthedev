import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function MoreStories() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex justify-between items-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">More Recovery Stories</h3>
          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-white dark:hover:bg-surface-dark transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-white dark:hover:bg-surface-dark transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScrollReveal direction="up" delay={0.1} className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <Image alt="Patient" className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAchIq37o2xXDIDWX5zkGTEAwcwwyKXCxkMV4WVXizJrkIZnetTwArwvWQAtLiJC3f1TNMLOKsHSut970m7kZUt4IcjkIaYHWJXWJaM1H8cDtIUMKh4cKlVmEbbewveBLHQ7FaRFY6hzAbI50PfC6x9rCdSASX36L-zBrxlYIsyHzsnRnOV_ENVtew1s9WWiZlEqu5VYsrYzWpHAl_xAdujq9J0KPRjJrsY18X1MnOnlBjagsahagYvzxbq_pRfzzNtDRzbKAzIMCI" width={56} height={56} sizes="56px" />
              <div>
                <h5 className="font-bold text-text-main dark:text-white">Rahim Uddin</h5>
                <div className="flex text-yellow-400 text-xs">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                </div>
              </div>
            </div>
            <h6 className="font-bold text-primary mb-2">Frozen Shoulder Recovery</h6>
            <p className="text-text-sub text-sm mb-6 line-clamp-3">&quot;I couldn&apos;t lift my arm above my shoulder. The manual therapy sessions were painful at first, but necessary. Now I have full range of motion.&quot;</p>
            {/* <button className="text-accent font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Full Story <span className="material-symbols-outlined text-sm">arrow_forward</span></button> */}
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <Image alt="Patient" className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwVjILOEgiuZDM2rFbqxM8d2BgREh6IsiPSRBWc-KzGFP7PYblvZai9IJXy5dL_C0fU2dCp2vsicH2Ox3el3YXPb6WK4s8LASd_t7gUyeQ2Iq4TIkJuuJDD3sWUk5LfffVybg503Xl-p61Y-ELhZgQYZfkV1h3x5OgjSD0WIduUY9ieZwwjR7pe7NTK1FnEPqDXUAlyQqKD9Dug8DiKJLVVpxh3EyGHGjh3WfMDq2NrV4FBhcGtmq1zOGFYglmQs-2XZpJdbK_Qto" width={56} height={56} sizes="56px" />
              <div>
                <h5 className="font-bold text-text-main dark:text-white">Nusrat Jahan</h5>
                <div className="flex text-yellow-400 text-xs">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                </div>
              </div>
            </div>
            <h6 className="font-bold text-primary mb-2">Chronic Back Pain Relief</h6>
            <p className="text-text-sub text-sm mb-6 line-clamp-3">&quot;Years of office work destroyed my posture. The yoga therapy not only fixed my pain but taught me how to sit and work correctly.&quot;</p>
            {/* <button className="text-accent font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Full Story <span className="material-symbols-outlined text-sm">arrow_forward</span></button> */}
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3} className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <Image alt="Patient" className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfe4SJbreJKGAn4RqCIcYNZg00YDwiLOaa5FxgtcRJF7vY5EbiKG71yjTsQRe89qMlGN7p6aXJ4GeF0mI8GchiVvlunWOzY-nmP6K7MrFxhd5Tspse8pbdbr5M2sAC0p0XOg_cFNMPKIj3zKlUva34pZcwJ3XHzFrLuBP3JgkHX91vyXaud2Qx5JULCf9XZ7fegip8MZHMTkm1URf5qW9EbXP8xHzQhA_j48W8pbmhvYvTst6tUnl7A5bkvAnahz6Xa49QGj6APO0" width={56} height={56} sizes="56px" />
              <div>
                <h5 className="font-bold text-text-main dark:text-white">Kamal Hossain</h5>
                <div className="flex text-yellow-400 text-xs">
                  <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                </div>
              </div>
            </div>
            <h6 className="font-bold text-primary mb-2">Sciatica Treatment</h6>
            <p className="text-text-sub text-sm mb-6 line-clamp-3">&quot;The shooting pain down my leg was unbearable. Dr. Alam&apos;s diagnosis was spot on. No surgery needed, just targeted exercises.&quot;</p>
            {/* <button className="text-accent font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Full Story <span className="material-symbols-outlined text-sm">arrow_forward</span></button> */}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

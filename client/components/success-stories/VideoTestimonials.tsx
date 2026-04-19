import ScrollReveal from '@/components/ScrollReveal';
import VideoCard from './VideoCard';

export default function VideoTestimonials() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">Hear It Directly From Them</h3>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal direction="up" delay={0.1}>
            <VideoCard 
              title="Recovering from Surgery"
              duration="2:15"
              thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDXelBD-FWsS8Wqk9YiKekFMmG8pjSYHyHhF7z4byHhJjDXwkH_jcN4M5xhVvGZaAmszq-kkbY4hXg-ZyaSdZ1a5i8BHe0WhZjC5NvCk4Ahb17UMA35Gff5ZzB-GtltpNyhBOQAxio9tHaGZunvAkrmXeMP_fJv6DdBnIjRjc0_9nVrpM_SHGbLKk-QPpuXEvJu0wEHL1c6x3IocbPa9Gon_Qsen0euHiphdWoa5almBp3krIb-U4DYrCCkyibn8oy887JWlX7YnRE"
              videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <VideoCard 
              title="Life Without Back Pain"
              duration="3:40"
              thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDh6tmAvmb_TSkPhDjebsvfj9NtSa6vOIaGs29AxNY5lHNe_wcX0whwrHGctRxoj_nxyWBvxeRZOr7jaCJ2n2HGh067HKOXRN1w8ZV7fOvAUJD-nUhvN4-q0NQe6z1BdkUQ8JkHQY57SKOOy2mFhWj1_v3IHAm767_XDqs_ofEIzFuLmVZa94pbQjUZhbrXG0IHlO2nSifMMBBQUvtQgpxryZrKFZRRcLem3C5s-GOd_eD6VRmO7zTtFnrWlYCEekizwgVTeAOG-wo"
              videoUrl="https://www.youtube.com/embed/tgbNymZ7vqY"
            />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <VideoCard 
              title="Yoga Therapy Experience"
              duration="1:50"
              thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Dl5SL7eF0PZchSXS6rIP4T-2dTyINeIMlM_wpCrA6XTbd3u3VNKoqN59AW_OY8GGGdLt_BMMsYDMhczjV5-h8ReINAmiqO0u4DPpqwkACBW9M-CwHF-Khwg1BQjcuJuFm1t8mMP3T6jrZ7XJQBo6eTBkEkMzXkw9F14PzVTUCcTaNNNgUyJDIgOrb3dUcmhlmCKV7JqgAx8XxYQ6-8tCLIMHqZds6mBo0l1gojCqhjMdp8DXRLMmYL30yg7TV72Oo2-Uvm_WVuY"
              videoUrl="https://www.youtube.com/embed/9bZkp7q19f0"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

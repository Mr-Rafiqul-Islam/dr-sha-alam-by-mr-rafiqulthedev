import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function LatestArticles() {
  const articles = [
    {
      id: 1,
      category: 'Rehabilitation',
      date: 'Oct 24, 2023',
      title: '5 Yoga Poses for Lower Back Pain Relief',
      excerpt: 'Discover simple yet effective yoga postures that can alleviate chronic lower back tension without medication.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfVy-hECVBOGFvnbBAq98jhu2deQmdnGQPyKmxaUPMVIJ0vWY-1oLCLh83-7dKhjon8k0n-s6T68LyWsUCDWfPIWHPepKRLhMzCFk7qduw7ab4qTGf81kQCVsKAjmH1CMo4RQGc1atnYsN5LW36XFAsiQO0crLozphvXNMiTR1wlZWQY_MDR9WnItGQV5hpWkO4PCFLBy83SA4tApD0TbvNTDZKiAsxJ0HD5fLdn3QOeoEAOkF055LuRfYg68iHlm8_tulxhjDZL0'
    },
    {
      id: 2,
      category: 'Nutrition',
      date: 'Sep 28, 2023',
      title: 'Anti-Inflammatory Diet for Joint Pain',
      excerpt: 'What you eat affects how you feel. A guide to foods that naturally reduce inflammation in your joints.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOQjK5YuQNIv5cj5L_IY8BAA1mSR_oLVoeuAW-Gi1kTeGR3jMnZTCgx9_g1kRGy6OQP-6agJ73NYoQNEBNfbggmv_x1m1VS7slWVGRYmTV1FcrDj3QR8Zr88sICFCcUvDbURgLMfG4e-N3F3gkuZd4tTaW3FePZRES5iRm8RRZVVxfag4C_ybp7njxxTOHXUGHcv3rIXVOAVXCqncORaczdUAAKFtUbZFJnUh4YiwUufQ9ECkHBtPua2C2FzxwxxTLtyYjBavqAQ'
    },
    {
      id: 3,
      category: 'Lifestyle',
      date: 'Sep 15, 2023',
      title: 'Walking: The Underestimated Therapy',
      excerpt: 'Why a daily 30-minute walk might be more effective for recovery than intensive gym sessions for certain conditions.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUmaPVbPNx_wkwUKO6yQCE23MeytyZNNs0PHyKEKubJYwopu7Z25myusFo2ct2xB1HBhqsT5lAyMax83RCg844HmfostNthsW2_c0dxfw2lh6W-orM46HktkU6fU3g3VGaS5PebsxCZ8tkhYwjVbqoqYAOHLbSZp16iUUmvVQl8G06Wk1bZQS7mSDahydriS7ERCLLwJJcuFJ_BAqxEGhigdmjme9vhyKVuwFdMTLYjl9Pxz3_lTp-BtabfSqn3S-N2Ts2xBLgoxY'
    },
    {
      id: 4,
      category: 'Consultation',
      date: 'Aug 30, 2023',
      title: 'When to See an Orthopedic Specialist',
      excerpt: 'Understanding the red flags. Don\'t ignore persistent joint pain, swelling, or reduced range of motion.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOTjSAc1-lI6k7AWc9vIFTe1T3qZTUMpLURsHX5VugOOkg0mk7bhLy3jL078SBvDZ7AjPA-yAfXfo2ZuDvQk1elqdntezlYPbZNCaagEAoeiTm6OIGzSBjn7runX6jW9bo51kg7kNnf8adIw5D3wXSXevUB2M8XGTE22l-C5_FGsE_vJGMgkuHkFQP9QF1a02KMIdRHlNaAHoldCZkUlnsNhjAmGIY2q-xH9kpdQsNzlIi9ATCjHUhJPWvf3wARUi04_zChL0EQQ4'
    },
    {
      id: 5,
      category: 'Therapy',
      date: 'Aug 12, 2023',
      title: 'Frozen Shoulder: Recovery Timeline',
      excerpt: 'A realistic look at the stages of frozen shoulder and how physical therapy accelerates the thawing process.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmcOC0zZjsNKoYJx-YRKI8lewO5-QT4vfQW6dQnvq91n-WgKI0aczFhkhfVA-V3EL5CcTPJnJ_-dOLQVOFFB9pZB9EtIprizpBPOCt975DlEHS-IvJ2RRwSJofygXcEmJRlaGte5EVu3GGygnI1Lqkd095w2yEv0zsSnPuN6sa461QEssVAVSNABmxAuUgwo32O_d5xzOwAhEvAaJJIAelfcTcmaHb_894l0rDLet2r12GvTkZgYA9blXimmH5wyvqKBjLP12-JOg'
    },
    {
      id: 6,
      category: 'Sleep',
      date: 'Jul 25, 2023',
      title: 'Best Sleeping Positions for Back Pain',
      excerpt: 'Struggling to sleep with back pain? Learn how pillow placement and sleep positions can provide night-time relief.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHJW2_Ueex3EXL5Qm1ynM3CDW_ngk9ABTRhBqlYy00Hm5ild8A74BOrumslVmZ7DA93O8Bh-MWFZ3CrSPIW3ZdmYNYUxeQszmLe-f2YCLH63r06O9-9vmxVTwxz9iKmtEpJzc3m4OEQhfSkoYF_nJ6nk-PsYpDzarNbuhTbJotueF8x23NsQWPHTLeONZrUgUmHe7iuU2FGxDZQ9VKqUcfB5dfUJWEtMMpfK526StBGfZLpSAkYOKtGOVcdoNCrnOMDWuIGbquntk'
    }
  ];

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <h3 className="text-2xl font-bold text-text-main dark:text-white mb-10 border-l-4 border-accent pl-4">Latest Articles</h3>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ScrollReveal key={article.id} direction="up" delay={index * 0.1}>
              <article className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                <div className="h-56 overflow-hidden relative">
                  <Image alt={article.title} className="object-cover transition-transform duration-700 group-hover:scale-110" src={article.imageUrl} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-primary uppercase tracking-wide">
                    {article.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-text-sub mb-3 font-medium">
                    <span className="material-symbols-outlined text-sm">calendar_today</span> {article.date}
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:underline decoration-2 underline-offset-2">{article.title}</h4>
                  <p className="text-text-sub text-sm mb-6 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  <Link href={`/blog/article-${article.id}`} className="mt-auto inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors gap-1">
                    Read More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal direction="up" className="mt-12 text-center">
          <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
            Load More Articles
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';

interface AuthorInfo {
  name: string;
  image: string;
  bio: string;
}

interface BlogContentProps {
  imageUrl: string;
  content: React.ReactNode;
  author: AuthorInfo;
}

export default function BlogContent({ imageUrl, content, author }: BlogContentProps) {
  return (
    <div className="lg:w-2/3">
      <div className="rounded-3xl overflow-hidden shadow-sm mb-10 w-full aspect-video relative">
        <Image alt="Article Cover" className="object-cover" src={imageUrl} fill sizes="(max-width: 1024px) 100vw, 66vw" />
      </div>
      <article className="prose dark:prose-invert max-w-none text-lg prose-headings:text-primary prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-xl prose-p:mb-5 prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-ul:mb-5 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-strong:text-primary prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:my-8 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-primary/5 prose-blockquote:py-6 prose-blockquote:pr-6 prose-blockquote:rounded-r-2xl">
        {content}
      </article>
      
      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold text-text-main dark:text-white">Share this article:</span>
        <div className="flex gap-3">
          <Link href="#" className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
            <i className="fab fa-facebook-f"></i>
          </Link>
          <Link href="#" className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
            <i className="fab fa-twitter"></i>
          </Link>
          <Link href="#" className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
            <i className="fab fa-linkedin-in"></i>
          </Link>
          <Link href="#" className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors">
            <i className="fab fa-whatsapp"></i>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="shrink-0 relative">
          <Image alt={author.name} className="rounded-full object-cover border-4 border-background-light dark:border-background-dark shadow-md w-24 h-24 md:w-32 md:h-32" src={author.image} width={128} height={128} sizes="(max-width: 768px) 96px, 128px" />
          <div className="absolute bottom-1 right-1 bg-accent text-white p-1 rounded-full border-2 border-white dark:border-surface-dark">
            <span className="material-symbols-outlined text-sm block">check_circle</span>
          </div>
        </div>
        <div className="flex-grow text-center md:text-left">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-1">About the Author</h3>
          <h4 className="text-2xl font-bold text-text-main dark:text-white mb-3">{author.name}</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
            {author.bio}
          </p>
          <Link href="/about" className="text-primary font-bold text-sm hover:text-accent inline-flex items-center gap-1 group transition-colors">
            View Full Profile 
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

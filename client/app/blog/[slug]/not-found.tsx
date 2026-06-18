import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <main className="flex-grow flex items-center justify-center py-24 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-primary dark:text-white mb-4">
          Article Not Found
        </h1>
        <p className="text-text-sub mb-8">
          The article you are looking for may have been removed or the link is incorrect.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Back to Blog
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}

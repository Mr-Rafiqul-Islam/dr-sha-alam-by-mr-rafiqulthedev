import Link from 'next/link'

function ShareArticle({ url }: { url: string }) {
  return (
    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold text-text-main dark:text-white">Share this article:</span>
        <div className="flex gap-3">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            aria-label="Share on Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
            className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
            aria-label="Share on Twitter"
          >
            <i className="fab fa-twitter"></i>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`}
            className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors"
            aria-label="Share on LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
            aria-label="Share on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </Link>
        </div>
      </div>
  )
}

export default ShareArticle
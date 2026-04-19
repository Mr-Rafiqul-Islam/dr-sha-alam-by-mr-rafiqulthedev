import BlogHero from '@/components/blog/BlogHero';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedArticle from '@/components/blog/FeaturedArticle';
import LatestArticles from '@/components/blog/LatestArticles';
import AuthorBio from '@/components/blog/AuthorBio';
import BlogCallToAction from '@/components/blog/BlogCallToAction';

export default function BlogPage() {
  return (
    <main className="flex-grow">
      <BlogHero />
      <BlogSearch />
      <BlogCategories />
      <FeaturedArticle />
      <LatestArticles />
      <AuthorBio />
      <BlogCallToAction />
    </main>
  );
}

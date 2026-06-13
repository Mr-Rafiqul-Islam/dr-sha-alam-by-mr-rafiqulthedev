import { Icon, StatCard } from "../common";
import type { Blog } from "../../types/blog";
import { computeBlogStats } from "../../utils/blog";

type BlogStatsProps = {
  blogs: Blog[];
};

export function BlogStats({ blogs }: BlogStatsProps) {
  const stats = computeBlogStats(blogs);

  return (
    <div className="mb-stack-lg grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Icon name="menu_book" size={24} />}
        label="Total Blogs"
        value={stats.total}
        iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
      />
      <StatCard
        icon={<Icon name="verified_user" size={24} />}
        label="Published Blogs"
        value={stats.published}
        iconBgClassName="bg-primary-fixed/40 text-primary-container"
      />
      <StatCard
        icon={<Icon name="draft" size={24} />}
        label="Draft Blogs"
        value={stats.draft}
        iconBgClassName="bg-tertiary-fixed/50 text-on-tertiary-fixed-variant"
      />
      <StatCard
        icon={<Icon name="star" size={24} />}
        label="Featured Blogs"
        value={stats.featured}
        iconBgClassName="bg-primary-fixed/40 text-primary-container"
      />
    </div>
  );
}

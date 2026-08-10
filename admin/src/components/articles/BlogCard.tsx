import { useNavigate } from "react-router";
import { Avatar, Badge, Button, Icon, PendingDeleteBadge } from "../common";
import type { Blog } from "../../types/blog";
import {
  formatBlogDate,
  formatList,
  getBlogStatusLabel,
  getInitials,
} from "../../utils/blog";
import { getPendingDeleteSurfaceClass } from "../../utils/pendingDelete";

type BlogCardProps = {
  blog: Blog;
  onView: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onToggleFeatured: (blog: Blog) => void;
};

export function BlogCard({ blog, onView, onDelete, onToggleFeatured }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] ${getPendingDeleteSurfaceClass(blog.pendingDelete)}`}
    >
      <div className="relative aspect-16/10 overflow-hidden bg-surface-container-high">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-on-surface-variant">
            <Icon name="image" size={40} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {blog.category.map((category) => (
            <Badge
              key={category}
              className="bg-surface-container-lowest/95 backdrop-blur-sm"
            >
              {category}
            </Badge>
          ))}
          {blog.isFeatured ? (
            <Badge variant="confirmed" className="backdrop-blur-sm">
              Featured
            </Badge>
          ) : null}
          {blog.pendingDelete ? (
            <PendingDeleteBadge />
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
          {getBlogStatusLabel(blog)} {formatBlogDate(blog.createdAt)}
        </p>
        <h3 className="mt-2 line-clamp-2 text-headline-sm font-semibold text-on-surface">
          {blog.title}
        </h3>

        {/* <div className="mt-3 flex items-center gap-4 text-label-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Icon name="visibility" size={16} />
            {blog.views}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="chat_bubble" size={16} />
            {blog.comments.length}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", status.dotClass)} />
            {status.label}
          </span>
        </div> */}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar initials={getInitials(blog.author[0] ?? "")} size="sm" />
            <span className="truncate text-label-sm font-medium text-on-surface">
              {formatList(blog.author)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="icon"
              size="sm"
              aria-label="View blog"
              title="View blog"
              onClick={() => onView(blog)}
            >
              <Icon name="visibility" size={18} />
            </Button>
            <Button
              variant="icon"
              size="sm"
              aria-label="Edit blog"
              title="Edit blog"
              onClick={() => navigate(`/articles/${blog.id}/edit`)}
            >
              <Icon name="edit" size={18} />
            </Button>
            <Button
              variant="icon"
              size="sm"
              aria-label={blog.isFeatured ? "Remove featured" : "Set as featured"}
              title={blog.isFeatured ? "Remove featured" : "Set as featured"}
              onClick={() => onToggleFeatured(blog)}
              className={
                blog.isFeatured
                  ? "text-primary hover:bg-primary-container/20"
                  : "hover:bg-primary-container/10 hover:text-primary"
              }
            >
              <Icon
                name={blog.isFeatured ? "star" : "star_outline"}
                size={18}
                filled={blog.isFeatured}
              />
            </Button>
            <Button
              variant="icon"
              size="sm"
              aria-label="Delete blog"
              title="Delete blog"
              onClick={() => onDelete(blog)}
              className="hover:bg-error-container/20 hover:text-error"
            >
              <Icon name="delete" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

import { Badge, Modal } from "../common";
import type { Blog } from "../../types/blog";
import { formatBlogDate, getBlogStatusLabel } from "../../utils/blog";

type BlogViewModalProps = {
  blog: Blog | null;
  onClose: () => void;
};

export function BlogViewModal({ blog, onClose }: BlogViewModalProps) {
  return (
    <Modal
      open={!!blog}
      onClose={onClose}
      title={blog?.title ?? "Blog Preview"}
      subtitle={
        blog
          ? `${getBlogStatusLabel(blog)} · ${formatBlogDate(blog.createdAt)}`
          : undefined
      }
      className="max-w-2xl"
    >
      {blog ? (
        <div className="flex flex-col gap-4">
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="aspect-video w-full rounded-lg object-cover"
            />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {blog.category.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
            {blog.isFeatured ? <Badge variant="confirmed">Featured</Badge> : null}
          </div>
          <p className="text-body-md text-on-surface-variant">{blog.shortDesc}</p>
          <div
            className="prose prose-sm max-w-none text-on-surface"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      ) : null}
    </Modal>
  );
}

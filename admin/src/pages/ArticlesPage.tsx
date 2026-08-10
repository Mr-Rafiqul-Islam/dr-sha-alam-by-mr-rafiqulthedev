import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  BlogFilters,
} from "../components/articles/BlogFilters";
import { BlogCard } from "../components/articles/BlogCard";
import { BlogStats } from "../components/articles/BlogStats";
import { BlogViewModal } from "../components/articles/BlogViewModal";
import { NewBlogCard } from "../components/articles/NewBlogCard";
import {
  Button,
  DeleteConfirmationModal,
  Icon,
  PageHeader,
  Pagination,
} from "../components/common";
import {
  DEFAULT_BLOG_AUTHOR,
} from "../constants/blog";
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
  useSetBlogFeaturedMutation,
} from "../store/api/blogsApi";
import type { Blog, BlogFilterState } from "../types/blog";
import {
  collectUniqueValues,
  filterBlogs,
  getApiErrorMessage,
  mergeOptions,
} from "../utils/blog";

const PAGE_SIZE = 9;

const DEFAULT_FILTERS: BlogFilterState = {
  search: "",
  author: "",
  status: "",
};

export function ArticlesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BlogFilterState>(DEFAULT_FILTERS);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [featuringBlog, setFeaturingBlog] = useState<Blog | null>(null);

  const { data: blogs = [], isLoading, isError, error } = useGetBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [setBlogFeatured, { isLoading: isUpdatingFeatured }] =
    useSetBlogFeaturedMutation();

  const currentFeaturedBlog = useMemo(
    () => blogs.find((blog) => blog.isFeatured) ?? null,
    [blogs],
  );

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load blogs"));
    }
  }, [isError, error]);

  const authors = useMemo(() => {
    const fromData = collectUniqueValues(blogs, "author");
    return mergeOptions([DEFAULT_BLOG_AUTHOR], fromData);
  }, [blogs]);

  const filteredBlogs = useMemo(
    () => filterBlogs(blogs, filters),
    [blogs, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedBlogs = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return filteredBlogs.slice(start, start + PAGE_SIZE);
  }, [filteredBlogs, effectivePage]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleFilterChange = (next: BlogFilterState) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBlog) return;

    try {
      const result = await deleteBlog(deletingBlog.id).unwrap();
      if (result.pending) {
        toast.info(
          "Delete request submitted and is pending confirmation from an admin.",
        );
      } else {
        toast.success(`"${deletingBlog.title}" deleted`);
      }
      setDeletingBlog(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete blog"));
    }
  };

  const handleFeaturedConfirm = async () => {
    if (!featuringBlog) return;

    const nextFeatured = !featuringBlog.isFeatured;

    try {
      await setBlogFeatured({
        id: featuringBlog.id,
        isFeatured: nextFeatured,
      }).unwrap();
      toast.success(
        nextFeatured
          ? `"${featuringBlog.title}" is now featured`
          : `Featured status removed from "${featuringBlog.title}"`,
      );
      setFeaturingBlog(null);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Failed to update featured status"),
      );
    }
  };

  const featuredModalDescription = featuringBlog
    ? featuringBlog.isFeatured
      ? `Remove featured status from "${featuringBlog.title}"? It will no longer appear as the featured blog on the site.`
      : currentFeaturedBlog && currentFeaturedBlog.id !== featuringBlog.id
        ? `Set "${featuringBlog.title}" as the featured blog? "${currentFeaturedBlog.title}" will no longer be featured.`
        : `Set "${featuringBlog.title}" as the featured blog on the site home page?`
    : undefined;

  return (
    <>
      <PageHeader
        title="Blogs"
        subtitle="Manage and track clinical articles, patient education resources, and surgical insights to keep your patients informed and engaged."
        action={
          <Button
            leftIcon={<Icon name="add" size={20} />}
            onClick={() => navigate("/articles/new")}
          >
            Create Blog
          </Button>
        }
      />

      <BlogStats blogs={blogs} />

      <BlogFilters
        filters={filters}
        authors={authors}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <Icon name="progress_activity" size={32} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onView={setViewingBlog}
                onDelete={setDeletingBlog}
                onToggleFeatured={setFeaturingBlog}
              />
            ))}
            <NewBlogCard />
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="mt-stack-lg overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
              <Pagination
                currentPage={effectivePage}
                totalPages={totalPages}
                totalItems={filteredBlogs.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : null}
        </>
      )}

      <BlogViewModal
        blog={viewingBlog}
        onClose={() => setViewingBlog(null)}
      />

      <DeleteConfirmationModal
        open={!!deletingBlog}
        onClose={() => setDeletingBlog(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete blog?"
        itemName={deletingBlog ? `"${deletingBlog.title}"` : undefined}
        isLoading={isDeleting}
      />

      <DeleteConfirmationModal
        open={!!featuringBlog}
        onClose={() => setFeaturingBlog(null)}
        onConfirm={handleFeaturedConfirm}
        title={
          featuringBlog?.isFeatured ? "Remove featured?" : "Set as featured?"
        }
        description={featuredModalDescription}
        confirmLabel={
          featuringBlog?.isFeatured ? "Remove featured" : "Set featured"
        }
        confirmLoadingLabel={
          featuringBlog?.isFeatured ? "Removing..." : "Setting..."
        }
        confirmClassName={
          featuringBlog?.isFeatured
            ? "bg-error text-on-error hover:bg-error/90 shadow-sm hover:shadow-md"
            : "bg-primary text-on-primary hover:bg-primary/90 shadow-sm hover:shadow-md"
        }
        isLoading={isUpdatingFeatured}
      />
    </>
  );
}

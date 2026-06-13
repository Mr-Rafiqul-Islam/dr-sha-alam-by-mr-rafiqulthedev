import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  BLOG_CATEGORIES,
  DEFAULT_BLOG_AUTHOR,
} from "../constants/blog";
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
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
  title: "",
  category: "",
  author: "",
  status: "",
};

export function ArticlesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BlogFilterState>(DEFAULT_FILTERS);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);

  const { data: blogs = [], isLoading, isError, error } = useGetBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load blogs"));
    }
  }, [isError, error]);

  const categories = useMemo(
    () => mergeOptions(BLOG_CATEGORIES, collectUniqueValues(blogs, "category")),
    [blogs],
  );

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
      await deleteBlog(deletingBlog.id).unwrap();
      toast.success(`"${deletingBlog.title}" deleted`);
      setDeletingBlog(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete blog"));
    }
  };

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
        categories={categories}
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
    </>
  );
}

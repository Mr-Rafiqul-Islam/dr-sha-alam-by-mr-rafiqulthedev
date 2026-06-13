export type BlogMeta = {
  title?: string;
  keywords?: string;
  description?: string;
};

export type Blog = {
  id: string;
  title: string;
  shortDesc: string;
  content: string;
  category: string[];
  author: string[];
  views: number;
  comments: string[];
  isFeatured: boolean;
  slug: string;
  meta: BlogMeta | null;
  notes: string | Record<string, unknown> | null;
  published: boolean;
  image: string;
  imagePublicId: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogListResponse = {
  success: boolean;
  data: Blog[];
};

export type BlogResponse = {
  success: boolean;
  data: Blog;
};

export type BlogImageUploadResponse = {
  success: boolean;
  payload: {
    image: string;
    imagePublicId: string;
  };
};

export type BlogImageDeleteResponse = {
  success: boolean;
  message: string;
  payload: { imagePublicId: string };
};

export type BlogListQueryParams = {
  published?: string;
  category?: string;
  featured?: string;
};

export type CreateBlogPayload = {
  title: string;
  shortDesc: string;
  content: string;
  category: string;
  author: string;
  slug: string;
  image: string;
  imagePublicId: string;
  isFeatured: boolean;
  published?: boolean;
  meta?: BlogMeta | null;
  notes?: string | Record<string, unknown> | null;
};

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export type BlogFormData = {
  title: string;
  slug: string;
  shortDesc: string;
  content: string;
  category: string;
  author: string;
  published: boolean;
  isFeatured: boolean;
  image: string;
  imagePublicId: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  notes: string;
};

export type BlogStatusFilter = "" | "published" | "draft";

export type BlogFilterState = {
  title: string;
  category: string;
  author: string;
  status: BlogStatusFilter;
};

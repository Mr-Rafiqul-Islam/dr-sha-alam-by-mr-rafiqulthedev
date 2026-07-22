export type BlogMeta = {
  title?: string;
  keywords?: string;
  description?: string;
};

export type PublicBlog = {
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
  image: string;
  imagePublicId: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogsListMeta = {
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
  hasMore?: boolean;
};

export type GetAllBlogsParams = {
  limit?: number;
  page?: number;
  offset?: number;
  category?: string;
  featured?: boolean;
};

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://doctorshahalalam.com";

// Static pages that should be indexed
const staticPages = [
  "",
  "/about",
  "/after-treatment-instructions",
  "/appointment",
  "/before-visit-instructions",
  "/blog",
  "/contact",
  "/faq",
  "/medical-disclaimer",
  "/patient-guidelines",
  "/privacy-policy",
  "/success-stories",
  "/terms-conditions",
];

type Blog = {
  slug: string;
  updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "/blog" ? "daily" : "monthly",
    priority: page === "" ? 1 : 0.7,
  }));

  // Dynamic blog pages
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/client/blogs`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const blogs: Blog[] = await response.json();

    blogRoutes = blogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: blog.updatedAt
        ? new Date(blog.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap blog fetch failed:", error);
  }

  return [...staticRoutes, ...blogRoutes];
}
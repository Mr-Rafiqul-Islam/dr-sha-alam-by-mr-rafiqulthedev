import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PublicBlog } from "@/types/blog"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBlogDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getPrimaryCategory(blog: PublicBlog): string {
  return blog.category[0] ?? "General"
}

export function getInitials(name: string): string {
  return name
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

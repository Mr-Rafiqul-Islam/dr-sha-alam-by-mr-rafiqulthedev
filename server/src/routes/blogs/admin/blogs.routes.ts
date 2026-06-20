import { Router } from "express";
import * as blogFeatured from "../../../controllers/blogs/admin/blog-featured.controller.js";
import * as blogsAdmin from "../../../controllers/blogs/admin/blogs.controller.js";
import { adminActivityTracing } from "../../../modules/activity/activity.middleware.js";
import { requireAdminAuth, requireAdminPermission } from "../../../modules/adminAuth/adminAuth.middleware.js";
import { upload } from "../../../shared/middleware/multer.js";
import {
  handleBlogImageDelete,
  handleBlogImageUpload,
} from "../../../utils/handleImageUpload.js";

export const blogsAdminRouter = Router();

blogsAdminRouter.use(requireAdminAuth);
blogsAdminRouter.use(requireAdminPermission("articles"));
blogsAdminRouter.use(adminActivityTracing());

blogsAdminRouter.get("/", blogsAdmin.listBlogsForAdmin);
blogsAdminRouter.post(
  "/upload-image",
  upload.single("drsa-file"),
  handleBlogImageUpload,
);
blogsAdminRouter.delete("/upload-image", handleBlogImageDelete);
blogsAdminRouter.get("/:id", blogsAdmin.getBlogByIdForAdmin);
blogsAdminRouter.post("/", blogsAdmin.createBlog);
blogsAdminRouter.patch("/:id/featured", blogFeatured.setBlogFeatured);
blogsAdminRouter.patch("/:id", blogsAdmin.updateBlog);
blogsAdminRouter.delete("/:id", blogsAdmin.deleteBlog);

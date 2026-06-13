import { Router } from "express";
import * as blogsAdmin from "../../../controllers/blogs/admin/blogs.controller.js";
import {
  requireAuth,
  requireContentManager,
} from "../../../shared/middleware/admin/admin.middleware.js";
import { upload } from "../../../shared/middleware/multer.js";
import {
  handleBlogImageDelete,
  handleBlogImageUpload,
} from "../../../utils/handleImageUpload.js";

export const blogsAdminRouter = Router();

// blogsAdminRouter.use(requireAuth);
// blogsAdminRouter.use(requireContentManager);

blogsAdminRouter.get("/", blogsAdmin.listBlogsForAdmin);
blogsAdminRouter.post(
  "/upload-image",
  upload.single("drsa-file"),
  handleBlogImageUpload,
);
blogsAdminRouter.delete("/upload-image", handleBlogImageDelete);
blogsAdminRouter.get("/:id", blogsAdmin.getBlogByIdForAdmin);
blogsAdminRouter.post("/", blogsAdmin.createBlog);
blogsAdminRouter.patch("/:id", blogsAdmin.updateBlog);
blogsAdminRouter.delete("/:id", blogsAdmin.deleteBlog);

import { Router } from "express";
import * as blogsAdmin from "../../../controllers/blogs/admin/blogs.controller.js";
import {
  requireAuth,
  requireContentManager,
} from "../../../shared/middleware/admin/admin.middleware.js";

export const blogsAdminRouter = Router();

blogsAdminRouter.use(requireAuth);
blogsAdminRouter.use(requireContentManager);

blogsAdminRouter.get("/", blogsAdmin.listBlogsForAdmin);
blogsAdminRouter.get("/:id", blogsAdmin.getBlogByIdForAdmin);
blogsAdminRouter.post("/", blogsAdmin.createBlog);
blogsAdminRouter.patch("/:id", blogsAdmin.updateBlog);
blogsAdminRouter.delete("/:id", blogsAdmin.deleteBlog);

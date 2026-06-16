import { Router } from "express";
import * as blogsClient from "../../../controllers/blogs/client/blogs.controller.js";

export const blogsClientRouter = Router();

blogsClientRouter.get("/", blogsClient.listBlogs);
blogsClientRouter.get("/:slug", blogsClient.getBlogBySlug);
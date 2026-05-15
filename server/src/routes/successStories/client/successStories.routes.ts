import { Router } from "express";
import * as successStoriesClient from "../../../controllers/successStories/client/successStories.controller.js";

export const successStoriesClientRouter = Router();

successStoriesClientRouter.get("/", successStoriesClient.getSuccessStories);

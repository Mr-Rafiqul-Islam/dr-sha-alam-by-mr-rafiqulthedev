import { Router } from "express";
import * as contactController from "../../../controllers/contact/client/contact.controller.js";

export const contactClientRouter = Router();

contactClientRouter.post("/", contactController.createContactMessage);

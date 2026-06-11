import { Router, raw } from "express";
import { handleMuxWebhook } from "../../controllers/webhooks/mux.controller.js";

export const muxWebhookRouter = Router();

muxWebhookRouter.post(
  "/",
  raw({ type: "application/json" }),
  handleMuxWebhook,
);

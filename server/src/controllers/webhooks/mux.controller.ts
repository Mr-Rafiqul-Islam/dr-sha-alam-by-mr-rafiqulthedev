import type { Request, Response } from "express";
import { MuxVideoStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/db.js";
import {
  parseMuxAssetReadyEvent,
  parseMuxUploadAssetCreatedEvent,
  verifyMuxWebhookSignature,
} from "../../services/mux/muxWebhook.service.js";

export async function handleMuxWebhook(req: Request, res: Response) {
  try {
    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).json({ success: false, message: "Invalid webhook body" });
    }

    const signature = req.headers["mux-signature"];
    const event = await verifyMuxWebhookSignature(
      rawBody,
      typeof signature === "string" ? signature : undefined,
    );

    const uploadCreated = parseMuxUploadAssetCreatedEvent(event);
    if (uploadCreated) {
      const { patientReviewId, mediaAssetId, muxUploadId } = uploadCreated;
      if (patientReviewId && (mediaAssetId || muxUploadId)) {
        await prisma.patientReview.updateMany({
          where: { id: patientReviewId },
          data: {
            ...(mediaAssetId ? { mediaAssetId } : {}),
            ...(muxUploadId ? { muxUploadId } : {}),
            muxVideoStatus: MuxVideoStatus.PROCESSING,
          },
        });
      }
      return res.status(200).json({ success: true });
    }

    const ready = parseMuxAssetReadyEvent(event);
    if (ready) {
      const where: Prisma.PatientReviewWhereInput = ready.patientReviewId
        ? { id: ready.patientReviewId }
        : ready.muxUploadId
          ? { muxUploadId: ready.muxUploadId }
          : { mediaAssetId: ready.mediaAssetId };

      await prisma.patientReview.updateMany({
        where,
        data: {
          mediaAssetId: ready.mediaAssetId,
          muxPlaybackId: ready.muxPlaybackId || undefined,
          muxPlaybackPolicy: "public",
          videoDurationSeconds: ready.durationSeconds,
          muxVideoStatus: MuxVideoStatus.READY,
          ...(ready.thumbnailUrl
            ? { videoThumbnailUrl: ready.thumbnailUrl }
            : {}),
        },
      });
      return res.status(200).json({ success: true });
    }

    res.status(200).json({ success: true, message: "Event ignored" });
  } catch (err) {
    console.error("Mux webhook error:", err);
    if (err instanceof Error && err.message === "MUX_SIGNATURE_MISSING") {
      return res.status(400).json({ success: false, message: "Missing Mux signature" });
    }
    res.status(400).json({ success: false, message: "Invalid webhook" });
  }
}

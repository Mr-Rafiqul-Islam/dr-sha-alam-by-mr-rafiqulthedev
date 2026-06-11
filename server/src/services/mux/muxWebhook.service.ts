import { getMuxClient } from "./mux.client.js";

export type MuxAssetReadyPayload = {
  mediaAssetId: string;
  muxPlaybackId: string;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  patientReviewId: string | null;
  muxUploadId: string | null;
};

type MuxWebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

function parsePassthrough(raw: unknown): { patientReviewId?: string } {
  if (raw == null || raw === "") return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as { patientReviewId?: string };
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") {
    return raw as { patientReviewId?: string };
  }
  return {};
}

function pickPublicPlaybackId(
  playbackIds: unknown,
): string | null {
  if (!Array.isArray(playbackIds)) return null;
  for (const item of playbackIds) {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      typeof (item as { id: unknown }).id === "string"
    ) {
      return (item as { id: string }).id;
    }
  }
  return null;
}

export async function verifyMuxWebhookSignature(
  rawBody: Buffer | string,
  signatureHeader: string | undefined,
): Promise<MuxWebhookEvent> {
  getMuxClient(); // ensure configured
  const body = typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");

  if (!signatureHeader) {
    throw new Error("MUX_SIGNATURE_MISSING");
  }

  const mux = getMuxClient();
  const event = await mux.webhooks.unwrap(body, {
    "mux-signature": signatureHeader,
  });
  return event as unknown as MuxWebhookEvent;
}

export function parseMuxAssetReadyEvent(
  event: MuxWebhookEvent,
): MuxAssetReadyPayload | null {
  if (event.type !== "video.asset.ready") return null;

  const data = event.data;
  const mediaAssetId = typeof data.id === "string" ? data.id : null;
  if (!mediaAssetId) return null;

  const muxPlaybackId = pickPublicPlaybackId(data.playback_ids);
  const durationRaw = data.duration;
  const durationSeconds =
    typeof durationRaw === "number" && Number.isFinite(durationRaw)
      ? durationRaw
      : null;

  const passthrough = parsePassthrough(data.passthrough);
  const uploadIdRaw = data.upload_id;
  const muxUploadId =
    typeof uploadIdRaw === "string" ? uploadIdRaw : null;

  const thumbnailUrl = muxPlaybackId
    ? `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`
    : null;

  return {
    mediaAssetId,
    muxPlaybackId: muxPlaybackId ?? "",
    durationSeconds,
    thumbnailUrl,
    patientReviewId: passthrough.patientReviewId ?? null,
    muxUploadId,
  };
}

/** Handles upload.asset_created to link mediaAssetId while still processing. */
export function parseMuxUploadAssetCreatedEvent(
  event: MuxWebhookEvent,
): { patientReviewId: string | null; mediaAssetId: string | null; muxUploadId: string | null } | null {
  if (event.type !== "video.upload.asset_created") return null;

  const data = event.data;
  const assetId = typeof data.asset_id === "string" ? data.asset_id : null;
  const uploadId = typeof data.id === "string" ? data.id : null;
  const passthrough = parsePassthrough(data.passthrough);

  return {
    patientReviewId: passthrough.patientReviewId ?? null,
    mediaAssetId: assetId,
    muxUploadId: uploadId,
  };
}

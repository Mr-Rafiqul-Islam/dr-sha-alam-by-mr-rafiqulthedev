import { getMuxClient } from "./mux.client.js";

export type CreateDirectUploadParams = {
  patientReviewId: string;
  title?: string;
  playbackPolicy?: "public" | "signed";
};

export type CreateDirectUploadResult = {
  muxUploadId: string;
  uploadUrl: string;
  mediaAssetId: string | null;
  status: "PROCESSING";
};

export async function createPatientReviewDirectUpload(
  params: CreateDirectUploadParams,
): Promise<CreateDirectUploadResult> {
  const mux = getMuxClient();
  const playbackPolicy = params.playbackPolicy ?? "public";

  const upload = await mux.video.uploads.create({
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: [playbackPolicy],
      passthrough: JSON.stringify({ patientReviewId: params.patientReviewId }),
      ...(params.title ? { meta: { title: params.title } } : {}),
    },
  });

  const uploadUrl = upload.url;
  if (!uploadUrl) {
    throw new Error("MUX_UPLOAD_URL_MISSING");
  }

  return {
    muxUploadId: upload.id,
    uploadUrl,
    mediaAssetId: upload.asset_id ?? null,
    status: "PROCESSING",
  };
}

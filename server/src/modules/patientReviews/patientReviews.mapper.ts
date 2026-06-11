import type { PatientReview } from "@prisma/client";

/** Strict public list: core review fields only. */
export function toPublicReviewSimple(r: PatientReview) {
  return {
    id: r.id,
    patientDisplayName: r.patientDisplayName,
    title: r.title,
    description: r.description,
    rating: r.rating,
  };
}

export function formatDurationLabel(seconds: number | null | undefined): string | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export type PublicMuxVideo = {
  muxPlaybackId: string;
  playbackPolicy: "public";
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  durationLabel: string | null;
  videoTitle: string | null;
  status: "READY";
};

export function toPublicMuxVideo(r: PatientReview): PublicMuxVideo | null {
  if (!r.muxPlaybackId) return null;

  return {
    muxPlaybackId: r.muxPlaybackId,
    playbackPolicy: "public",
    thumbnailUrl: r.videoThumbnailUrl,
    durationSeconds: r.videoDurationSeconds,
    durationLabel: formatDurationLabel(r.videoDurationSeconds),
    videoTitle: r.videoTitle,
    status: "READY",
  };
}

/** One row for GET /patient-reviews/videos. */
export function toPublicVideoListItem(r: PatientReview) {
  const video = toPublicMuxVideo(r);
  if (!video) return null;

  return {
    reviewId: r.id,
    title: r.title,
    video,
  };
}

export type AdminMuxVideo = {
  muxUploadId: string | null;
  mediaAssetId: string | null;
  muxPlaybackId: string | null;
  playbackPolicy: string | null;
  muxVideoStatus: string | null;
  thumbnailUrl: string | null;
  videoTitle: string | null;
  durationSeconds: number | null;
  durationLabel: string | null;
};

export function toAdminMuxVideo(r: PatientReview): AdminMuxVideo | null {
  const hasVideo =
    r.muxUploadId != null ||
    r.mediaAssetId != null ||
    r.muxPlaybackId != null ||
    r.muxVideoStatus != null;

  if (!hasVideo) return null;

  return {
    muxUploadId: r.muxUploadId,
    mediaAssetId: r.mediaAssetId,
    muxPlaybackId: r.muxPlaybackId,
    playbackPolicy: r.muxPlaybackPolicy,
    muxVideoStatus: r.muxVideoStatus,
    thumbnailUrl: r.videoThumbnailUrl,
    videoTitle: r.videoTitle,
    durationSeconds: r.videoDurationSeconds,
    durationLabel: formatDurationLabel(r.videoDurationSeconds),
  };
}

export function toAdminReviewWithOptionalVideo(r: PatientReview) {
  return {
    id: r.id,
    status: r.status,
    sortOrder: r.sortOrder,
    authorUserId: r.authorUserId,
    patientDisplayName: r.patientDisplayName,
    title: r.title,
    description: r.description,
    rating: r.rating,
    imageUrl: r.imageUrl,
    imagePublicId: r.imagePublicId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    video: toAdminMuxVideo(r),
  };
}

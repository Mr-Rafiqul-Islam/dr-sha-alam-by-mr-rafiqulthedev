import type {
  PatientReview,
  PatientReviewVideoType,
} from "@prisma/client";

/** Card-safe shape for public listings (no Mux upload/asset secrets). */
export function toPublicReviewCard(r: PatientReview) {
  return {
    id: r.id,
    sortOrder: r.sortOrder,
    patientDisplayName: r.patientDisplayName,
    title: r.title,
    description: r.description,
    rating: r.rating,
    imageUrl: r.imageUrl,
    imagePublicId: r.imagePublicId,
    videoType: r.videoType,
    muxPlaybackId: r.muxPlaybackId,
    muxPlaybackPolicy: r.muxPlaybackPolicy,
    videoThumbnailUrl: r.videoThumbnailUrl,
    videoTitle: r.videoTitle,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export type PublicVideoPayload =
  | {
      type: "MUX";
      muxPlaybackId: string | null;
      muxPlaybackPolicy: string | null;
      thumbnailUrl: string | null;
      videoTitle: string | null;
    }
  | {
      type: "EMBED";
      embed: unknown;
      thumbnailUrl: string | null;
      videoTitle: string | null;
    }
  | {
      type: "DIRECT";
      directUrl: string;
      thumbnailUrl: string | null;
      videoTitle: string | null;
    };

export function toPublicVideoPayload(r: PatientReview): PublicVideoPayload | null {
  const vt = r.videoType as PatientReviewVideoType | null;
  if (!vt) return null;

  switch (vt) {
    case "MUX":
      return {
        type: "MUX",
        muxPlaybackId: r.muxPlaybackId,
        muxPlaybackPolicy: r.muxPlaybackPolicy,
        thumbnailUrl: r.videoThumbnailUrl,
        videoTitle: r.videoTitle,
      };
    case "EMBED":
      return {
        type: "EMBED",
        embed: r.embedPayload,
        thumbnailUrl: r.videoThumbnailUrl,
        videoTitle: r.videoTitle,
      };
    case "DIRECT":
      return {
        type: "DIRECT",
        directUrl: r.directVideoUrl ?? "",
        thumbnailUrl: r.videoThumbnailUrl,
        videoTitle: r.videoTitle,
      };
    default:
      return null;
  }
}

/** Admin-facing video (Mux pipeline ids included for MUX). */
export type AdminVideoPayload =
  | {
      type: "MUX";
      muxPlaybackId: string | null;
      muxPlaybackPolicy: string | null;
      muxUploadId: string | null;
      muxAssetId: string | null;
      thumbnailUrl: string | null;
      videoTitle: string | null;
    }
  | {
      type: "EMBED";
      embed: unknown;
      thumbnailUrl: string | null;
      videoTitle: string | null;
    }
  | {
      type: "DIRECT";
      directUrl: string;
      thumbnailUrl: string | null;
      videoTitle: string | null;
    };

export function toAdminVideoPayload(r: PatientReview): AdminVideoPayload | null {
  const pub = toPublicVideoPayload(r);
  if (!pub) return null;
  if (pub.type === "MUX") {
    return {
      type: "MUX",
      muxPlaybackId: pub.muxPlaybackId,
      muxPlaybackPolicy: pub.muxPlaybackPolicy,
      muxUploadId: r.muxUploadId,
      muxAssetId: r.muxAssetId,
      thumbnailUrl: pub.thumbnailUrl,
      videoTitle: pub.videoTitle,
    };
  }
  return pub;
}

/**
 * Full review for admin UIs: core fields at the top level, playback-ready video
 * (and Mux asset ids) nested under `video`, or `video: null`.
 */
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
    video: toAdminVideoPayload(r),
  };
}

/** One row for GET /patient-reviews/videos aggregate. */
export function toPublicVideoListItem(r: PatientReview) {
  const video = toPublicVideoPayload(r);
  if (!video) return null;
  return {
    reviewId: r.id,
    title: r.title,
    patientDisplayName: r.patientDisplayName,
    sortOrder: r.sortOrder,
    video,
  };
}

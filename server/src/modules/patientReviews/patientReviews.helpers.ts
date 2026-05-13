import {
  PatientReviewStatus,
  PatientReviewVideoType,
  Prisma,
} from "@prisma/client";
import {
  parseAge,
  parseOptionalAge,
  parseRating,
  parseStringArray,
} from "../../utils/parsers.js";

export type PatientReviewVideoSlice = Pick<
  Prisma.PatientReviewCreateInput,
  | "videoType"
  | "muxUploadId"
  | "muxAssetId"
  | "muxPlaybackId"
  | "muxPlaybackPolicy"
  | "videoThumbnailUrl"
  | "videoTitle"
  | "embedPayload"
  | "directVideoUrl"
>;

function parseVideoType(raw: unknown): PatientReviewVideoType | null {
  if (raw == null || raw === "") return null;
  const s = String(raw).toUpperCase();
  if (s === "MUX" || s === "EMBED" || s === "DIRECT") {
    return s as PatientReviewVideoType;
  }
  return null;
}

function parseEmbedPayload(raw: unknown): Prisma.InputJsonValue | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Prisma.InputJsonValue;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") {
    return raw as Prisma.InputJsonValue;
  }
  return null;
}

function emptyVideoData(): PatientReviewVideoSlice {
  return {
    videoType: null,
    muxUploadId: null,
    muxAssetId: null,
    muxPlaybackId: null,
    muxPlaybackPolicy: null,
    videoThumbnailUrl: null,
    videoTitle: null,
    embedPayload: Prisma.JsonNull,
    directVideoUrl: null,
  };
}

export function buildVideoInputFromBody(
  body: Record<string, unknown>,
): PatientReviewVideoSlice {
  const vt = parseVideoType(body.videoType);
  if (!vt) {
    return emptyVideoData();
  }

  const thumb =
    body.videoThumbnailUrl != null
      ? String(body.videoThumbnailUrl).trim() || null
      : null;
  const vTitle =
    body.videoTitle != null ? String(body.videoTitle).trim() || null : null;

  const clearEmbedDirect = {
    embedPayload: Prisma.JsonNull,
    directVideoUrl: null,
  };

  const clearMux = {
    muxUploadId: null,
    muxAssetId: null,
    muxPlaybackId: null,
    muxPlaybackPolicy: null,
  };

  if (vt === "MUX") {
    const playbackPolicyRaw = body.muxPlaybackPolicy;
    const muxPlaybackPolicy =
      playbackPolicyRaw != null && String(playbackPolicyRaw).trim() !== ""
        ? String(playbackPolicyRaw).trim()
        : "signed";

    return {
      videoType: "MUX",
      muxUploadId:
        body.muxUploadId != null ? String(body.muxUploadId).trim() || null : null,
      muxAssetId:
        body.muxAssetId != null ? String(body.muxAssetId).trim() || null : null,
      muxPlaybackId:
        body.muxPlaybackId != null
          ? String(body.muxPlaybackId).trim() || null
          : null,
      muxPlaybackPolicy,
      videoThumbnailUrl: thumb,
      videoTitle: vTitle,
      ...clearEmbedDirect,
    };
  }

  if (vt === "EMBED") {
    const embed = parseEmbedPayload(body.embedPayload ?? body.embed);
    return {
      videoType: "EMBED",
      embedPayload: embed ?? Prisma.JsonNull,
      videoThumbnailUrl: thumb,
      videoTitle: vTitle,
      ...clearMux,
      directVideoUrl: null,
    };
  }

  const url =
    body.directVideoUrl != null ? String(body.directVideoUrl).trim() : "";

  return {
    videoType: "DIRECT",
    directVideoUrl: url || null,
    videoThumbnailUrl: thumb,
    videoTitle: vTitle,
    ...clearMux,
    embedPayload: Prisma.JsonNull,
  };
}

/** Validates embedded payload exists when type is EMBED; DIRECT url non-empty. */
export function validateVideoInput(slice: PatientReviewVideoSlice): string | null {
  if (!slice.videoType) return null;
  if (slice.videoType === "EMBED") {
    if (slice.embedPayload === Prisma.JsonNull) {
      return "embedPayload is required when videoType is EMBED";
    }
  }
  if (slice.videoType === "DIRECT") {
    if (!slice.directVideoUrl?.trim()) {
      return "directVideoUrl is required when videoType is DIRECT";
    }
  }
  return null;
}

export function parseAdminStatus(raw: unknown): PatientReviewStatus {
  const s = String(raw ?? "").toUpperCase();
  if (s === "PENDING") return PatientReviewStatus.PENDING;
  return PatientReviewStatus.ACTIVE;
}

export function parsePatchStatus(raw: unknown): PatientReviewStatus | null {
  const s = String(raw ?? "").toUpperCase();
  if (s === "PENDING") return PatientReviewStatus.PENDING;
  if (s === "ACTIVE") return PatientReviewStatus.ACTIVE;
  return null;
}

/** Admin list filter: all rows, or one DB status. `INACTIVE` aliases `PENDING` (unpublished). */
export type AdminReviewListStatusFilter =
  | { mode: "all" }
  | { mode: "one"; status: PatientReviewStatus };

export function parseAdminReviewListStatus(
  raw: unknown,
): AdminReviewListStatusFilter | null {
  if (raw == null || raw === "") return { mode: "all" };
  const s = String(raw).trim().toUpperCase();
  if (s === "ALL") return { mode: "all" };
  if (s === "ACTIVE") return { mode: "one", status: PatientReviewStatus.ACTIVE };
  if (s === "PENDING" || s === "INACTIVE") {
    return { mode: "one", status: PatientReviewStatus.PENDING };
  }
  return null;
}

/** Admin create: `feature` or `isSuccessStory` truthy → success story. */
export function parseIsSuccessStoryFlag(body: Record<string, unknown>): boolean {
  const raw = body.isSuccessStory ?? body.feature;
  if (raw == null || raw === "") return false;
  if (typeof raw === "boolean") return raw;
  const s = String(raw).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

/** Client GET `type` query and admin list filter. */
export type PatientReviewTypeFilter =
  | { mode: "all" }
  | { mode: "one"; isSuccessStory: boolean };

export function parsePatientReviewTypeQuery(
  raw: unknown,
): PatientReviewTypeFilter | null {
  if (raw == null || raw === "") return { mode: "all" };
  const s = String(raw).trim().toLowerCase();
  if (s === "all") return { mode: "all" };
  if (s === "normal") return { mode: "one", isSuccessStory: false };
  if (s === "success" || s === "successstory" || s === "success_story") {
    return { mode: "one", isSuccessStory: true };
  }
  return null;
}

export function parseIncludeCountsQuery(raw: unknown): boolean {
  if (raw == null || raw === "") return false;
  if (typeof raw === "boolean") return raw;
  const s = String(raw).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

export function buildPatientReviewListWhere(
  statusFilter: AdminReviewListStatusFilter,
  typeFilter: PatientReviewTypeFilter,
): Prisma.PatientReviewWhereInput {
  const where: Prisma.PatientReviewWhereInput = {};
  if (statusFilter.mode === "one") where.status = statusFilter.status;
  if (typeFilter.mode === "one") {
    where.isSuccessStory = typeFilter.isSuccessStory;
  }
  return where;
}

export type CoreReviewKind = "normal" | "successStory";

export type CoreReviewFields = {
  title: string;
  description: string;
  result: string;
  age: number | null;
  rating: number;
  patientDisplayName: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  problems: string[];
  treatments: string[];
  sortOrder: number;
};

export function parseCoreReviewFields(
  body: Record<string, unknown>,
  kind: CoreReviewKind,
):
  | { ok: true; data: CoreReviewFields }
  | { ok: false; message: string } {
  const description = String(body.description ?? "").trim();
  if (!description) {
    return { ok: false, message: "description is required" };
  }

  const rating = parseRating(body.rating);
  if (rating == null) {
    return { ok: false, message: "rating must be an integer 1–5" };
  }

  const patientRaw = body.patientDisplayName;
  const patientDisplayName =
    patientRaw != null && String(patientRaw).trim() !== ""
      ? String(patientRaw).trim()
      : null;

  if (kind === "normal") {
    if (!patientDisplayName) {
      return { ok: false, message: "patientDisplayName is required" };
    }
  }

  const titleRaw = String(body.title ?? "").trim();
  const title =
    kind === "normal"
      ? titleRaw || patientDisplayName!
      : titleRaw;

  if (kind === "successStory" && !title) {
    return { ok: false, message: "title is required" };
  }

  const result = String(body.result ?? "").trim();

  if (kind === "successStory" && !result) {
    return { ok: false, message: "result is required" };
  }

  const problems = parseStringArray(body.problems);
  const treatments = parseStringArray(body.treatments);

  if (kind === "successStory") {
    if (problems.length === 0) {
      return { ok: false, message: "at least one problem is required" };
    }
    if (treatments.length === 0) {
      return { ok: false, message: "at least one treatment is required" };
    }
  } else {
    if (treatments.length === 0) {
      return { ok: false, message: "at least one treatment is required" };
    }
  }

  const age =
    kind === "successStory"
      ? parseAge(body.age)
      : parseOptionalAge(body.age);

  if (kind === "successStory" && age == null) {
    return { ok: false, message: "age must be an integer 0–150" };
  }

  const imageUrl =
    body.imageUrl != null && String(body.imageUrl).trim() !== ""
      ? String(body.imageUrl).trim()
      : null;
  const imagePublicId =
    body.imagePublicId != null && String(body.imagePublicId).trim() !== ""
      ? String(body.imagePublicId).trim()
      : null;

  let sortOrder = 0;
  if (body.sortOrder != null && body.sortOrder !== "") {
    const so = Number(body.sortOrder);
    if (!Number.isFinite(so)) {
      return { ok: false, message: "sortOrder must be a number" };
    }
    sortOrder = Math.trunc(so);
  }

  return {
    ok: true,
    data: {
      title,
      description,
      result,
      patientDisplayName,
      imageUrl,
      imagePublicId,
      problems: kind === "normal" && problems.length === 0 ? [] : problems,
      treatments,
      sortOrder,
      rating,
      age,
    },
  };
}

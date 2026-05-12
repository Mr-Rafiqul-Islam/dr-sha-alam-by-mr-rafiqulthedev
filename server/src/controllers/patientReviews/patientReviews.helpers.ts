import {
  PatientReviewStatus,
  PatientReviewVideoType,
  Prisma,
} from "@prisma/client";

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

export function parseRating(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export function parseAge(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 150) return null;
  return n;
}

export function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x).trim()).filter(Boolean);
}

export function parseOptionalUuid(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  const s = String(raw).trim();
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      s,
    )
  ) {
    return s;
  }
  return undefined;
}

/** Express 5 may surface dynamic segments as `string | string[]`. */
export function routeParamString(
  param: string | string[] | undefined,
): string | undefined {
  if (param === undefined) return undefined;
  const v = Array.isArray(param) ? param[0] : param;
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

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

export type CoreReviewFields = {
  title: string;
  description: string;
  result: string;
  age: number;
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
):
  | { ok: true; data: CoreReviewFields }
  | { ok: false; message: string } {
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const result = String(body.result ?? "").trim();

  if (!title) return { ok: false, message: "title is required" };
  if (!description) return { ok: false, message: "description is required" };
  if (!result) return { ok: false, message: "result is required" };

  const rating = parseRating(body.rating);
  if (rating == null) {
    return { ok: false, message: "rating must be an integer 1–5" };
  }

  const age = parseAge(body.age);
  if (age == null) return { ok: false, message: "age must be an integer 0–150" };

  const patientRaw = body.patientDisplayName;
  const patientDisplayName =
    patientRaw != null && String(patientRaw).trim() !== ""
      ? String(patientRaw).trim()
      : null;

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
      problems: parseStringArray(body.problems),
      treatments: parseStringArray(body.treatments),
      sortOrder,
      rating,
      age,
    },
  };
}

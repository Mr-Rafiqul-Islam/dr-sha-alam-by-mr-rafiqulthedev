/**
 * Mux direct-upload is not wired in this service yet.
 *
 * When integrating with your Core/media API (same contract as your other repo):
 * - MEDIA_SERVICE_BASE_URL — base URL for POST /media/mux/uploads
 * - MEDIA_SERVICE_TOKEN or equivalent auth header your gateway expects
 * - Forward body: title, passthrough, playbackPolicy, imageId, level, access, …
 * - Headers: Content-Type, plus x-admin-id / buildHeaders(...) as in Core
 *
 * Until then, HTTP handlers return 501 with a stable JSON body.
 */
export async function createMuxUploadViaMediaService(_params: {
  title?: string;
  passthrough?: string | null;
  playbackPolicy?: string;
  imageId?: string;
  level?: string | null;
  adminId?: string | null;
  access?: string;
}): Promise<never> {
  throw new Error("MUX_MEDIA_NOT_CONFIGURED");
}

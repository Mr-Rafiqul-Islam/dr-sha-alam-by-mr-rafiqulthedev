function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;

  // Dev default: same-origin requests hit Vite's /api proxy (see vite.config.ts).
  if (import.meta.env.DEV && (url === undefined || url.trim() === "")) {
    return "";
  }

  if (!url?.trim()) {
    throw new Error(
      "VITE_API_URL is not defined. Set it in admin/.env (or leave empty in dev to use the Vite /api proxy).",
    );
  }

  return normalizeBaseUrl(url.trim());
}

function getTinyMceApiKey(): string {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY?.trim();

  if (!apiKey) {
    if (import.meta.env.DEV) {
      return "";
    }

    throw new Error(
      "VITE_TINYMCE_API_KEY is not defined. Set it in admin/.env",
    );
  }

  return apiKey;
}

export const API_BASE_URL = getApiBaseUrl();
export const TINYMCE_API_KEY = getTinyMceApiKey();

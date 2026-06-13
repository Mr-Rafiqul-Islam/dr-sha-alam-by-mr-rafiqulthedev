function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;

  if (!url) {
    throw new Error("VITE_API_URL is not defined. Set it in admin/.env");
  }

  return url.replace(/\/$/, "");
}

function getTinyMceApiKey(): string {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_TINYMCE_API_KEY is not defined. Set it in admin/.env",
    );
  }

  return apiKey;
}

export const API_BASE_URL = getApiBaseUrl();
export const TINYMCE_API_KEY = getTinyMceApiKey();

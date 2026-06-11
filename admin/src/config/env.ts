function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;

  if (!url) {
    throw new Error("VITE_API_URL is not defined. Set it in admin/.env");
  }

  return url.replace(/\/$/, "");
}

export const API_BASE_URL = getApiBaseUrl();

"use server";

import { getApiBaseUrl } from "@/lib/api";
import type {
  SlotDefaultsConfig,
  SlotDefaultsResponse,
} from "@/types/slotDefaults";

const DEFAULT_SITE_REF = "DOCTOR_SHA_ALAM" as const;

export async function getSlotDefaults(
  siteRef: typeof DEFAULT_SITE_REF = DEFAULT_SITE_REF,
): Promise<SlotDefaultsConfig> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${apiBaseUrl}/api/v1/client/appointment-schedules/defaults?siteRef=${encodeURIComponent(siteRef)}`,
    { cache: "no-store" },
  );

  const json = (await response.json()) as SlotDefaultsResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to load slot defaults");
  }

  return json.data;
}

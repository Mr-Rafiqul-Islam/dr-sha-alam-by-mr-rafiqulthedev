import { createHash } from "node:crypto";
import { getCapiConfig } from "../modules/analyticsSettings/analyticsSettings.service.js";

export type MetaCapiUserData = {
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
};

export type MetaCapiCustomData = {
  currency?: string;
  value?: number;
};

export type SendCapiEventParams = {
  eventName: string;
  eventId: string;
  eventTime: number;
  actionSource: "website";
  userData: MetaCapiUserData;
  customData?: MetaCapiCustomData;
};

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (digits.startsWith("880")) {
    return digits;
  }
  if (digits.startsWith("0")) {
    return `880${digits.slice(1)}`;
  }
  return digits;
}

function buildHashedUserData(userData: MetaCapiUserData): Record<string, string | string[]> {
  const hashed: Record<string, string | string[]> = {};

  if (userData.email) {
    const normalized = normalizeEmail(userData.email);
    if (normalized) {
      hashed.em = [hashValue(normalized)];
    }
  }

  if (userData.phone) {
    const normalized = normalizePhone(userData.phone);
    if (normalized) {
      hashed.ph = [hashValue(normalized)];
    }
  }

  if (userData.clientIpAddress) {
    hashed.client_ip_address = userData.clientIpAddress;
  }

  if (userData.clientUserAgent) {
    hashed.client_user_agent = userData.clientUserAgent;
  }

  if (userData.fbc) {
    hashed.fbc = userData.fbc;
  }

  if (userData.fbp) {
    hashed.fbp = userData.fbp;
  }

  return hashed;
}

export async function sendCapiEvent(params: SendCapiEventParams): Promise<void> {
  try {
    const config = await getCapiConfig();

    if (!config.enabled) {
      return;
    }

    if (!config.pixelId || !config.accessToken) {
      return;
    }

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: params.eventName,
          event_time: params.eventTime,
          event_id: params.eventId,
          action_source: params.actionSource,
          user_data: buildHashedUserData(params.userData),
          ...(params.customData ? { custom_data: params.customData } : {}),
        },
      ],
      access_token: config.accessToken,
    };

    if (config.testEventCode) {
      payload.test_event_code = config.testEventCode;
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${config.pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[Meta CAPI] Event failed:", {
        eventName: params.eventName,
        eventId: params.eventId,
        status: response.status,
        body: errorBody,
      });
    }
  } catch (error) {
    console.error("[Meta CAPI] Failed to send event:", {
      eventName: params.eventName,
      eventId: params.eventId,
      error,
    });
  }
}

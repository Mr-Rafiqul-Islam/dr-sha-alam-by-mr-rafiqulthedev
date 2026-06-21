import type { Request, Response } from "express";
import {
  getAnalyticsSetting,
  getClientAnalyticsConfig,
  upsertAnalyticsSetting,
} from "./analyticsSettings.service.js";

function parseOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return undefined;
}

export async function getAnalyticsSettingsHandler(_req: Request, res: Response) {
  try {
    const setting = await getAnalyticsSetting();

    return res.status(200).json({
      success: true,
      data: {
        pixelId: setting?.pixelId ?? null,
        hasToken: Boolean(setting?.accessToken),
        testEventCode: setting?.testEventCode ?? null,
        enabled: setting?.enabled ?? false,
      },
    });
  } catch (error) {
    console.error("Failed to get analytics settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get analytics settings",
    });
  }
}

export async function upsertAnalyticsSettingsHandler(req: Request, res: Response) {
  try {
    const enabled = parseBoolean(req.body.enabled);
    const setting = await upsertAnalyticsSetting({
      pixelId: parseOptionalString(req.body.pixelId) ?? null,
      accessToken: parseOptionalString(req.body.accessToken) ?? null,
      testEventCode: parseOptionalString(req.body.testEventCode) ?? null,
      enabled: enabled ?? false,
    });

    return res.status(200).json({
      success: true,
      message: "Analytics settings updated successfully",
      data: {
        pixelId: setting.pixelId,
        hasToken: Boolean(setting.accessToken),
        testEventCode: setting.testEventCode,
        enabled: setting.enabled,
      },
    });
  } catch (error) {
    console.error("Failed to update analytics settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update analytics settings",
    });
  }
}

export async function getClientAnalyticsConfigHandler(_req: Request, res: Response) {
  try {
    const config = await getClientAnalyticsConfig();

    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Failed to get client analytics config:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get analytics config",
    });
  }
}

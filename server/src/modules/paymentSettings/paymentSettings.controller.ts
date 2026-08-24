import type { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { FULL_ACCESS_ROLES } from "../adminAuth/adminPermissions.js";
import {
  getPaymentSetting,
  upsertPaymentSetting,
} from "./paymentSettings.service.js";

function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed || null;
}

function requireFullAccess(req: Request, res: Response): boolean {
  const role = req.admin?.role;
  if (!role || !FULL_ACCESS_ROLES.has(role as UserRole)) {
    res.status(403).json({
      success: false,
      message: "You do not have permission to update payment settings.",
    });
    return false;
  }
  return true;
}

export async function getPaymentSettingsHandler(_req: Request, res: Response) {
  try {
    const setting = await getPaymentSetting();
    return res.status(200).json({
      success: true,
      data: {
        bkashMerchantQrUrl: setting?.bkashMerchantQrUrl ?? null,
        bkashMerchantQrPublicId: setting?.bkashMerchantQrPublicId ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to get payment settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get payment settings",
    });
  }
}

export async function upsertPaymentSettingsHandler(req: Request, res: Response) {
  if (!requireFullAccess(req, res)) {
    return;
  }

  try {
    const setting = await upsertPaymentSetting({
      bkashMerchantQrUrl: parseOptionalString(req.body.bkashMerchantQrUrl),
      bkashMerchantQrPublicId: parseOptionalString(req.body.bkashMerchantQrPublicId),
    });

    return res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      data: {
        bkashMerchantQrUrl: setting.bkashMerchantQrUrl,
        bkashMerchantQrPublicId: setting.bkashMerchantQrPublicId,
      },
    });
  } catch (error) {
    console.error("Failed to update payment settings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment settings",
    });
  }
}

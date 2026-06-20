import type { User } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";

export type AdminRequestUser = Omit<User, "password">;

declare global {
  namespace Express {
    interface Request {
      /** Authenticated staff user for `/api/v1/admin/*` (JWT `sub` → User id). */
      admin?: AdminRequestUser;
      /** Alias for authenticated admin user (admin auth middleware). */
      user?: AdminRequestUser;
      tokenPayload?: JwtPayload;
    }

    interface Locals {
      activityLog?: import("../modules/activity/activity.middleware.js").ActivityRecordInput | null;
    }
  }
}

export {};

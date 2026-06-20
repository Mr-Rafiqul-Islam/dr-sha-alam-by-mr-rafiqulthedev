import type {
  ActivityAction,
  ActivityEntityType,
  UserRole,
} from "@prisma/client";
import type { AdminRequestUser } from "../../types/express.js";

export type ActivityMetadata = Record<string, unknown>;

export type LogActivityInput = {
  actor: AdminRequestUser;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId?: string | null;
  metadata?: ActivityMetadata;
};

export const TRACEABLE_ROLES = new Set<UserRole>(["SUPPORT", "EDITOR"]);

export type SerializedActivityActor = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

export type SerializedActivityLog = {
  id: string;
  actor: SerializedActivityActor;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string | null;
  summary: string;
  metadata: ActivityMetadata | null;
  createdAt: string;
};

export type TraceableStaffMember = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  activityCount: number;
};

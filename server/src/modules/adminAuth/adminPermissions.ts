import { UserRole } from "@prisma/client";

export const STAFF_PANEL_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.SUPPORT,
  UserRole.CHAMBER,
  UserRole.EDITOR,
]);

export const FULL_ACCESS_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
]);

export type AdminPermission =
  | "dashboard"
  | "appointments"
  | "appointmentSchedules"
  | "contactMessages"
  | "articles"
  | "settings"
  | "analyticsSettings"
  | "deleteApprovals"
  | "adminManagement"
  | "announcements";

const ANALYTICS_SETTINGS_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.MANAGER,
]);

const FRONT_DESK_PERMISSIONS = new Set<AdminPermission>([
  "appointments",
  "appointmentSchedules",
  "contactMessages",
  "announcements",
]);

const EDITOR_PERMISSIONS = new Set<AdminPermission>([
  "articles",
  "announcements",
]);

const ALL_PERMISSIONS: AdminPermission[] = [
  "dashboard",
  "appointments",
  "appointmentSchedules",
  "contactMessages",
  "articles",
  "settings",
  "analyticsSettings",
  "deleteApprovals",
  "adminManagement",
  "announcements",
];

export function isStaffPanelRole(role: UserRole): boolean {
  return STAFF_PANEL_ROLES.has(role);
}

export function canAccessAdminPermission(
  role: UserRole,
  permission: AdminPermission,
): boolean {
  if (permission === "analyticsSettings") {
    return ANALYTICS_SETTINGS_ROLES.has(role);
  }

  if (FULL_ACCESS_ROLES.has(role)) {
    return true;
  }

  if (role === UserRole.SUPPORT || role === UserRole.CHAMBER) {
    return FRONT_DESK_PERMISSIONS.has(permission);
  }

  if (role === UserRole.EDITOR) {
    return EDITOR_PERMISSIONS.has(permission);
  }

  return false;
}

export function getDefaultAdminPath(role: UserRole): string {
  if (role === UserRole.SUPPORT || role === UserRole.CHAMBER) {
    return "/appointments";
  }

  if (role === UserRole.EDITOR) {
    return "/articles";
  }

  return "/dashboard";
}

export function getPermissionsForRole(role: UserRole): AdminPermission[] {
  return ALL_PERMISSIONS.filter((permission) =>
    canAccessAdminPermission(role, permission),
  );
}

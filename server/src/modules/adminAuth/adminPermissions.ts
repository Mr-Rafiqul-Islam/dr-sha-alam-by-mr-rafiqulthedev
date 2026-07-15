import { UserRole } from "@prisma/client";

export const STAFF_PANEL_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.SUPPORT,
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
  | "userManagement";

const ANALYTICS_SETTINGS_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.MANAGER,
]);

/** Staff-user CRUD is limited to Super Admin and Admin (not Manager). */
const USER_MANAGEMENT_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
]);

const SUPPORT_PERMISSIONS = new Set<AdminPermission>([
  "appointments",
  "appointmentSchedules",
  "contactMessages",
]);

const EDITOR_PERMISSIONS = new Set<AdminPermission>(["articles"]);

const ALL_PERMISSIONS: AdminPermission[] = [
  "dashboard",
  "appointments",
  "appointmentSchedules",
  "contactMessages",
  "articles",
  "settings",
  "analyticsSettings",
  "deleteApprovals",
  "userManagement",
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

  if (permission === "userManagement") {
    return USER_MANAGEMENT_ROLES.has(role);
  }

  if (FULL_ACCESS_ROLES.has(role)) {
    return true;
  }

  if (role === UserRole.SUPPORT) {
    return SUPPORT_PERMISSIONS.has(permission);
  }

  if (role === UserRole.EDITOR) {
    return EDITOR_PERMISSIONS.has(permission);
  }

  return false;
}

export function getDefaultAdminPath(role: UserRole): string {
  if (role === UserRole.SUPPORT) {
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

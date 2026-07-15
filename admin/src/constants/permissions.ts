export type StaffRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "SUPPORT"
  | "EDITOR";

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

const ANALYTICS_SETTINGS_ROLES = new Set<string>(["SUPER_ADMIN", "MANAGER"]);

/** Staff-user CRUD is limited to Super Admin and Admin (not Manager). */
const USER_MANAGEMENT_ROLES = new Set<string>(["SUPER_ADMIN", "ADMIN"]);

const STAFF_PANEL_ROLES = new Set<string>([
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "SUPPORT",
  "EDITOR",
]);

const FULL_ACCESS_ROLES = new Set<string>([
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
]);

const SUPPORT_PERMISSIONS = new Set<AdminPermission>([
  "appointments",
  "appointmentSchedules",
  "contactMessages",
]);

const EDITOR_PERMISSIONS = new Set<AdminPermission>(["articles"]);

const PATH_PERMISSIONS: Array<{ prefix: string; permission: AdminPermission }> =
  [
    { prefix: "/dashboard/appointments/schedules", permission: "appointmentSchedules" },
    { prefix: "/dashboard/appointments/slot-defaults", permission: "appointmentSchedules" },
    { prefix: "/appointments", permission: "appointments" },
    { prefix: "/articles", permission: "articles" },
    { prefix: "/contact-messages", permission: "contactMessages" },
    { prefix: "/pending-deletes", permission: "deleteApprovals" },
    { prefix: "/settings", permission: "analyticsSettings" },
    { prefix: "/users", permission: "userManagement" },
    { prefix: "/dashboard", permission: "dashboard" },
  ];

export function isStaffPanelRole(role: string): role is StaffRole {
  return STAFF_PANEL_ROLES.has(role);
}

export function canAccessAdminPermission(
  role: string,
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

  if (role === "SUPPORT") {
    return SUPPORT_PERMISSIONS.has(permission);
  }

  if (role === "EDITOR") {
    return EDITOR_PERMISSIONS.has(permission);
  }

  return false;
}

export function getDefaultPathForRole(role: string): string {
  if (role === "SUPPORT") {
    return "/appointments";
  }

  if (role === "EDITOR") {
    return "/articles";
  }

  return "/dashboard";
}

export function getPermissionForPath(pathname: string): AdminPermission | null {
  const match = PATH_PERMISSIONS.find(({ prefix }) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return match?.permission ?? null;
}

export function canAccessPath(role: string, pathname: string): boolean {
  const permission = getPermissionForPath(pathname);
  if (!permission) {
    return false;
  }

  return canAccessAdminPermission(role, permission);
}

export function resolvePostLoginPath(
  role: string,
  requestedPath?: string | null,
): string {
  if (
    requestedPath &&
    requestedPath !== "/login" &&
    canAccessPath(role, requestedPath)
  ) {
    return requestedPath;
  }

  return getDefaultPathForRole(role);
}

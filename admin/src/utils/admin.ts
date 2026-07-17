import type { StaffRole } from "../constants/permissions";
import type { AdminFilterState, AdminManagedUser } from "../types/admin";

export const STAFF_ROLE_OPTIONS: Array<{ value: StaffRole; label: string }> = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "SUPPORT", label: "Support" },
  { value: "EDITOR", label: "Editor" },
];

export const ADMIN_ONLY_ROLE_OPTIONS = STAFF_ROLE_OPTIONS.filter((option) =>
  option.value === "ADMIN" ||
  option.value === "SUPPORT" ||
  option.value === "EDITOR",
);

export function getAssignableRoles(actorRole: string): Array<{
  value: StaffRole;
  label: string;
}> {
  if (actorRole === "ADMIN") {
    return ADMIN_ONLY_ROLE_OPTIONS;
  }
  return STAFF_ROLE_OPTIONS;
}

export function canManageAdminTarget(
  actorRole: string,
  targetRole: StaffRole,
): boolean {
  if (actorRole === "SUPER_ADMIN" || actorRole === "MANAGER") {
    return true;
  }
  if (actorRole === "ADMIN") {
    return (
      targetRole === "ADMIN" ||
      targetRole === "SUPPORT" ||
      targetRole === "EDITOR"
    );
  }
  return false;
}

export function getRoleLabel(role: StaffRole): string {
  return STAFF_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

export function isAdminUserActive(active: boolean | null | undefined): boolean {
  return active !== false;
}

export function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof (error.data as { message: unknown }).message === "string"
  ) {
    return (error.data as { message: string }).message;
  }
  return fallback;
}

export function filterAdminsClientSide(
  users: AdminManagedUser[],
  filters: AdminFilterState,
): AdminManagedUser[] {
  const search = filters.search.trim().toLowerCase();

  return users.filter((user) => {
    if (filters.role && user.role !== filters.role) {
      return false;
    }

    if (filters.status === "active" && !isAdminUserActive(user.active)) {
      return false;
    }
    if (filters.status === "inactive" && isAdminUserActive(user.active)) {
      return false;
    }

    if (!search) {
      return true;
    }

    const name = user.name?.toLowerCase() ?? "";
    const email = user.email?.toLowerCase() ?? "";
    return name.includes(search) || email.includes(search);
  });
}

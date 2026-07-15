import type { StaffRole } from "../constants/permissions";

export type ManagedUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: StaffRole;
  isActive: boolean;
  provider: string | null;
  providerId: string | null;
  doctorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ManagedUserListResponse = {
  success: boolean;
  data: ManagedUser[];
};

export type ManagedUserResponse = {
  success: boolean;
  message?: string;
  data: ManagedUser;
};

export type CreateManagedUserPayload = {
  name: string;
  email: string;
  phone?: string | null;
  role: StaffRole;
  password: string;
};

export type UpdateManagedUserPayload = {
  id: string;
  name?: string;
  email?: string;
  phone?: string | null;
};

export type UpdateManagedUserRolePayload = {
  id: string;
  role: StaffRole;
};

export type UpdateManagedUserActivePayload = {
  id: string;
  isActive: boolean;
};

export type ResetManagedUserPasswordPayload = {
  id: string;
  password: string;
};

export const STAFF_ROLE_OPTIONS: Array<{ value: StaffRole; label: string }> = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "SUPPORT", label: "Support" },
  { value: "EDITOR", label: "Editor" },
];

export function formatStaffRole(role: StaffRole): string {
  return STAFF_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

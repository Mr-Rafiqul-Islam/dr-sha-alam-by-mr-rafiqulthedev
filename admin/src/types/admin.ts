import type { StaffRole } from "../constants/permissions";

export type AdminManagedUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: StaffRole;
  active: boolean | null;
  provider: string | null;
  providerId: string | null;
  doctorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminFilterState = {
  search: string;
  role: StaffRole | "";
  status: "active" | "inactive" | "";
};

export type CreateAdminPayload = {
  name: string;
  email: string;
  phone?: string | null;
  role: StaffRole;
  password: string;
  active: boolean;
};

export type UpdateAdminPayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: StaffRole;
  password?: string;
};

export type AdminsListResponse = {
  success: boolean;
  data: AdminManagedUser[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};

export type AdminUserResponse = {
  success: boolean;
  message?: string;
  data: AdminManagedUser;
};

export type DeleteAdminResponse = {
  success: boolean;
  message?: string;
};

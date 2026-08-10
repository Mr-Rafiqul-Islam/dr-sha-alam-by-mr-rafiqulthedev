import { Navigate, Outlet } from "react-router";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import {
  canAccessAdminPermission,
  getDefaultPathForRole,
  type AdminPermission,
} from "../../constants/permissions";

type RequireAdminPermissionProps = {
  permission: AdminPermission;
};

export function RequireAdminPermission({ permission }: RequireAdminPermissionProps) {
  const { user } = useAdminAuth();

  if (!user) {
    return null;
  }

  if (!canAccessAdminPermission(user.role, permission)) {
    return <Navigate to={getDefaultPathForRole(user.role)} replace />;
  }

  return <Outlet />;
}

export function RoleDefaultRedirect() {
  const { user } = useAdminAuth();

  return (
    <Navigate
      to={getDefaultPathForRole(user?.role ?? "ADMIN")}
      replace
    />
  );
}

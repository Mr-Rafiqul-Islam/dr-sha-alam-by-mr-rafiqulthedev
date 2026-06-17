import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AdminAuthProvider } from "../../contexts/AdminAuthContext";
import { fetchCurrentAdmin } from "../../lib/adminAuth";
import { PageLoadingFallback } from "../common";

export function RequireAdminAuth() {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<Awaited<ReturnType<typeof fetchCurrentAdmin>> | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function validateSession() {
      try {
        const currentUser = await fetchCurrentAdmin();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    }

    void validateSession();

    return () => {
      active = false;
    };
  }, []);

  if (isChecking) {
    return <PageLoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <AdminAuthProvider initialUser={user}>
      <Outlet />
    </AdminAuthProvider>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCurrentAdmin,
  logoutAdminRequest,
  type AdminUser,
} from "../lib/adminAuth";

type AdminAuthContextValue = {
  user: AdminUser | null;
  isLoading: boolean;
  setUser: (user: AdminUser | null) => void;
  refreshUser: () => Promise<AdminUser | null>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AdminUser | null;
}) {
  const [user, setUser] = useState<AdminUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextUser = await fetchCurrentAdmin();
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutAdminRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      setUser,
      refreshUser,
      logout,
    }),
    [user, isLoading, refreshUser, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

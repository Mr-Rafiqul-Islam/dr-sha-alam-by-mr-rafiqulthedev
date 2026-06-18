import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Icon } from "../common";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { getAdminInitials } from "../../lib/adminAuth";
import {
  mainNavItems,
  type NavItem,
} from "../../constants/navigation";
import { useSidebar } from "../../contexts/SidebarContext";
import { cn } from "../../lib/cn";
import logo from "../../assets/logo.png";

function NavItemLink({
  path,
  label,
  icon,
  collapsed,
  onNavigate,
}: {
  path: string;
  label: string;
  icon: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <li>
      <NavLink
        to={path}
        title={collapsed ? label : undefined}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 py-2 rounded-lg transition-all duration-150 text-label-md font-medium",
            collapsed ? "px-4 lg:justify-center lg:px-2" : "px-4",
            isActive
              ? cn(
                  "bg-primary text-on-primary shadow-[0_0_20px_rgba(0,119,155,0.1)] font-bold",
                  !collapsed && "border-l-4 border-secondary-fixed scale-[0.98]",
                )
              : "text-primary/70 hover:text-primary hover:bg-surface-container-high",
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon name={icon} size={24} filled={isActive} />
            <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}

function NavGroup({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const location = useLocation();
  const isGroupActive =
    location.pathname === item.path ||
    item.children?.some((child) => location.pathname === child.path);

  if (!item.children?.length) {
    return (
      <NavItemLink
        {...item}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-3 py-2 rounded-lg text-label-md font-medium",
          collapsed ? "px-4 lg:justify-center lg:px-2" : "px-4",
          isGroupActive
            ? "text-primary font-bold"
            : "text-primary/70",
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon name={item.icon} size={24} filled={isGroupActive} />
        <span className={cn(collapsed && "lg:sr-only")}>{item.label}</span>
      </div>
      <ul
        className={cn(
          "mt-1 flex flex-col gap-1",
          collapsed ? "lg:hidden" : "ml-7",
        )}
      >
        {item.children.map((child) => (
          <NavItemLink
            key={child.path}
            {...child}
            collapsed={false}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </li>
  );
}

function SidebarUserProfile({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const { user, logout } = useAdminAuth();

  const displayName = user?.name?.trim() || "Admin User";
  const displayEmail = user?.email?.trim() || "admin@example.com";
  const initials = user ? getAdminInitials(user) : "A";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={cn(
        "mt-auto border-t border-outline-variant pt-4",
        collapsed ? "lg:px-1" : "px-2",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          collapsed && "lg:flex-col lg:gap-2 lg:justify-center",
        )}
      >
        <Avatar
          initials={initials}
          size="sm"
          title={collapsed ? displayName : undefined}
        />
        <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
          <p className="text-label-md font-medium text-on-surface truncate">
            {displayName}
          </p>
          <p className="text-label-sm text-on-surface-variant truncate">
            {displayEmail}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          aria-label="Log out"
          className="shrink-0 text-on-surface-variant hover:text-error"
        >
          <Icon name="logout" size={20} />
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();

  const handleNavigate = () => {
    closeMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          onClick={closeMobile}
          aria-label="Close sidebar"
        />
      )}

      <nav
        className={cn(
          "h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-6 z-20 transition-[width,transform] duration-300",
          "w-sidebar-expanded",
          isCollapsed ? "lg:w-sidebar-collapsed" : "lg:w-sidebar-expanded",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:px-2" : "px-4",
        )}
      >
        <div
          className={cn(
            "mb-stack-lg px-4",
            isCollapsed && "lg:px-1 lg:text-center",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-lg bg-primary-container/10 items-center justify-center text-primary-container font-bold text-label-sm",
              isCollapsed ? "hidden lg:flex mx-auto" : "hidden",
            )}
            title="Dr. Shah Alam"
          >
            Dr.
          </div>
          <div className={cn(isCollapsed && "lg:hidden")}>
           <img src={logo} alt="Dr. Shah Alam"/>
          </div>
        </div>

        <ul className="flex flex-col gap-2 grow">
          {mainNavItems.map((item) => (
            <NavGroup
              key={item.path}
              item={item}
              collapsed={isCollapsed}
              onNavigate={handleNavigate}
            />
          ))}
        </ul>

        <SidebarUserProfile collapsed={isCollapsed} />
      </nav>
    </>
  );
}

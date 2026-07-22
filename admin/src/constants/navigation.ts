import type { AdminPermission } from "./permissions";
import { canAccessAdminPermission } from "./permissions";

export type NavItem = {
  path: string;
  label: string;
  icon: string;
  permission?: AdminPermission;
  children?: Array<Omit<NavItem, "children">>;
};

export const mainNavItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
    permission: "dashboard",
  },
  {
    path: "/appointments",
    label: "Appointments",
    icon: "calendar_today",
    permission: "appointments",
    children: [
      {
        path: "/appointments",
        label: "Appointment List",
        icon: "list_alt",
        permission: "appointments",
      },
      {
        path: "/dashboard/appointments/schedules",
        label: "Schedule Management",
        icon: "event_available",
        permission: "appointmentSchedules",
      },
      {
        path: "/dashboard/appointments/slot-defaults",
        label: "Slot Defaults",
        icon: "tune",
        permission: "appointmentSchedules",
      },
    ],
  },
  {
    path: "/articles",
    label: "Articles",
    icon: "article",
    permission: "articles",
  },
  {
    path: "/contact-messages",
    label: "Contact Messages",
    icon: "mail",
    permission: "contactMessages",
  },
  {
    path: "/announcements",
    label: "Announcements",
    icon: "campaign",
    permission: "announcements",
  },
  {
    path: "/pending-deletes",
    label: "Pending Deletes",
    icon: "pending_actions",
    permission: "deleteApprovals",
  },
  {
    path: "/admins",
    label: "Admin Management",
    icon: "manage_accounts",
    permission: "adminManagement",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "settings",
    permission: "analyticsSettings",
  },
];

export function filterNavByRole(role: string, items: NavItem[]): NavItem[] {
  return items
    .map((item) => {
      if (item.children?.length) {
        const children = item.children.filter(
          (child) =>
            !child.permission ||
            canAccessAdminPermission(role, child.permission),
        );

        if (children.length === 0) {
          return null;
        }

        return { ...item, children };
      }

      if (item.permission && !canAccessAdminPermission(role, item.permission)) {
        return null;
      }

      return item;
    })
    .filter((item): item is NavItem => item !== null);
}

export const adminUser = {
  name: "Admin User",
  email: "admin@doctorshahalam.com",
  initials: "A",
};

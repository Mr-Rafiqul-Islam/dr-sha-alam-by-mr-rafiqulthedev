export type NavItem = {
  path: string;
  label: string;
  icon: string;
  children?: Array<Omit<NavItem, "children">>;
};

export const mainNavItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  {
    path: "/appointments",
    label: "Appointments",
    icon: "calendar_today",
    children: [
      { path: "/appointments", label: "Appointment List", icon: "list_alt" },
      {
        path: "/dashboard/appointments/schedules",
        label: "Schedule Management",
        icon: "event_available",
      },
    ],
  },
  { path: "/articles", label: "Articles", icon: "article" },
  { path: "/contact-messages", label: "Contact Messages", icon: "mail" },
];

export const adminUser = {
  name: "Admin User",
  email: "admin@doctorshahalam.com",
  initials: "A",
};

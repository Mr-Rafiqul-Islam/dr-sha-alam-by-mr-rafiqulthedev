export type NavItem = {
  path: string;
  label: string;
  icon: string;
};

export const mainNavItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/appointments", label: "Appointments", icon: "calendar_today" },
  { path: "/reviews", label: "Reviews", icon: "rate_review" },
  { path: "/success-stories", label: "Success Stories", icon: "auto_awesome" },
  { path: "/articles", label: "Articles", icon: "article" },
  { path: "/contact-messages", label: "Contact Messages", icon: "mail" },
];

export const adminUser = {
  name: "Admin User",
  email: "admin@doctorshahalam.com",
  initials: "A",
};

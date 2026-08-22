import { APP_ROUTES } from "@/constants/routes";

export const ADMIN_NAVIGATION_TEXT = {
  brand: "Clinic Portal",
  section: "Admin",
  ariaLabel: "Admin navigation",
} as const;

export const ADMIN_NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: APP_ROUTES.admin,
    exact: true,
  },
  {
    label: "Departments",
    href: APP_ROUTES.adminDepartments,
    exact: false,
  },
] as const;

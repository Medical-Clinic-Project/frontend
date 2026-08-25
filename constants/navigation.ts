import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

import { APP_ROUTES } from "@/constants/routes";

export const ADMIN_NAVIGATION_TEXT = {
  brand: "Clinic Portal",
  section: "Admin",
  ariaLabel: "Admin navigation",

  menuLabel: "Open admin navigation",
  closeMenuLabel: "Close admin navigation",
} as const;

export const ADMIN_NAVIGATION_DRAWER_WIDTH = 280;


export const ADMIN_NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: APP_ROUTES.admin,
    exact: true,

    icon: DashboardOutlinedIcon,

  },
  {
    label: "Departments",
    href: APP_ROUTES.adminDepartments,
    exact: false,

    icon: DomainOutlinedIcon,

  },
  {
    label: "Doctors",
    href: APP_ROUTES.adminDoctors,
    exact: false,
    icon: MedicalServicesOutlinedIcon,
  },
  {
    label: "Patients",
    href: APP_ROUTES.adminPatients,
    exact: false,
    icon: PeopleOutlinedIcon,
  },
] as const;

export const PATIENT_NAVIGATION_TEXT = {
  brand: "Clinic Portal",
  section: "Patient",
  ariaLabel: "Patient navigation",
} as const;

export const PATIENT_NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: APP_ROUTES.patient,
    exact: true,
  },
  {
    label: "Profile",
    href: APP_ROUTES.patientProfile,
    exact: false,
  },
] as const;

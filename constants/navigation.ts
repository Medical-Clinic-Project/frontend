import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
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
  menuLabel: "Open patient navigation",
  closeMenuLabel: "Close patient navigation",
} as const;

export const DOCTOR_NAVIGATION_TEXT = {
  brand: "Clinic Portal",
  section: "Doctor",
  ariaLabel: "Doctor navigation",

  menuLabel: "Open doctor navigation",
  closeMenuLabel: "Close doctor navigation",
} as const;

export const DOCTOR_NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: APP_ROUTES.doctor,
    exact: true,
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Availability",
    href: APP_ROUTES.doctorAvailability,
    exact: false,
    icon: EventAvailableOutlinedIcon,
  },
  {
    label: "Appointments",
    href: APP_ROUTES.doctorAppointments,
    exact: false,
    icon: EventAvailableOutlinedIcon,
  },
] as const;

export const PATIENT_NAVIGATION_ITEMS = [
  {
    label: "Dashboard",
    href: APP_ROUTES.patient,
    exact: true,
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Find a doctor",
    href: APP_ROUTES.patientDoctors,
    exact: false,
    icon: MedicalServicesOutlinedIcon,
  },
  {
    label: "Appointments",
    href: APP_ROUTES.patientAppointments,
    exact: false,
    icon: EventAvailableOutlinedIcon,
  },
  {
    label: "Profile",
    href: APP_ROUTES.patientProfile,
    exact: false,
    icon: PersonOutlineOutlinedIcon,
  },
] as const;

export const ADMIN_DASHBOARD_TEXT = {
  metadataTitle: "Admin dashboard",
  eyebrow: "Admin workspace",
  title: "Clinic overview",
  subtitle: "Monitor the clinic's current activity and appointment trends.",
  loading: "Loading clinic dashboard",
  retry: "Try again",
  errors: {
    load: "Unable to load the clinic dashboard. Please try again.",
  },
  summary: {
    totalPatients: "Total patients",
    totalDoctors: "Total doctors",
    totalDepartments: "Total departments",
    totalAppointments: "Total appointments",
  },
  charts: {
    status: {
      title: "Appointments by status",
      description: "The current distribution of every appointment.",
    },
    department: {
      title: "Appointments by department",
      description: "Appointment volume across clinic departments.",
      seriesLabel: "Appointments",
    },
    overTime: {
      title: "Appointments over time",
      description: "Appointment activity from the last 30 days.",
      seriesLabel: "Appointments",
    },
    empty: "No appointment data is available yet.",
  },
} as const;

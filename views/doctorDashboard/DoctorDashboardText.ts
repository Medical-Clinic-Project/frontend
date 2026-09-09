export const DOCTOR_DASHBOARD_TEXT = {
  metadataTitle: "Doctor dashboard",
  eyebrow: "Doctor workspace",
  title: "Your appointment overview",
  subtitle: "Stay on top of today's visits and your recent appointment activity.",
  loading: "Loading your dashboard",
  retry: "Try again",
  errors: {
    load: "Unable to load your dashboard. Please try again.",
  },
  summary: {
    todayAppointments: "Today's appointments",
    upcomingAppointments: "Upcoming appointments",
    completedAppointments: "Completed appointments",
    cancelledAppointments: "Cancelled appointments",
  },
  charts: {
    status: {
      title: "Appointments by status",
      description: "The status distribution for your appointments.",
    },
    byDay: {
      title: "Appointments by day",
      description: "Your appointment volume across recent days.",
      seriesLabel: "Appointments",
    },
    overTime: {
      title: "Appointments over time",
      description: "Your appointment activity from the last 30 days.",
      seriesLabel: "Appointments",
    },
    empty: "No appointment data is available yet.",
  },
} as const;

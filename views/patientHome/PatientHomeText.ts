export const PATIENT_HOME_TEXT = {
  metadataTitle: "Patient home",
  eyebrow: "Patient workspace",
  greeting: (fullName: string) => `Welcome back, ${fullName}`,
  subtitle: "Manage your next visit or find the right doctor for your care.",
  loading: "Loading your next appointment",
  retry: "Try again",
  errors: {
    load: "Unable to load your next appointment. Please try again.",
  },
  actions: {
    findDoctor: "Find a doctor",
    myAppointments: "My appointments",
    viewAppointment: "View appointment",
  },
  upcoming: {
    title: "Your next appointment",
    doctor: "Doctor",
    department: "Department",
    appointmentTime: "Appointment time",
  },
  empty: {
    title: "No upcoming appointments",
    description: "Find a doctor to book the care you need.",
  },
} as const;

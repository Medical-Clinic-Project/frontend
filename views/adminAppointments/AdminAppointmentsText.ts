import type { AppointmentStatus } from "@/types/appointment";

export const ADMIN_APPOINTMENTS_TEXT = {
  metadataTitle: "Appointment management",
  eyebrow: "Admin workspace",
  title: "Appointments",
  subtitle: "Review clinic appointments, update eligible statuses, and reschedule appointments when needed.",
  loading: "Loading appointments...",
  retry: "Try again",
  table: {
    patient: "Patient",
    doctor: "Doctor",
    department: "Department",
    appointmentTime: "Appointment time",
    status: "Status",
    actions: "Actions",
  },
  statuses: {
    Pending: "Pending",
    Confirmed: "Confirmed",
    Completed: "Completed",
    Cancelled: "Cancelled",
  } satisfies Record<AppointmentStatus, string>,
  filters: {
    searchLabel: "Search appointments",
    searchPlaceholder: "Patient, doctor, email, or department",
    statusLabel: "Status",
    allStatuses: "All statuses",
    doctorLabel: "Doctor",
    allDoctors: "All doctors",
    departmentLabel: "Department",
    allDepartments: "All departments",
    patientLabel: "Patient",
    patientPlaceholder: "Type a patient name or email",
    noPatients: "No matching patients",
    dateLabel: "Appointment date",
    clear: "Clear filters",
  },
  actions: {
    updating: "Updating appointment",
    rescheduling: "Rescheduling appointment",
  },
  empty: {
    title: "No appointments yet",
    description: "Appointments will appear here after patients book them.",
  },
  noResults: {
    title: "No matching appointments",
    description: "Try adjusting or clearing the current filters.",
  },
  statusDialogs: {
    cancel: "Cancel",
    Confirmed: {
      title: "Confirm appointment?",
      description: (patientName: string) =>
        `Confirm the appointment with ${patientName}?`,
      confirm: "Confirm appointment",
    },
    Completed: {
      title: "Complete appointment?",
      description: (patientName: string) =>
        `Mark the appointment with ${patientName} as completed?`,
      confirm: "Complete appointment",
    },
    Cancelled: {
      title: "Cancel appointment?",
      description: (patientName: string) =>
        `Cancel the appointment with ${patientName}? This action cannot be undone.`,
      confirm: "Cancel appointment",
    },
  },
  errors: {
    load: "Unable to load appointments. Please try again.",
    details: "Unable to load appointment details. Please try again.",
    filterOptions: "Unable to load appointment filters. Please try again.",
    patientOptions: "Unable to search patients. Please try again.",
    availability: "Unable to load doctor availability. Please try again.",
    noLongerEligible: "This appointment can no longer be updated.",
    updateStatus: "Unable to update the appointment status. Please try again.",
    reschedule: "Unable to reschedule the appointment. Please try again.",
  },
  feedback: {
    Confirmed: "Appointment confirmed successfully.",
    Completed: "Appointment completed successfully.",
    Cancelled: "Appointment cancelled successfully.",
    rescheduled: "Appointment rescheduled successfully.",
  } satisfies Record<Exclude<AppointmentStatus, "Pending">, string> & {
    rescheduled: string;
  },
  accessibility: {
    tableLabel: "Appointments",
    viewAppointment: (patientName: string) =>
      `View appointment details for ${patientName}`,
    confirmAppointment: (patientName: string) =>
      `Confirm appointment with ${patientName}`,
    completeAppointment: (patientName: string) =>
      `Complete appointment with ${patientName}`,
    cancelAppointment: (patientName: string) =>
      `Cancel appointment with ${patientName}`,
    rescheduleAppointment: (patientName: string) =>
      `Reschedule appointment with ${patientName}`,
  },
} as const;

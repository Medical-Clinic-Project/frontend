import {
  APPOINTMENT_STATUSES,
  DOCTOR_APPOINTMENT_TABS,
} from "@/constants/appointments";
import type { AppointmentStatus } from "@/types/appointment";

export const DOCTOR_APPOINTMENTS_TEXT = {
  metadataTitle: "Appointments",
  eyebrow: "Doctor workspace",
  title: "Appointments",
  subtitle: "Review your schedule and manage the status of assigned appointments.",
  retry: "Try again",
  loading: "Loading appointments...",
  tabs: {
    label: "Appointment categories",
    today: "Today",
    upcoming: "Upcoming",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  table: {
    patient: "Patient",
    appointmentTime: "Appointment time",
    status: "Status",
    reason: "Reason for visit",
    actions: "Actions",
    notProvided: "Not provided",
  },
  actions: {
    view: "View details",
    confirm: "Confirm appointment",
    complete: "Complete appointment",
    cancel: "Cancel appointment",
    confirming: "Confirming appointment",
    completing: "Completing appointment",
    cancelling: "Cancelling appointment",
  },
  empty: {
    [DOCTOR_APPOINTMENT_TABS.TODAY]: {
      title: "No appointments today",
      description: "Appointments scheduled for today will appear here.",
    },
    [DOCTOR_APPOINTMENT_TABS.UPCOMING]: {
      title: "No upcoming appointments",
      description: "Your upcoming pending and confirmed appointments will appear here.",
    },
    [DOCTOR_APPOINTMENT_TABS.COMPLETED]: {
      title: "No completed appointments",
      description: "Completed appointments will appear here.",
    },
    [DOCTOR_APPOINTMENT_TABS.CANCELLED]: {
      title: "No cancelled appointments",
      description: "Cancelled appointments will appear here.",
    },
  },
  statusDialogs: {
    cancel: "Cancel",
    [APPOINTMENT_STATUSES.CONFIRMED]: {
      title: "Confirm appointment?",
      description: (patientName: string) =>
        `Confirm the appointment with ${patientName}?`,
      confirm: "Confirm appointment",
    },
    [APPOINTMENT_STATUSES.COMPLETED]: {
      title: "Complete appointment?",
      description: (patientName: string) =>
        `Mark the appointment with ${patientName} as completed?`,
      confirm: "Complete appointment",
    },
    [APPOINTMENT_STATUSES.CANCELLED]: {
      title: "Cancel appointment?",
      description: (patientName: string) =>
        `Cancel the appointment with ${patientName}? This action cannot be undone.`,
      confirm: "Cancel appointment",
    },
  },
  errors: {
    load: "Unable to load appointments. Please try again.",
    details: "Unable to load appointment details. Please try again.",
    noLongerEligible: "This appointment can no longer be updated.",
    updateStatus: "Unable to update the appointment status. Please try again.",
  },
  feedback: {
    [APPOINTMENT_STATUSES.CONFIRMED]: "Appointment confirmed successfully.",
    [APPOINTMENT_STATUSES.COMPLETED]: "Appointment completed successfully.",
    [APPOINTMENT_STATUSES.CANCELLED]: "Appointment cancelled successfully.",
  } satisfies Record<
    Exclude<AppointmentStatus, typeof APPOINTMENT_STATUSES.PENDING>,
    string
  >,
  accessibility: {
    tableLabel: "Doctor appointments",
    viewAppointment: (patientName: string) =>
      `View appointment details for ${patientName}`,
    confirmAppointment: (patientName: string) =>
      `Confirm appointment with ${patientName}`,
    completeAppointment: (patientName: string) =>
      `Complete appointment with ${patientName}`,
    cancelAppointment: (patientName: string) =>
      `Cancel appointment with ${patientName}`,
  },
} as const;

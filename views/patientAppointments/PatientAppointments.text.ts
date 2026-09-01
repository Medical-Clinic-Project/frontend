export const PATIENT_APPOINTMENTS_TEXT = {
  metadataTitle: "My appointments",
  eyebrow: "Patient workspace",
  title: "My appointments",
  subtitle: "Review your appointments and manage eligible upcoming visits.",
  retry: "Try again",
  tabs: {
    label: "Appointment categories",
    upcoming: "Upcoming",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  empty: {
    upcoming: {
      title: "No upcoming appointments",
      description: "Book a doctor appointment when you are ready.",
    },
    completed: {
      title: "No completed appointments",
      description: "Completed visits will appear here.",
    },
    cancelled: {
      title: "No cancelled appointments",
      description: "Cancelled appointments will appear here.",
    },
  },
  actions: {
    view: "View details",
    reschedule: "Reschedule",
    cancel: "Cancel",
  },
  card: {
    appointmentTime: "Appointment time",
    department: "Department",
  },
  cancelDialog: {
    title: "Cancel appointment?",
    description: (doctorName: string) =>
      `Cancel your appointment with ${doctorName}? This action cannot be undone.`,
    cancel: "Keep appointment",
    confirm: "Cancel appointment",
  },
  errors: {
    load: "Unable to load your appointments. Please try again.",
    details: "Unable to load appointment details. Please try again.",
    cancel: "Unable to cancel the appointment. Please try again.",
    reschedule: "Unable to reschedule the appointment. Please try again.",
    availability: "Unable to load this doctor's availability. Please try again.",
    noLongerEligible: "This appointment can no longer be changed.",
  },
  feedback: {
    cancelled: "Your appointment was cancelled successfully.",
    rescheduled: "Your appointment was rescheduled successfully.",
  },
} as const;

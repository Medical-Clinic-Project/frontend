export const APPOINTMENT_STATUS_VALUES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export const PATIENT_APPOINTMENT_TAB_VALUES = [
  "upcoming",
  "completed",
  "cancelled",
] as const;

export const APPOINTMENT_REASON_MAX_LENGTH = 500;
export const APPOINTMENT_NOTES_MAX_LENGTH = 2000;

export const APPOINTMENT_BOOKING_FORM_FIELDS = [
  "reason",
  "notes",
] as const;

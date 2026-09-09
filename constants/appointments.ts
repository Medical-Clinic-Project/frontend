export const APPOINTMENT_STATUSES = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const APPOINTMENT_STATUS_VALUES = [
  APPOINTMENT_STATUSES.PENDING,
  APPOINTMENT_STATUSES.CONFIRMED,
  APPOINTMENT_STATUSES.COMPLETED,
  APPOINTMENT_STATUSES.CANCELLED,
] as const;

export const ADMIN_APPOINTMENT_SEARCH_DEBOUNCE_MS = 300;

export const PATIENT_APPOINTMENT_TABS = {
  UPCOMING: "upcoming",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PATIENT_APPOINTMENT_TAB_VALUES = [
  PATIENT_APPOINTMENT_TABS.UPCOMING,
  PATIENT_APPOINTMENT_TABS.COMPLETED,
  PATIENT_APPOINTMENT_TABS.CANCELLED,
] as const;

export const DOCTOR_APPOINTMENT_TABS = {
  TODAY: "today",
  UPCOMING: PATIENT_APPOINTMENT_TABS.UPCOMING,
  COMPLETED: PATIENT_APPOINTMENT_TABS.COMPLETED,
  CANCELLED: PATIENT_APPOINTMENT_TABS.CANCELLED,
} as const;

export const DOCTOR_APPOINTMENT_TAB_VALUES = [
  DOCTOR_APPOINTMENT_TABS.TODAY,
  DOCTOR_APPOINTMENT_TABS.UPCOMING,
  DOCTOR_APPOINTMENT_TABS.COMPLETED,
  DOCTOR_APPOINTMENT_TABS.CANCELLED,
] as const;

export const DOCTOR_APPOINTMENT_GRID_FIELDS = {
  patientName: "patientName",
  appointmentTime: "startTime",
  status: "status",
  reason: "reason",
  actions: "actions",
} as const;

export const DOCTOR_APPOINTMENT_GRID_COLUMN_WIDTHS = {
  patientName: 220,
  appointmentTime: 220,
  status: 130,
  reason: 240,
  actions: 150,
} as const;

export const ADMIN_APPOINTMENT_GRID_FIELDS = {
  patientName: "patientName",
  doctorName: "doctorName",
  departmentName: "departmentName",
  appointmentTime: "startTime",
  status: "status",
  actions: "actions",
} as const;

export const ADMIN_APPOINTMENT_GRID_COLUMN_WIDTHS = {
  patientName: 190,
  doctorName: 190,
  departmentName: 160,
  appointmentTime: 220,
  status: 130,
  actions: 210,
} as const;

type AdminAppointmentStatusActionConfig = {
  status: Exclude<
    (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES],
    typeof APPOINTMENT_STATUSES.PENDING
  >;
  icon: "confirm" | "complete" | "cancel";
  labelKey:
    | "confirmAppointment"
    | "completeAppointment"
    | "cancelAppointment";
};

export const ADMIN_APPOINTMENT_STATUS_ACTION_CONFIGS = [
  {
    status: APPOINTMENT_STATUSES.CONFIRMED,
    icon: "confirm",
    labelKey: "confirmAppointment",
  },
  {
    status: APPOINTMENT_STATUSES.COMPLETED,
    icon: "complete",
    labelKey: "completeAppointment",
  },
  {
    status: APPOINTMENT_STATUSES.CANCELLED,
    icon: "cancel",
    labelKey: "cancelAppointment",
  },
] as const satisfies readonly AdminAppointmentStatusActionConfig[];

export const APPOINTMENT_REASON_MAX_LENGTH = 500;
export const APPOINTMENT_NOTES_MAX_LENGTH = 2000;

export const APPOINTMENT_BOOKING_FORM_FIELDS = [
  "reason",
  "notes",
] as const;

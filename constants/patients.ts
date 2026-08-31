import type { PatientProfileFormValues } from "@/utils/validation/patientProfileValidation";

export const PATIENT_STATUS_FILTERS = {
  all: "all",
  active: "active",
  inactive: "inactive",
} as const;

export const PATIENT_PROFILE_FIELDS = ["fullName", "email"] as const satisfies readonly (
  keyof PatientProfileFormValues
)[];

export const PATIENT_GRID_FIELDS = {
  fullName: "fullName",
  email: "email",
  status: "isActive",
  actions: "actions",
} as const;

export const PATIENT_GRID_COLUMN_WIDTHS = {
  fullName: 220,
  email: 240,
  status: 130,
  actions: 112,
} as const;

export const PATIENT_SEARCH_DEBOUNCE_MS = 300;

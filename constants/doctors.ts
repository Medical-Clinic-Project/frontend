import type {
  CreateDoctorFormValues,
  UpdateDoctorFormValues,
} from "@/utils/validation/doctorValidation";

export const CREATE_DOCTOR_FORM_FIELDS = [
  "fullName",
  "email",
  "password",
  "departmentId",
] as const satisfies readonly (keyof CreateDoctorFormValues)[];

export const UPDATE_DOCTOR_FORM_FIELDS = [
  "fullName",
  "email",
  "departmentId",
] as const satisfies readonly (keyof UpdateDoctorFormValues)[];

export const EMPTY_CREATE_DOCTOR_FORM_VALUES: CreateDoctorFormValues = {
  mode: "create",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  departmentId: 0,
};

export const DOCTOR_GRID_FIELDS = {
  fullName: "fullName",
  email: "email",
  department: "department",
  status: "isActive",
  actions: "actions",
} as const;

export const DOCTOR_GRID_COLUMN_WIDTHS = {
  fullName: 220,
  email: 240,
  department: 180,
  status: 130,
  actions: 112,
} as const;

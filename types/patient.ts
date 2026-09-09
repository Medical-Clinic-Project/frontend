import { z } from "zod";
import { PATIENT_STATUS_FILTERS } from "@/constants/patients";

export const patientStatusFilterSchema = z.enum([
  PATIENT_STATUS_FILTERS.all,
  PATIENT_STATUS_FILTERS.active,
  PATIENT_STATUS_FILTERS.inactive,
]);

export const patientSchema = z.object({
  id: z.number().int().positive(),
  fullName: z.string(),
  email: z.string(),
  isActive: z.boolean(),
});

export const patientsSchema = z.array(patientSchema);

export type Patient = z.infer<typeof patientSchema>;
export type PatientStatusFilter =
  (typeof PATIENT_STATUS_FILTERS)[keyof typeof PATIENT_STATUS_FILTERS];

export interface PatientQuery {
  search?: string;
  isActive?: boolean;
}

export type UpdatePatientRequest =
  | {
      fullName: string;
      email: string;
      isActive?: never;
    }
  | {
      fullName?: never;
      email?: never;
      isActive: boolean;
    };

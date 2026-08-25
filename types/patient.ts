import { z } from "zod";

export const PATIENT_STATUS_FILTERS = ["all", "active", "inactive"] as const;

export const patientStatusFilterSchema = z.enum(PATIENT_STATUS_FILTERS);

export const patientSchema = z.object({
  id: z.number().int().positive(),
  fullName: z.string(),
  email: z.string(),
  isActive: z.boolean(),
});

export const patientsSchema = z.array(patientSchema);

export type Patient = z.infer<typeof patientSchema>;
export type PatientStatusFilter = z.infer<typeof patientStatusFilterSchema>;

export interface PatientQuery {
  search?: string;
  isActive?: boolean;
}

export interface UpdatePatientStatusRequest {
  isActive: boolean;
}

export interface UpdatePatientProfileRequest {
  fullName: string;
  email: string;
}

import { z } from "zod";

export const patientDoctorSchema = z.object({
  id: z.number().int().positive(),
  fullName: z.string(),
  departmentId: z.number().int().positive(),
  departmentName: z.string(),
});

export const patientDoctorsSchema = z.array(patientDoctorSchema);

export type PatientDoctor = z.infer<typeof patientDoctorSchema>;

export interface PatientDoctorQuery {
  search?: string;
  departmentId?: number;
}

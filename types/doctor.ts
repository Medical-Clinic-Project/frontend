import { z } from "zod";
import { departmentSchema } from "@/types/department";

export const doctorSchema = z.object({
  id: z.number().int().positive(),
  fullName: z.string(),
  email: z.string(),
  departmentId: z.number().int().positive(),
  department: departmentSchema,
  isActive: z.boolean(),
});

export const doctorsSchema = z.array(doctorSchema);

export type Doctor = z.infer<typeof doctorSchema>;

export interface CreateDoctorRequest {
  fullName: string;
  email: string;
  password: string;
  departmentId: number;
}

export interface UpdateDoctorRequest {
  fullName: string;
  email: string;
  departmentId: number;
  isActive: boolean;
}

export interface DoctorQuery {
  search?: string;
  departmentId?: number;
}

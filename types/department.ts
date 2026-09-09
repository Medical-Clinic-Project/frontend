import { z } from "zod";

export const departmentSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
});

export const departmentsSchema = z.array(departmentSchema);

export type Department = z.infer<typeof departmentSchema>;

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export type UpdateDepartmentRequest = CreateDepartmentRequest;

export interface UpdateDepartmentStatusRequest {
  isActive: boolean;
}

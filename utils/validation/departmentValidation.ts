import { z } from "zod";
import { DEPARTMENTS_TEXT } from "@/views/departments/DepartmentsText";

export const departmentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, DEPARTMENTS_TEXT.validation.nameRequired)
    .min(2, DEPARTMENTS_TEXT.validation.nameMinimum)
    .max(100, DEPARTMENTS_TEXT.validation.nameMaximum),
  description: z
    .string()
    .trim()
    .max(500, DEPARTMENTS_TEXT.validation.descriptionMaximum),
  isActive: z.boolean(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

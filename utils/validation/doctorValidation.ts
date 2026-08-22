import { z } from "zod";
import { PASSWORD_TEXT } from "@/constants/password";
import {
  confirmPasswordSchema,
  passwordSchema,
  passwordsMatch,
} from "@/utils/validation/passwordValidation";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

const doctorProfileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, DOCTORS_TEXT.validation.fullNameRequired)
    .min(2, DOCTORS_TEXT.validation.fullNameMinimum)
    .max(100, DOCTORS_TEXT.validation.fullNameMaximum),
  email: z
    .string()
    .trim()
    .min(1, DOCTORS_TEXT.validation.emailRequired)
    .email(DOCTORS_TEXT.validation.emailInvalid)
    .max(150, DOCTORS_TEXT.validation.emailMaximum),
  departmentId: z
    .number()
    .int(DOCTORS_TEXT.validation.departmentRequired)
    .positive(DOCTORS_TEXT.validation.departmentRequired),
});

export const createDoctorFormSchema = doctorProfileFormSchema
  .extend({
    mode: z.literal("create"),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine(passwordsMatch, {
    path: ["confirmPassword"],
    message: PASSWORD_TEXT.validation.passwordsMismatch,
  });

export const updateDoctorFormSchema = doctorProfileFormSchema.extend({
  mode: z.literal("edit"),
});

export const doctorFormSchema = z.discriminatedUnion("mode", [
  createDoctorFormSchema,
  updateDoctorFormSchema,
]);

export type CreateDoctorFormValues = z.infer<typeof createDoctorFormSchema>;
export type UpdateDoctorFormValues = z.infer<typeof updateDoctorFormSchema>;
export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

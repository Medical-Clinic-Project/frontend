import { z } from "zod";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfile.text";

export const patientProfileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, PATIENT_PROFILE_TEXT.validation.fullNameRequired)
    .min(2, PATIENT_PROFILE_TEXT.validation.fullNameMinimum)
    .max(100, PATIENT_PROFILE_TEXT.validation.fullNameMaximum),
  email: z
    .string()
    .trim()
    .min(1, PATIENT_PROFILE_TEXT.validation.emailRequired)
    .email(PATIENT_PROFILE_TEXT.validation.emailInvalid)
    .max(150, PATIENT_PROFILE_TEXT.validation.emailMaximum),
});

export type PatientProfileFormValues = z.infer<
  typeof patientProfileFormSchema
>;

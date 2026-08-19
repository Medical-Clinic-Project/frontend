import { z } from "zod";
import { REGISTER_TEXT } from "@/views/auth/register/Register.text";

export const PASSWORD_REQUIREMENTS = [
  {
    key: "minimumLength",
    test: (password: string) => password.length >= 8,
  },
  {
    key: "uppercase",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    key: "number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    key: "specialCharacter",
    test: (password: string) => /[^a-zA-Z0-9]/.test(password),
  },
] as const;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, REGISTER_TEXT.validation.fullNameRequired)
      .min(2, REGISTER_TEXT.validation.fullNameMinimum)
      .max(100, REGISTER_TEXT.validation.fullNameMaximum),
    email: z
      .string()
      .trim()
      .min(1, REGISTER_TEXT.validation.emailRequired)
      .email(REGISTER_TEXT.validation.emailInvalid)
      .max(150, REGISTER_TEXT.validation.emailMaximum),
    password: z
      .string()
      .min(1, REGISTER_TEXT.validation.passwordRequired)
      .min(8, REGISTER_TEXT.validation.passwordRequirements)
      .max(100, REGISTER_TEXT.validation.passwordMaximum)
      .regex(/[A-Z]/, REGISTER_TEXT.validation.passwordRequirements)
      .regex(/[a-z]/, REGISTER_TEXT.validation.passwordRequirements)
      .regex(/[0-9]/, REGISTER_TEXT.validation.passwordRequirements)
      .regex(/[^a-zA-Z0-9]/, REGISTER_TEXT.validation.passwordRequirements),
    confirmPassword: z
      .string()
      .min(1, REGISTER_TEXT.validation.confirmPasswordRequired),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: REGISTER_TEXT.validation.passwordsMismatch,
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

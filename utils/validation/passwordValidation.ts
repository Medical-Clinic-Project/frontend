import { z } from "zod";
import { PASSWORD_TEXT } from "@/constants/password";

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

export const passwordSchema = z
  .string()
  .min(1, PASSWORD_TEXT.validation.passwordRequired)
  .max(100, PASSWORD_TEXT.validation.passwordMaximum)
  .refine(
    (password) =>
      PASSWORD_REQUIREMENTS.every((requirement) => requirement.test(password)),
    { message: PASSWORD_TEXT.validation.passwordRequirements },
  );

export const confirmPasswordSchema = z
  .string()
  .min(1, PASSWORD_TEXT.validation.confirmPasswordRequired);

export function passwordsMatch(values: {
  password: string;
  confirmPassword: string;
}): boolean {
  return values.password === values.confirmPassword;
}

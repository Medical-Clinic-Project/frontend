import { z } from "zod";
import { LOGIN_TEXT } from "@/views/auth/login/Login.text";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, LOGIN_TEXT.validation.emailRequired)
    .email(LOGIN_TEXT.validation.emailInvalid),
  password: z.string().min(1, LOGIN_TEXT.validation.passwordRequired),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

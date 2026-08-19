"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authApi } from "@/api/authApi";
import { APP_ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/api";
import { toAuthSession } from "@/types/auth";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import { REGISTER_TEXT } from "@/views/auth/register/Register.text";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/views/auth/register/registerValidation";

const REGISTER_FIELDS = ["fullName", "email", "password"] as const;

export function useRegister() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    form.clearErrors();

    try {
      const response = await authApi.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      setSession(toAuthSession(response));
      router.replace(APP_ROUTES.patient);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setFormError(REGISTER_TEXT.fallbackError);
        return;
      }

      if (error.status === 400) {
        const mappedFieldError = applyApiFieldErrors<RegisterFormValues>(
          error.fieldErrors,
          form.setError,
          REGISTER_FIELDS,
        );

        if (!mappedFieldError) {
          setFormError(error.message);
        }
        return;
      }

      if (error.status === 409) {
        applyApiFieldErrors<RegisterFormValues>(
          { email: [error.message] },
          form.setError,
          ["email"],
        );
        return;
      }

      setFormError(error.message);
    }
  });

  return {
    form,
    formError,
    onSubmit,
  };
}

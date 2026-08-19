"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authApi } from "@/api/authApi";
import { ROLE_HOME } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/api";
import { toAuthSession } from "@/types/auth";
import { applyApiFieldErrors } from "@/utils/forms/applyApiFieldErrors";
import { LOGIN_TEXT } from "@/views/auth/login/Login.text";
import {
  loginSchema,
  type LoginFormValues,
} from "@/views/auth/login/loginValidation";

const LOGIN_FIELDS = ["email", "password"] as const;

export function useLogin() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    form.clearErrors();

    try {
      const response = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      });

      setSession(toAuthSession(response));
      router.replace(ROLE_HOME[response.role]);
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setFormError(LOGIN_TEXT.fallbackError);
        return;
      }

      if (error.status === 400) {
        const mappedFieldError = applyApiFieldErrors<LoginFormValues>(
          error.fieldErrors,
          form.setError,
          LOGIN_FIELDS,
        );

        if (!mappedFieldError) {
          setFormError(error.message);
        }
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

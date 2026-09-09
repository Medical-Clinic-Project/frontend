"use client";

import { Alert, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { PublicOnly } from "@/components/auth/PublicOnly";
import NextLink from "@/components/navigation/NextLink";
import { APP_ROUTES } from "@/constants/routes";
import { LOGIN_TEXT } from "@/views/auth/login/Login.text";
import { useLogin } from "@/views/auth/login/useLogin";

export function Login() {
  const { form, formError, onSubmit } = useLogin();
  const { errors, isSubmitting } = form.formState;

  return (
    <PublicOnly>
      <AuthShell
        brand={LOGIN_TEXT.brand}
        title={LOGIN_TEXT.title}
        subtitle={LOGIN_TEXT.subtitle}
      >
        <Stack component="form" spacing={3} onSubmit={onSubmit} noValidate>
          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label={LOGIN_TEXT.emailLabel}
            type="email"
            autoComplete="email"
            autoFocus
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...form.register("email")}
          />

          <PasswordField
            label={LOGIN_TEXT.passwordLabel}
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...form.register("password")}
          />

          <Button type="submit" size="large" loading={isSubmitting}>
            {LOGIN_TEXT.submit}
          </Button>

          <Typography align="center" color="text.secondary">
            {LOGIN_TEXT.registerPrompt}{" "}
            <Link component={NextLink} href={APP_ROUTES.register}>
              {LOGIN_TEXT.registerAction}
            </Link>
          </Typography>
        </Stack>
      </AuthShell>
    </PublicOnly>
  );
}

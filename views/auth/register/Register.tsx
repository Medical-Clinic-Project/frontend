"use client";

import { Alert, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { PublicOnly } from "@/components/auth/PublicOnly";
import NextLink from "@/components/navigation/NextLink";
import { APP_ROUTES } from "@/constants/routes";
import { REGISTER_TEXT } from "@/views/auth/register/RegisterText";
import { useRegister } from "@/views/auth/register/useRegister";

export function Register() {
  const { form, formError, onSubmit } = useRegister();
  const { errors, isSubmitting } = form.formState;
  const password = form.watch("password");

  return (
    <PublicOnly>
      <AuthShell
        brand={REGISTER_TEXT.brand}
        title={REGISTER_TEXT.title}
        subtitle={REGISTER_TEXT.subtitle}
      >
        <Stack component="form" spacing={3} onSubmit={onSubmit} noValidate>
          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label={REGISTER_TEXT.fullNameLabel}
            autoComplete="name"
            autoFocus
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
            {...form.register("fullName")}
          />

          <TextField
            label={REGISTER_TEXT.emailLabel}
            type="email"
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...form.register("email")}
          />

          <Stack spacing={1}>
            <PasswordField
              label={REGISTER_TEXT.passwordLabel}
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...form.register("password")}
            />
            <PasswordRequirements password={password} />
          </Stack>

          <PasswordField
            label={REGISTER_TEXT.confirmPasswordLabel}
            autoComplete="new-password"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />

          <Button type="submit" size="large" loading={isSubmitting}>
            {REGISTER_TEXT.submit}
          </Button>

          <Typography align="center" color="text.secondary">
            {REGISTER_TEXT.loginPrompt}{" "}
            <Link component={NextLink} href={APP_ROUTES.login}>
              {REGISTER_TEXT.loginAction}
            </Link>
          </Typography>
        </Stack>
      </AuthShell>
    </PublicOnly>
  );
}

import { Stack, Typography } from "@mui/material";
import { REGISTER_TEXT } from "@/views/auth/register/Register.text";
import { PASSWORD_REQUIREMENTS } from "@/views/auth/register/registerValidation";

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <Stack
      component="ul"
      spacing={0.5}
      aria-label="Password requirements"
      sx={{ pl: 2.5, m: 0 }}
    >
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const isMet = requirement.test(password);

        return (
          <Typography
            component="li"
            variant="body2"
            color={isMet ? "success.main" : "text.secondary"}
            key={requirement.key}
          >
            {isMet ? "✓" : "•"} {REGISTER_TEXT.passwordRequirements[requirement.key]}
          </Typography>
        );
      })}
    </Stack>
  );
}

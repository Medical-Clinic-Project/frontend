import CheckCircle from "@mui/icons-material/CheckCircle";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import { List, ListItem, Stack, Typography } from "@mui/material";
import { AUTH_TEXT } from "@/views/auth/AuthText";
import { REGISTER_TEXT } from "@/views/auth/register/RegisterText";
import { PASSWORD_REQUIREMENTS } from "@/views/auth/register/registerValidation";

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <List dense disablePadding aria-label={AUTH_TEXT.passwordRequirements}>
      {PASSWORD_REQUIREMENTS.map((requirement) => {
        const isMet = requirement.test(password);
        const requirementLabel = REGISTER_TEXT.passwordRequirements[requirement.key];

        return (
          <ListItem
            alignItems="center"
            disableGutters
            aria-label={`${requirementLabel}: ${
              isMet
                ? AUTH_TEXT.passwordRequirementStatus.met
                : AUTH_TEXT.passwordRequirementStatus.notMet
            }`}
            key={requirement.key}
          >
            <Stack direction="row" spacing={1}>
              {isMet ? (
                <CheckCircle color="success" fontSize="small" aria-hidden />
              ) : (
                <RadioButtonUnchecked color="disabled" fontSize="small" aria-hidden />
              )}
              <Typography
                variant="body2"
                color={isMet ? "success.main" : "text.secondary"}
              >
                {requirementLabel}
              </Typography>
            </Stack>
          </ListItem>
        );
      })}
    </List>
  );
}

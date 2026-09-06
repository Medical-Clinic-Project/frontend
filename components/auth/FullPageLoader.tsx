import { CircularProgress, Stack, Typography } from "@mui/material";
import { AUTH_TEXT } from "@/views/auth/AuthText";

export function FullPageLoader({ label = AUTH_TEXT.loadingSession }: { label?: string }) {
  return (
    <Stack
      spacing={2}
      role="status"
      sx={{
        minHeight: "100dvh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={32} />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

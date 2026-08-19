import { CircularProgress, Stack, Typography } from "@mui/material";

export function FullPageLoader({ label = "Loading your session…" }: { label?: string }) {
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

import { Stack, Typography } from "@mui/material";

interface DashboardChartEmptyStateProps {
  message: string;
}

export function DashboardChartEmptyState({ message }: DashboardChartEmptyStateProps) {
  return (
    <Stack
      role="status"
      sx={{
        minHeight: 280,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">{message}</Typography>
    </Stack>
  );
}

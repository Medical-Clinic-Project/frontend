import { Paper, Skeleton, Stack } from "@mui/material";
import { DEPARTMENTS_TEXT } from "@/views/departments/DepartmentsText";

export function DepartmentsDataGridSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={DEPARTMENTS_TEXT.loading}
      aria-live="polite"
      aria-busy="true"
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
      </Stack>
    </Paper>
  );
}

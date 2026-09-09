import { Paper, Skeleton, Stack } from "@mui/material";

interface TableSkeletonProps {
  label: string;
  rows?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  label,
  rows = 3,
  showHeader = false,
}: TableSkeletonProps) {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        {showHeader && <Skeleton variant="rounded" height={40} />}
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={64} />
        ))}
      </Stack>
    </Paper>
  );
}

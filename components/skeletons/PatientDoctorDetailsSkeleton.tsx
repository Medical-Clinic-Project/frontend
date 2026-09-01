import { Paper, Skeleton, Stack } from "@mui/material";

export function PatientDoctorDetailsSkeleton() {
  return (
    <Paper variant="outlined" role="status" aria-live="polite" aria-busy="true">
      <Stack spacing={2} sx={{ p: { xs: 3, sm: 4 } }}>
        <Skeleton variant="text" width="25%" />
        <Skeleton variant="text" width="45%" />
        <Skeleton variant="rounded" width={140} height={28} />
      </Stack>
    </Paper>
  );
}

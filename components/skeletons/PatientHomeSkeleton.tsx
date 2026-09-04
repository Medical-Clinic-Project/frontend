import { Card, CardContent, Skeleton, Stack } from "@mui/material";

export function PatientHomeSkeleton() {
  return (
    <Card role="status" aria-live="polite" aria-busy="true">
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="35%" />
          <Skeleton variant="text" width="50%" height={36} />
          <Skeleton variant="rounded" width="28%" height={24} />
          <Skeleton variant="text" width="65%" />
          <Skeleton variant="text" width="45%" />
        </Stack>
      </CardContent>
    </Card>
  );
}

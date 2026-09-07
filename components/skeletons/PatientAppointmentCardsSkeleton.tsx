import { Card, CardContent, Skeleton, Stack } from "@mui/material";

export function PatientAppointmentCardsSkeleton() {
  return (
    <Stack spacing={2} role="status" aria-live="polite" aria-busy="true">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="35%" />
              <Skeleton variant="rounded" width="45%" height={24} />
              <Skeleton variant="rounded" width="30%" height={24} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

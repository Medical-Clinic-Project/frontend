import { Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";

interface DashboardSkeletonProps {
  label: string;
}

export function DashboardSkeleton({ label }: DashboardSkeletonProps) {
  return (
    <Stack spacing={3} role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      <Grid container spacing={3}>
        {Array.from({ length: 4 }, (_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Skeleton variant="text" width="55%" />
                  <Skeleton variant="text" width="35%" height={44} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {Array.from({ length: 3 }, (_, index) => (
          <Grid key={index} size={{ xs: 12, lg: index === 2 ? 12 : 6 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Skeleton variant="text" width="45%" />
                  <Skeleton variant="rounded" height={280} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

import type { SvgIconComponent } from "@mui/icons-material";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";

interface DashboardStatisticCardProps {
  label: string;
  value: number;
  icon: SvgIconComponent;
}

const numberFormatter = new Intl.NumberFormat();

export function DashboardStatisticCard({
  label,
  value,
  icon: Icon,
}: DashboardStatisticCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
        >
          <Stack spacing={0.5}>
            <Typography color="text.secondary" variant="body2">
              {label}
            </Typography>
            <Typography component="p" variant="h3">
              {numberFormatter.format(value)}
            </Typography>
          </Stack>
          <Avatar variant="rounded" sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}>
            <Icon />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

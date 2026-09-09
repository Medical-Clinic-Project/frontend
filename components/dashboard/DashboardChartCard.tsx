import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useId, type ReactNode } from "react";
import { DashboardChartEmptyState } from "@/components/dashboard/DashboardChartEmptyState";

interface DashboardChartCardProps {
  title: string;
  description?: string;
  hasData: boolean;
  emptyMessage: string;
  children: ReactNode;
}

export function DashboardChartCard({
  title,
  description,
  hasData,
  emptyMessage,
  children,
}: DashboardChartCardProps) {
  const titleId = useId();

  return (
    <Card component="section" sx={{ height: "100%" }} aria-labelledby={titleId}>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography id={titleId} component="h2" variant="h4">
              {title}
            </Typography>
            {description && (
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            )}
          </Stack>
          {hasData ? children : <DashboardChartEmptyState message={emptyMessage} />}
        </Stack>
      </CardContent>
    </Card>
  );
}

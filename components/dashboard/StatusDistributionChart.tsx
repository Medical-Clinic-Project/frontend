"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { DashboardChartEmptyState } from "@/components/dashboard/DashboardChartEmptyState";
import type { DashboardStatusCount } from "@/types/dashboard";

interface StatusDistributionChartProps {
  title: string;
  description?: string;
  data: readonly DashboardStatusCount[];
  emptyMessage: string;
}

export function StatusDistributionChart({
  title,
  description,
  data,
  emptyMessage,
}: StatusDistributionChartProps) {
  const theme = useTheme();
  const hasData = data.some((item) => item.count > 0);

  return (
    <DashboardChartCard title={title} description={description}>
      {hasData ? (
        <PieChart
          height={280}
          colors={[
            theme.palette.warning.main,
            theme.palette.primary.main,
            theme.palette.success.main,
            theme.palette.text.secondary,
          ]}
          series={[
            {
              data: data.map((item) => ({
                id: item.status,
                label: item.status,
                value: item.count,
              })),
              cornerRadius: 4,
              innerRadius: 56,
              paddingAngle: 2,
            },
          ]}
        />
      ) : (
        <DashboardChartEmptyState message={emptyMessage} />
      )}
    </DashboardChartCard>
  );
}

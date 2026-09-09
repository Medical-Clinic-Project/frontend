"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material/styles";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { formatDashboardShortDate } from "@/utils/dashboardCharts";

export interface DashboardTimeSeriesPoint {
  date: string;
  value: number;
}

interface TimeSeriesLineChartProps {
  title: string;
  description?: string;
  seriesLabel: string;
  data: readonly DashboardTimeSeriesPoint[];
  emptyMessage: string;
}

export function TimeSeriesLineChart({
  title,
  description,
  seriesLabel,
  data,
  emptyMessage,
}: TimeSeriesLineChartProps) {
  const theme = useTheme();
  const hasData = data.some((item) => item.value > 0);

  return (
    <DashboardChartCard
      title={title}
      description={description}
      hasData={hasData}
      emptyMessage={emptyMessage}
    >
      <LineChart
        height={300}
        colors={[theme.palette.primary.main]}
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: data.map((item) => new Date(item.date)),
            scaleType: "utc",
            valueFormatter: formatDashboardShortDate,
          },
        ]}
        series={[
          {
            data: data.map((item) => item.value),
            label: seriesLabel,
          },
        ]}
      />
    </DashboardChartCard>
  );
}

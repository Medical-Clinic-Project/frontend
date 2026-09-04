"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material/styles";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { DashboardChartEmptyState } from "@/components/dashboard/DashboardChartEmptyState";

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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function formatDate(value: Date | number): string {
  return dateFormatter.format(value);
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
    <DashboardChartCard title={title} description={description}>
      {hasData ? (
        <LineChart
          height={300}
          colors={[theme.palette.primary.main]}
          grid={{ horizontal: true }}
          xAxis={[
            {
              data: data.map((item) => new Date(item.date)),
              scaleType: "utc",
              valueFormatter: formatDate,
            },
          ]}
          series={[
            {
              data: data.map((item) => item.value),
              label: seriesLabel,
            },
          ]}
        />
      ) : (
        <DashboardChartEmptyState message={emptyMessage} />
      )}
    </DashboardChartCard>
  );
}

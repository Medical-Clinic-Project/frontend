"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { DashboardChartCard } from "@/components/dashboard/DashboardChartCard";
import { DashboardChartEmptyState } from "@/components/dashboard/DashboardChartEmptyState";
import { getDashboardCategoryColors } from "@/components/dashboard/chartColors";

export interface DashboardCountCategory {
  label: string;
  value: number;
}

interface CountBarChartProps {
  title: string;
  description?: string;
  seriesLabel: string;
  data: readonly DashboardCountCategory[];
  emptyMessage: string;
  colorByCategory?: boolean;
}

export function CountBarChart({
  title,
  description,
  seriesLabel,
  data,
  emptyMessage,
  colorByCategory = false,
}: CountBarChartProps) {
  const theme = useTheme();
  const hasData = data.some((item) => item.value > 0);
  const categories = data.map((item) => item.label);
  const categoryColors = colorByCategory
    ? getDashboardCategoryColors(theme, categories)
    : undefined;

  return (
    <DashboardChartCard title={title} description={description}>
      {hasData ? (
        <BarChart
          height={280}
          colors={[theme.palette.secondary.main]}
          grid={{ horizontal: true }}
          xAxis={[
            {
              data: categories,
              scaleType: "band",
              colorMap: categoryColors
                ? {
                    type: "ordinal",
                    values: categories,
                    colors: categoryColors,
                  }
                : undefined,
            },
          ]}
          series={[{ data: data.map((item) => item.value), label: seriesLabel }]}
        />
      ) : (
        <DashboardChartEmptyState message={emptyMessage} />
      )}
    </DashboardChartCard>
  );
}

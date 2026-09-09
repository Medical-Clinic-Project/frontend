const dashboardShortDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatDashboardShortDate(value: Date | number): string {
  return dashboardShortDateFormatter.format(value);
}

"use client";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import { Alert, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { CountBarChart } from "@/components/dashboard/CountBarChart";
import { DashboardStatisticCard } from "@/components/dashboard/DashboardStatisticCard";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { TimeSeriesLineChart } from "@/components/dashboard/TimeSeriesLineChart";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { formatDashboardShortDate } from "@/utils/dashboardCharts";
import { DOCTOR_DASHBOARD_TEXT } from "@/views/doctorDashboard/DoctorDashboardText";

export function DoctorDashboard() {
  const { dashboard, isLoading, loadError, refreshDashboard } = useDoctorDashboard();

  function renderDashboardContent() {
    if (isLoading) {
      return <DashboardSkeleton label={DOCTOR_DASHBOARD_TEXT.loading} />;
    }

    if (loadError) {
      return (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refreshDashboard()}>
              {DOCTOR_DASHBOARD_TEXT.retry}
            </Button>
          }
        >
          {loadError}
        </Alert>
      );
    }

    if (!dashboard) {
      return <Alert severity="error">{DOCTOR_DASHBOARD_TEXT.errors.load}</Alert>;
    }

    return (
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardStatisticCard
              label={DOCTOR_DASHBOARD_TEXT.summary.todayAppointments}
              value={dashboard.summary.todayAppointments}
              icon={TodayOutlinedIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardStatisticCard
              label={DOCTOR_DASHBOARD_TEXT.summary.upcomingAppointments}
              value={dashboard.summary.upcomingAppointments}
              icon={EventAvailableOutlinedIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardStatisticCard
              label={DOCTOR_DASHBOARD_TEXT.summary.completedAppointments}
              value={dashboard.summary.completedAppointments}
              icon={CheckCircleOutlineOutlinedIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardStatisticCard
              label={DOCTOR_DASHBOARD_TEXT.summary.cancelledAppointments}
              value={dashboard.summary.cancelledAppointments}
              icon={CancelOutlinedIcon}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <StatusDistributionChart
              title={DOCTOR_DASHBOARD_TEXT.charts.status.title}
              description={DOCTOR_DASHBOARD_TEXT.charts.status.description}
              data={dashboard.appointmentsByStatus}
              emptyMessage={DOCTOR_DASHBOARD_TEXT.charts.empty}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }}>
            <CountBarChart
              title={DOCTOR_DASHBOARD_TEXT.charts.byDay.title}
              description={DOCTOR_DASHBOARD_TEXT.charts.byDay.description}
              seriesLabel={DOCTOR_DASHBOARD_TEXT.charts.byDay.seriesLabel}
              data={dashboard.appointmentsByDay.map((item) => ({
                label: formatDashboardShortDate(new Date(item.date)),
                value: item.appointmentCount,
              }))}
              emptyMessage={DOCTOR_DASHBOARD_TEXT.charts.empty}
              colorByCategory
            />
          </Grid>
          <Grid size={12}>
            <TimeSeriesLineChart
              title={DOCTOR_DASHBOARD_TEXT.charts.overTime.title}
              description={DOCTOR_DASHBOARD_TEXT.charts.overTime.description}
              seriesLabel={DOCTOR_DASHBOARD_TEXT.charts.overTime.seriesLabel}
              data={dashboard.appointmentsOverTime.map((item) => ({
                date: item.date,
                value: item.appointmentCount,
              }))}
              emptyMessage={DOCTOR_DASHBOARD_TEXT.charts.empty}
            />
          </Grid>
        </Grid>
      </Stack>
    );
  }

  return (
    <Container component="main" maxWidth="xl">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography variant="subtitle2" color="primary.main">
            {DOCTOR_DASHBOARD_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {DOCTOR_DASHBOARD_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {DOCTOR_DASHBOARD_TEXT.subtitle}
          </Typography>
        </Stack>

        {renderDashboardContent()}
      </Stack>
    </Container>
  );
}

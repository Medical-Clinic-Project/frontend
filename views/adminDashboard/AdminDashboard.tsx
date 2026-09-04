"use client";

import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Alert, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { CountBarChart } from "@/components/dashboard/CountBarChart";
import { DashboardStatisticCard } from "@/components/dashboard/DashboardStatisticCard";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { TimeSeriesLineChart } from "@/components/dashboard/TimeSeriesLineChart";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { ADMIN_DASHBOARD_TEXT } from "@/views/adminDashboard/AdminDashboardText";

export function AdminDashboard() {
  const { dashboard, isLoading, loadError, refreshDashboard } = useAdminDashboard();

  return (
    <Container component="main" maxWidth="xl">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography variant="subtitle2" color="primary.main">
            {ADMIN_DASHBOARD_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {ADMIN_DASHBOARD_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {ADMIN_DASHBOARD_TEXT.subtitle}
          </Typography>
        </Stack>

        {isLoading ? (
          <DashboardSkeleton label={ADMIN_DASHBOARD_TEXT.loading} />
        ) : loadError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void refreshDashboard()}>
                {ADMIN_DASHBOARD_TEXT.retry}
              </Button>
            }
          >
            {loadError}
          </Alert>
        ) : dashboard ? (
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <DashboardStatisticCard
                  label={ADMIN_DASHBOARD_TEXT.summary.totalPatients}
                  value={dashboard.totals.totalPatients}
                  icon={PeopleOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <DashboardStatisticCard
                  label={ADMIN_DASHBOARD_TEXT.summary.totalDoctors}
                  value={dashboard.totals.totalDoctors}
                  icon={MedicalServicesOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <DashboardStatisticCard
                  label={ADMIN_DASHBOARD_TEXT.summary.totalDepartments}
                  value={dashboard.totals.totalDepartments}
                  icon={DomainOutlinedIcon}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <DashboardStatisticCard
                  label={ADMIN_DASHBOARD_TEXT.summary.totalAppointments}
                  value={dashboard.totals.totalAppointments}
                  icon={EventAvailableOutlinedIcon}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <StatusDistributionChart
                  title={ADMIN_DASHBOARD_TEXT.charts.status.title}
                  description={ADMIN_DASHBOARD_TEXT.charts.status.description}
                  data={dashboard.appointmentsByStatus}
                  emptyMessage={ADMIN_DASHBOARD_TEXT.charts.empty}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 7 }}>
                <CountBarChart
                  title={ADMIN_DASHBOARD_TEXT.charts.department.title}
                  description={ADMIN_DASHBOARD_TEXT.charts.department.description}
                  seriesLabel={ADMIN_DASHBOARD_TEXT.charts.department.seriesLabel}
                  data={dashboard.appointmentsByDepartment.map((item) => ({
                    label: item.departmentName,
                    value: item.appointmentCount,
                  }))}
                  emptyMessage={ADMIN_DASHBOARD_TEXT.charts.empty}
                  colorByCategory
                />
              </Grid>
              <Grid size={12}>
                <TimeSeriesLineChart
                  title={ADMIN_DASHBOARD_TEXT.charts.overTime.title}
                  description={ADMIN_DASHBOARD_TEXT.charts.overTime.description}
                  seriesLabel={ADMIN_DASHBOARD_TEXT.charts.overTime.seriesLabel}
                  data={dashboard.appointmentsOverTime.map((item) => ({
                    date: item.date,
                    value: item.appointmentCount,
                  }))}
                  emptyMessage={ADMIN_DASHBOARD_TEXT.charts.empty}
                />
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Alert severity="error">{ADMIN_DASHBOARD_TEXT.errors.load}</Alert>
        )}
      </Stack>
    </Container>
  );
}

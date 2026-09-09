"use client";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AppointmentStatusChip } from "@/components/appointments/AppointmentStatusChip";
import NextLink from "@/components/navigation/NextLink";
import { PatientHomeSkeleton } from "@/components/skeletons/PatientHomeSkeleton";
import { APP_ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { usePatientHome } from "@/hooks/usePatientHome";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";
import { PATIENT_HOME_TEXT } from "@/views/patientHome/PatientHomeText";

export function PatientHome() {
  const { user } = useAuth();
  const { upcomingAppointment, isLoading, loadError, refreshAppointments } = usePatientHome();
  const fullName = user?.fullName ?? "there";

  function renderAppointmentContent() {
    if (isLoading) {
      return <PatientHomeSkeleton />;
    }

    if (loadError) {
      return (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refreshAppointments()}>
              {PATIENT_HOME_TEXT.retry}
            </Button>
          }
        >
          {loadError}
        </Alert>
      );
    }

    if (!upcomingAppointment) {
      return (
        <Paper variant="outlined">
          <Stack
            spacing={2}
            sx={{
              p: { xs: 3, sm: 5 },
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography component="h2" variant="h4">
              {PATIENT_HOME_TEXT.empty.title}
            </Typography>
            <Typography color="text.secondary">{PATIENT_HOME_TEXT.empty.description}</Typography>
            <Button component={NextLink} href={APP_ROUTES.patientDoctors}>
              {PATIENT_HOME_TEXT.actions.findDoctor}
            </Button>
          </Stack>
        </Paper>
      );
    }

    return (
      <Card component="section" aria-labelledby="upcoming-appointment-title">
        <CardContent>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={0.5}>
                <Typography id="upcoming-appointment-title" component="h2" variant="h4">
                  {PATIENT_HOME_TEXT.upcoming.title}
                </Typography>
                <Typography variant="h5">{upcomingAppointment.doctorName}</Typography>
              </Stack>
              <AppointmentStatusChip status={upcomingAppointment.status} />
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0.5}>
                  <Typography color="text.secondary" variant="body2">
                    {PATIENT_HOME_TEXT.upcoming.department}
                  </Typography>
                  <Typography>{upcomingAppointment.departmentName}</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={0.5}>
                  <Typography color="text.secondary" variant="body2">
                    {PATIENT_HOME_TEXT.upcoming.appointmentTime}
                  </Typography>
                  <Typography>
                    {formatDateTimeRange(
                      upcomingAppointment.startTime,
                      upcomingAppointment.endTime,
                    )}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
        <CardActions>
          <Button component={NextLink} href={APP_ROUTES.patientAppointments} variant="outlined">
            {PATIENT_HOME_TEXT.actions.viewAppointment}
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="primary.main">
              {PATIENT_HOME_TEXT.eyebrow}
            </Typography>
            <Typography component="h1" variant="h2">
              {PATIENT_HOME_TEXT.greeting(fullName)}
            </Typography>
            <Typography color="text.secondary">{PATIENT_HOME_TEXT.subtitle}</Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap>
            <Button
              component={NextLink}
              href={APP_ROUTES.patientDoctors}
              startIcon={<MedicalServicesOutlinedIcon />}
            >
              {PATIENT_HOME_TEXT.actions.findDoctor}
            </Button>
            <Button
              component={NextLink}
              href={APP_ROUTES.patientAppointments}
              startIcon={<CalendarMonthOutlinedIcon />}
              variant="outlined"
            >
              {PATIENT_HOME_TEXT.actions.myAppointments}
            </Button>
          </Stack>
        </Stack>

        {renderAppointmentContent()}
      </Stack>
    </Container>
  );
}

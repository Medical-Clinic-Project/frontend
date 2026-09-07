"use client";

import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { PatientAppointmentCards } from "@/components/appointments/PatientAppointmentCards";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { AppointmentDetailsDialog } from "@/components/dialogs/AppointmentDetailsDialog";
import { AppointmentRescheduleDialog } from "@/components/dialogs/AppointmentRescheduleDialog";
import { PatientAppointmentCardsSkeleton } from "@/components/skeletons/PatientAppointmentCardsSkeleton";
import {
  PATIENT_APPOINTMENT_TABS,
  PATIENT_APPOINTMENT_TAB_VALUES,
} from "@/constants/appointments";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import {
  getPatientAppointmentTab,
  type PatientAppointmentTab,
} from "@/utils/appointments";
import { PATIENT_APPOINTMENTS_TEXT } from "@/views/patientAppointments/PatientAppointmentsText";

export function PatientAppointments() {
  const appointmentsState = usePatientAppointments();
  const appointments = appointmentsState.appointments.filter(
    (appointment) => getPatientAppointmentTab(appointment) === appointmentsState.tab,
  );
  const emptyState = PATIENT_APPOINTMENTS_TEXT.empty[appointmentsState.tab];

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography variant="subtitle2" color="primary.main">
            {PATIENT_APPOINTMENTS_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {PATIENT_APPOINTMENTS_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {PATIENT_APPOINTMENTS_TEXT.subtitle}
          </Typography>
        </Stack>

        <Paper variant="outlined">
          <Tabs
            value={appointmentsState.tab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label={PATIENT_APPOINTMENTS_TEXT.tabs.label}
            onChange={(_, value: PatientAppointmentTab) => {
              if (PATIENT_APPOINTMENT_TAB_VALUES.includes(value)) {
                appointmentsState.setTab(value);
              }
            }}
          >
            <Tab
              label={PATIENT_APPOINTMENTS_TEXT.tabs.upcoming}
              value={PATIENT_APPOINTMENT_TABS.UPCOMING}
            />
            <Tab
              label={PATIENT_APPOINTMENTS_TEXT.tabs.completed}
              value={PATIENT_APPOINTMENT_TABS.COMPLETED}
            />
            <Tab
              label={PATIENT_APPOINTMENTS_TEXT.tabs.cancelled}
              value={PATIENT_APPOINTMENT_TABS.CANCELLED}
            />
          </Tabs>
        </Paper>

        {appointmentsState.isLoading ? (
          <PatientAppointmentCardsSkeleton />
        ) : appointmentsState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void appointmentsState.refreshAppointments()}
              >
                {PATIENT_APPOINTMENTS_TEXT.retry}
              </Button>
            }
          >
            {appointmentsState.loadError}
          </Alert>
        ) : appointments.length ? (
          <PatientAppointmentCards
            appointments={appointments}
            onView={appointmentsState.openDetailsDialog}
            onReschedule={appointmentsState.openRescheduleDialog}
            onCancel={appointmentsState.requestCancellation}
          />
        ) : (
          <Paper variant="outlined">
            <Stack
              spacing={1}
              sx={{ p: { xs: 3, sm: 5 }, alignItems: "center", textAlign: "center" }}
            >
              <Typography variant="h4">
                {emptyState.title}
              </Typography>
              <Typography color="text.secondary">{emptyState.description}</Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      <AppointmentDetailsDialog
        open={appointmentsState.isDetailsDialogOpen}
        appointment={appointmentsState.detailsAppointment}
        isLoading={appointmentsState.isDetailsLoading}
        error={appointmentsState.detailsError}
        onClose={appointmentsState.closeDetailsDialog}
        onRetry={appointmentsState.retryLoadAppointmentDetails}
      />

      <ConfirmationDialog
        open={appointmentsState.isCancellationDialogOpen}
        title={PATIENT_APPOINTMENTS_TEXT.cancelDialog.title}
        description={PATIENT_APPOINTMENTS_TEXT.cancelDialog.description(
          appointmentsState.cancellationAppointment?.doctorName ?? "",
        )}
        cancelLabel={PATIENT_APPOINTMENTS_TEXT.cancelDialog.cancel}
        confirmLabel={PATIENT_APPOINTMENTS_TEXT.cancelDialog.confirm}
        confirmColor="error"
        isConfirming={appointmentsState.isCancelling}
        onClose={appointmentsState.closeCancellationDialog}
        onConfirm={appointmentsState.confirmCancellation}
      />

      <AppointmentRescheduleDialog
        open={appointmentsState.isRescheduleDialogOpen}
        appointment={appointmentsState.rescheduleTarget}
        availabilityState={appointmentsState.rescheduleAvailabilityState}
        isRescheduling={appointmentsState.isRescheduling}
        onClose={appointmentsState.closeRescheduleDialog}
        onSelect={appointmentsState.rescheduleToAvailability}
      />
    </Container>
  );
}

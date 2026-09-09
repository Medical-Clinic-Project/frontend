"use client";

import {
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DoctorAppointmentsContent } from "@/components/appointments/DoctorAppointmentsContent";
import { AppointmentDetailsDialog } from "@/components/dialogs/AppointmentDetailsDialog";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import {
  APPOINTMENT_STATUSES,
  DOCTOR_APPOINTMENT_TABS,
  DOCTOR_APPOINTMENT_TAB_VALUES,
} from "@/constants/appointments";
import { useDoctorAppointments } from "@/hooks/useDoctorAppointments";
import type { DoctorAppointmentTab } from "@/utils/appointments";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

export function DoctorAppointments() {
  const appointmentsState = useDoctorAppointments();
  const statusUpdateTarget = appointmentsState.statusUpdateTarget;
  const statusDialog = statusUpdateTarget
    ? DOCTOR_APPOINTMENTS_TEXT.statusDialogs[statusUpdateTarget.status]
    : null;
  const statusUpdatingId =
    appointmentsState.isUpdatingStatus && statusUpdateTarget
      ? statusUpdateTarget.appointment.id
      : null;

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography variant="subtitle2" color="primary.main">
            {DOCTOR_APPOINTMENTS_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {DOCTOR_APPOINTMENTS_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {DOCTOR_APPOINTMENTS_TEXT.subtitle}
          </Typography>
        </Stack>

        <Paper variant="outlined">
          <Tabs
            value={appointmentsState.tab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label={DOCTOR_APPOINTMENTS_TEXT.tabs.label}
            onChange={(_, value: DoctorAppointmentTab) => {
              if (DOCTOR_APPOINTMENT_TAB_VALUES.includes(value)) {
                appointmentsState.setTab(value);
              }
            }}
          >
            <Tab
              label={DOCTOR_APPOINTMENTS_TEXT.tabs.today}
              value={DOCTOR_APPOINTMENT_TABS.TODAY}
            />
            <Tab
              label={DOCTOR_APPOINTMENTS_TEXT.tabs.upcoming}
              value={DOCTOR_APPOINTMENT_TABS.UPCOMING}
            />
            <Tab
              label={DOCTOR_APPOINTMENTS_TEXT.tabs.completed}
              value={DOCTOR_APPOINTMENT_TABS.COMPLETED}
            />
            <Tab
              label={DOCTOR_APPOINTMENTS_TEXT.tabs.cancelled}
              value={DOCTOR_APPOINTMENT_TABS.CANCELLED}
            />
          </Tabs>
        </Paper>

        <DoctorAppointmentsContent
          appointments={appointmentsState.appointments}
          emptyState={DOCTOR_APPOINTMENTS_TEXT.empty[appointmentsState.tab]}
          isLoading={appointmentsState.isLoading}
          loadError={appointmentsState.loadError}
          onRequestStatusUpdate={appointmentsState.requestStatusUpdate}
          onRetry={appointmentsState.refreshAppointments}
          onView={appointmentsState.openDetailsDialog}
          statusUpdatingId={statusUpdatingId}
        />
      </Stack>

      <AppointmentDetailsDialog
        open={appointmentsState.isDetailsDialogOpen}
        appointment={appointmentsState.detailsAppointment}
        viewer="doctor"
        isLoading={appointmentsState.isDetailsLoading}
        error={appointmentsState.detailsError}
        onClose={appointmentsState.closeDetailsDialog}
        onRetry={appointmentsState.retryLoadAppointmentDetails}
      />

      <ConfirmationDialog
        open={appointmentsState.isStatusUpdateDialogOpen}
        title={statusDialog?.title ?? ""}
        description={statusDialog?.description(statusUpdateTarget?.appointment.patientName ?? "") ?? ""}
        cancelLabel={DOCTOR_APPOINTMENTS_TEXT.statusDialogs.cancel}
        confirmLabel={statusDialog?.confirm ?? ""}
        confirmColor={
          statusUpdateTarget?.status === APPOINTMENT_STATUSES.CANCELLED
            ? "error"
            : "primary"
        }
        isConfirming={appointmentsState.isUpdatingStatus}
        onClose={appointmentsState.closeStatusUpdateDialog}
        onConfirm={appointmentsState.confirmStatusUpdate}
      />
    </Container>
  );
}

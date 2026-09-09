"use client";

import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AdminAppointmentFilters } from "@/components/appointments/AdminAppointmentFilters";
import { AppointmentDetailsDialog } from "@/components/dialogs/AppointmentDetailsDialog";
import { AppointmentRescheduleDialog } from "@/components/dialogs/AppointmentRescheduleDialog";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { AdminAppointmentsDataGrid } from "@/components/tables/AdminAppointmentsDataGrid";
import { useAdminAppointments } from "@/hooks/useAdminAppointments";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

export function AdminAppointments() {
  const appointmentsState = useAdminAppointments();
  const statusUpdateTarget = appointmentsState.statusUpdateTarget;
  const statusDialog = statusUpdateTarget
    ? ADMIN_APPOINTMENTS_TEXT.statusDialogs[statusUpdateTarget.status]
    : null;

  return (
    <Container component="main" maxWidth="xl">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography variant="subtitle2" color="primary.main">
            {ADMIN_APPOINTMENTS_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {ADMIN_APPOINTMENTS_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {ADMIN_APPOINTMENTS_TEXT.subtitle}
          </Typography>
        </Stack>

        <Paper variant="outlined">
          <AdminAppointmentFilters
            filters={appointmentsState.filters}
            options={appointmentsState.options}
            actions={appointmentsState.actions}
          />
        </Paper>

        {appointmentsState.filterOptionsError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={appointmentsState.retryLoadFilterOptions}
              >
                {ADMIN_APPOINTMENTS_TEXT.retry}
              </Button>
            }
          >
            {appointmentsState.filterOptionsError}
          </Alert>
        )}

        {appointmentsState.patientOptionsError && (
          <Alert severity="error">{appointmentsState.patientOptionsError}</Alert>
        )}

        {appointmentsState.isLoading ? (
          <TableSkeleton label={ADMIN_APPOINTMENTS_TEXT.loading} rows={5} />
        ) : appointmentsState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void appointmentsState.refreshAppointments()}
              >
                {ADMIN_APPOINTMENTS_TEXT.retry}
              </Button>
            }
          >
            {appointmentsState.loadError}
          </Alert>
        ) : appointmentsState.appointments.length ? (
          <AdminAppointmentsDataGrid
            appointments={appointmentsState.appointments}
            statusUpdatingId={
              appointmentsState.isUpdatingStatus && statusUpdateTarget
                ? statusUpdateTarget.appointment.id
                : null
            }
            reschedulingId={
              appointmentsState.isRescheduling && appointmentsState.rescheduleTarget
                ? appointmentsState.rescheduleTarget.id
                : null
            }
            onView={appointmentsState.openDetailsDialog}
            onRequestStatusUpdate={appointmentsState.requestStatusUpdate}
            onRequestReschedule={appointmentsState.openRescheduleDialog}
          />
        ) : (
          <Paper variant="outlined">
            <Stack spacing={1} sx={{ p: { xs: 3, sm: 5 }, textAlign: "center" }}>
              <Typography component="h2" variant="h4">
                {appointmentsState.filters.hasFilters
                  ? ADMIN_APPOINTMENTS_TEXT.noResults.title
                  : ADMIN_APPOINTMENTS_TEXT.empty.title}
              </Typography>
              <Typography color="text.secondary">
                {appointmentsState.filters.hasFilters
                  ? ADMIN_APPOINTMENTS_TEXT.noResults.description
                  : ADMIN_APPOINTMENTS_TEXT.empty.description}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      <AppointmentDetailsDialog
        open={appointmentsState.isDetailsDialogOpen}
        appointment={appointmentsState.detailsAppointment}
        viewer="admin"
        isLoading={appointmentsState.isDetailsLoading}
        error={appointmentsState.detailsError}
        onClose={appointmentsState.closeDetailsDialog}
        onRetry={appointmentsState.retryLoadAppointmentDetails}
      />

      <ConfirmationDialog
        open={appointmentsState.isStatusUpdateDialogOpen}
        title={statusDialog?.title ?? ""}
        description={statusDialog?.description(statusUpdateTarget?.appointment.patientName ?? "") ?? ""}
        cancelLabel={ADMIN_APPOINTMENTS_TEXT.statusDialogs.cancel}
        confirmLabel={statusDialog?.confirm ?? ""}
        confirmColor={statusUpdateTarget?.status === "Cancelled" ? "error" : "primary"}
        isConfirming={appointmentsState.isUpdatingStatus}
        onClose={appointmentsState.closeStatusUpdateDialog}
        onConfirm={appointmentsState.confirmStatusUpdate}
      />

      <AppointmentRescheduleDialog
        open={appointmentsState.isRescheduleDialogOpen}
        appointment={appointmentsState.rescheduleTarget}
        availabilityState={appointmentsState.availabilityState}
        isRescheduling={appointmentsState.isRescheduling}
        onClose={appointmentsState.closeRescheduleDialog}
        onSelect={appointmentsState.rescheduleToAvailability}
      />
    </Container>
  );
}

import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DoctorAppointmentsDataGrid } from "@/components/tables/DoctorAppointmentsDataGrid";
import { APPOINTMENT_STATUSES } from "@/constants/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { DOCTOR_APPOINTMENTS_TEXT } from "@/views/doctorAppointments/DoctorAppointmentsText";

interface DoctorAppointmentsContentProps {
  appointments: readonly Appointment[];
  emptyState: {
    readonly title: string;
    readonly description: string;
  };
  isLoading: boolean;
  loadError: string | null;
  onRequestStatusUpdate: (
    appointment: Appointment,
    status: Exclude<AppointmentStatus, typeof APPOINTMENT_STATUSES.PENDING>,
  ) => void;
  onRetry: () => void | Promise<void>;
  onView: (appointment: Appointment) => void;
  statusUpdatingId: number | null;
}

export function DoctorAppointmentsContent({
  appointments,
  emptyState,
  isLoading,
  loadError,
  onRequestStatusUpdate,
  onRetry,
  onView,
  statusUpdatingId,
}: DoctorAppointmentsContentProps) {
  if (isLoading) {
    return <TableSkeleton label={DOCTOR_APPOINTMENTS_TEXT.loading} rows={4} />;
  }

  if (loadError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => void onRetry()}>
            {DOCTOR_APPOINTMENTS_TEXT.retry}
          </Button>
        }
      >
        {loadError}
      </Alert>
    );
  }

  if (appointments.length) {
    return (
      <DoctorAppointmentsDataGrid
        appointments={appointments}
        onView={onView}
        onRequestStatusUpdate={onRequestStatusUpdate}
        statusUpdatingId={statusUpdatingId}
      />
    );
  }

  return (
    <Paper variant="outlined">
      <Stack
        spacing={1}
        sx={{ p: { xs: 3, sm: 5 }, alignItems: "center", textAlign: "center" }}
      >
        <Typography component="h2" variant="h4">
          {emptyState.title}
        </Typography>
        <Typography color="text.secondary">{emptyState.description}</Typography>
      </Stack>
    </Paper>
  );
}

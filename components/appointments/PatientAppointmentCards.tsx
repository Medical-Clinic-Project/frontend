import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { AppointmentStatusChip } from "@/components/appointments/AppointmentStatusChip";
import type { Appointment } from "@/types/appointment";
import { formatDateTimeRange } from "@/utils/doctorAvailability/dateTime";
import { canManagePatientAppointment } from "@/utils/appointments";
import { PATIENT_APPOINTMENTS_TEXT } from "@/views/patientAppointments/PatientAppointmentsText";

interface PatientAppointmentCardsProps {
  appointments: readonly Appointment[];
  onView: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

export function PatientAppointmentCards({
  appointments,
  onView,
  onReschedule,
  onCancel,
}: PatientAppointmentCardsProps) {
  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: "none", p: 0, m: 0 }}>
      {appointments.map((appointment) => {
        const canManage = canManagePatientAppointment(appointment);

        return (
          <Card component="li" key={appointment.id}>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  useFlexGap
                  sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}
                >
                  <Typography component="h2" variant="h5">
                    {appointment.doctorName}
                  </Typography>
                  <AppointmentStatusChip status={appointment.status} />
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {PATIENT_APPOINTMENTS_TEXT.card.appointmentTime}
                  </Typography>
                  <Typography>
                    {formatDateTimeRange(appointment.startTime, appointment.endTime)}
                  </Typography>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {PATIENT_APPOINTMENTS_TEXT.card.department}
                  </Typography>
                  <Typography>{appointment.departmentName}</Typography>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                useFlexGap
                sx={{ width: "100%", alignItems: { xs: "stretch", sm: "center" }, justifyContent: "flex-end" }}
              >
                <Button variant="outlined" onClick={() => onView(appointment)}>
                  {PATIENT_APPOINTMENTS_TEXT.actions.view}
                </Button>
                {canManage && (
                  <>
                    <Button variant="outlined" onClick={() => onReschedule(appointment)}>
                      {PATIENT_APPOINTMENTS_TEXT.actions.reschedule}
                    </Button>
                    <Button color="error" variant="outlined" onClick={() => onCancel(appointment)}>
                      {PATIENT_APPOINTMENTS_TEXT.actions.cancel}
                    </Button>
                  </>
                )}
              </Stack>
            </CardActions>
          </Card>
        );
      })}
    </Stack>
  );
}

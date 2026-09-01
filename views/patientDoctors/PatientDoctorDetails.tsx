"use client";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AppointmentSlotSelector } from "@/components/appointments/AppointmentSlotSelector";
import { AppointmentBookingDialog } from "@/components/dialogs/AppointmentBookingDialog";
import NextLink from "@/components/navigation/NextLink";
import { PatientDoctorDetailsSkeleton } from "@/components/skeletons/PatientDoctorDetailsSkeleton";
import { APP_ROUTES } from "@/constants/routes";
import { usePatientDoctorDetails } from "@/hooks/usePatientDoctorDetails";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

interface PatientDoctorDetailsProps {
  doctorId: number;
}

export function PatientDoctorDetails({ doctorId }: PatientDoctorDetailsProps) {
  const doctorDetails = usePatientDoctorDetails(doctorId);

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          component={NextLink}
          href={APP_ROUTES.patientDoctors}
          variant="text"
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{ alignSelf: "flex-start" }}
        >
          {PATIENT_DOCTORS_TEXT.details.back}
        </Button>

        {doctorDetails.isLoading ? (
          <PatientDoctorDetailsSkeleton />
        ) : doctorDetails.loadError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={doctorDetails.retryLoadDoctor}>
                {PATIENT_DOCTORS_TEXT.retry}
              </Button>
            }
          >
            {doctorDetails.loadError}
          </Alert>
        ) : doctorDetails.doctor ? (
          <>
            <Paper variant="outlined">
              <Stack spacing={1.5} sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="subtitle2" color="primary.main">
                  {PATIENT_DOCTORS_TEXT.details.title}
                </Typography>
                <Typography component="h1" variant="h2">
                  {doctorDetails.doctor.fullName}
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {PATIENT_DOCTORS_TEXT.details.departmentLabel}
                  </Typography>
                  <Typography>{doctorDetails.doctor.departmentName}</Typography>
                </Stack>
              </Stack>
            </Paper>

            <Stack spacing={2}>
              <Typography component="h2" variant="h4">
                {PATIENT_DOCTORS_TEXT.details.availabilityTitle}
              </Typography>
              <AppointmentSlotSelector
                availabilityState={doctorDetails.availabilityState}
                onSelect={doctorDetails.openBookingDialog}
              />
            </Stack>
          </>
        ) : (
          <Alert severity="info">{PATIENT_DOCTORS_TEXT.details.unavailable}</Alert>
        )}
      </Stack>

      <AppointmentBookingDialog
        open={doctorDetails.isBookingOpen}
        doctor={doctorDetails.doctor}
        availability={doctorDetails.bookingAvailability}
        fieldErrors={doctorDetails.bookingFieldErrors}
        onClose={doctorDetails.closeBookingDialog}
        onSubmit={doctorDetails.saveAppointment}
      />
    </Container>
  );
}

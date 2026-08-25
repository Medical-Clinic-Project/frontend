"use client";

import {
  Alert,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { PatientProfileForm } from "@/components/patients/PatientProfileForm";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfile.text";

function PatientProfileSkeleton() {
  return (
    <Paper
      variant="outlined"
      role="status"
      aria-label={PATIENT_PROFILE_TEXT.loading}
      aria-live="polite"
      aria-busy="true"
    >
      <Stack spacing={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={48} />
      </Stack>
    </Paper>
  );
}

export function PatientProfile() {
  const profileState = usePatientProfile();

  return (
    <Container component="main" maxWidth="md">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography color="primary.main" sx={{ fontWeight: 700 }}>
            {PATIENT_PROFILE_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {PATIENT_PROFILE_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {PATIENT_PROFILE_TEXT.subtitle}
          </Typography>
        </Stack>

        {profileState.successMessage && (
          <Alert severity="success" onClose={profileState.clearSuccessMessage}>
            {profileState.successMessage}
          </Alert>
        )}

        {profileState.isLoading ? (
          <PatientProfileSkeleton />
        ) : profileState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={profileState.retryLoadProfile}
              >
                {PATIENT_PROFILE_TEXT.retry}
              </Button>
            }
          >
            {profileState.loadError}
          </Alert>
        ) : profileState.patient ? (
          <PatientProfileForm
            patient={profileState.patient}
            fieldErrors={profileState.fieldErrors}
            submissionError={profileState.submissionError}
            onSubmit={profileState.saveProfile}
          />
        ) : (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={profileState.retryLoadProfile}
              >
                {PATIENT_PROFILE_TEXT.retry}
              </Button>
            }
          >
            {PATIENT_PROFILE_TEXT.errors.unavailable}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}

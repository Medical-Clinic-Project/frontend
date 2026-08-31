"use client";

import {
  Alert,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { PatientProfileForm } from "@/components/patients/PatientProfileForm";
import { PatientProfileSkeleton } from "@/components/skeletons/PatientProfileSkeleton";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { PATIENT_PROFILE_TEXT } from "@/views/patientProfile/PatientProfileText";

export function PatientProfile() {
  const profileState = usePatientProfile();

  return (
    <Container component="main" maxWidth="md">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography variant="subtitle2" color="primary.main">
            {PATIENT_PROFILE_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {PATIENT_PROFILE_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {PATIENT_PROFILE_TEXT.subtitle}
          </Typography>
        </Stack>

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

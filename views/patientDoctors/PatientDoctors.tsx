"use client";

import { Alert, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { PatientDoctorCards } from "@/components/patientDoctors/PatientDoctorCards";
import { PatientDoctorsHeader } from "@/components/patientDoctors/PatientDoctorsHeader";
import { PatientDoctorCardsSkeleton } from "@/components/skeletons/PatientDoctorCardsSkeleton";
import { usePatientDoctors } from "@/hooks/usePatientDoctors";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

export function PatientDoctors() {
  const doctorsState = usePatientDoctors();
  const hasFilters = Boolean(doctorsState.search.trim()) || doctorsState.departmentFilter;

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <PatientDoctorsHeader
          search={doctorsState.search}
          departments={doctorsState.departments}
          departmentFilter={doctorsState.departmentFilter}
          onSearchChange={doctorsState.setSearch}
          onDepartmentFilterChange={doctorsState.setDepartmentFilter}
        />

        {doctorsState.isLoading ? (
          <PatientDoctorCardsSkeleton />
        ) : doctorsState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={doctorsState.retryLoadDoctors}>
                {PATIENT_DOCTORS_TEXT.retry}
              </Button>
            }
          >
            {doctorsState.loadError}
          </Alert>
        ) : doctorsState.doctors.length ? (
          <PatientDoctorCards doctors={doctorsState.doctors} />
        ) : (
          <Paper variant="outlined">
            <Stack
              spacing={1}
              sx={{ p: { xs: 3, sm: 5 }, alignItems: "center", textAlign: "center" }}
            >
              <Typography component="h2" variant="h4">
                {hasFilters
                  ? PATIENT_DOCTORS_TEXT.noResults.title
                  : PATIENT_DOCTORS_TEXT.empty.title}
              </Typography>
              <Typography color="text.secondary">
                {hasFilters
                  ? PATIENT_DOCTORS_TEXT.noResults.description
                  : PATIENT_DOCTORS_TEXT.empty.description}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

"use client";

import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { PatientDetailsDialog } from "@/components/dialogs/PatientDetailsDialog";
import { PatientStatusDialog } from "@/components/dialogs/PatientStatusDialog";
import { PatientsHeader } from "@/components/patients/PatientsHeader";
import { PatientsTableSkeleton } from "@/components/skeletons/PatientsTableSkeleton";
import { PatientsTable } from "@/components/tables/PatientsTable";
import { usePatients } from "@/hooks/usePatients";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

export function Patients() {
  const patientsState = usePatients();
  const hasFilters =
    Boolean(patientsState.search.trim()) ||
    patientsState.statusFilter !== "all";

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <PatientsHeader
          search={patientsState.search}
          onSearchChange={patientsState.setSearch}
          statusFilter={patientsState.statusFilter}
          onStatusFilterChange={patientsState.setStatusFilter}
        />

        {patientsState.successMessage && (
          <Alert severity="success" onClose={patientsState.clearSuccessMessage}>
            {patientsState.successMessage}
          </Alert>
        )}

        {patientsState.isLoading ? (
          <PatientsTableSkeleton />
        ) : patientsState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={patientsState.retryLoadPatients}
              >
                {PATIENTS_TEXT.retry}
              </Button>
            }
          >
            {patientsState.loadError}
          </Alert>
        ) : patientsState.patients.length ? (
          <PatientsTable
            patients={patientsState.patients}
            onView={patientsState.openDetailsDialog}
            onRequestStatusChange={patientsState.openStatusDialog}
          />
        ) : (
          <Paper variant="outlined">
            <Stack spacing={1} sx={{ p: 4, textAlign: "center" }}>
              <Typography component="h2" variant="h4">
                {hasFilters
                  ? PATIENTS_TEXT.noResults.title
                  : PATIENTS_TEXT.empty.title}
              </Typography>
              <Typography color="text.secondary">
                {hasFilters
                  ? PATIENTS_TEXT.noResults.description
                  : PATIENTS_TEXT.empty.description}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      <PatientDetailsDialog
        open={patientsState.isDetailsDialogOpen}
        patient={patientsState.detailsPatient}
        isLoading={patientsState.isDetailsLoading}
        error={patientsState.detailsError}
        onClose={patientsState.closeDetailsDialog}
        onRetry={patientsState.retryLoadPatientDetails}
      />

      <PatientStatusDialog
        open={patientsState.isStatusDialogOpen}
        patient={patientsState.statusPatient}
        isUpdating={patientsState.isStatusUpdating}
        error={patientsState.statusError}
        onClose={patientsState.closeStatusDialog}
        onConfirm={patientsState.confirmStatusChange}
      />
    </Container>
  );
}

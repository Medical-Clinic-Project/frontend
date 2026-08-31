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
import { PatientsDataGridSkeleton } from "@/components/skeletons/PatientsDataGridSkeleton";
import { PatientsDataGrid } from "@/components/tables/PatientsDataGrid";
import { PATIENT_STATUS_FILTERS } from "@/constants/patients";
import { usePatients } from "@/hooks/usePatients";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

export function Patients() {
  const patientsState = usePatients();
  const hasFilters =
    Boolean(patientsState.search.trim()) ||
    patientsState.statusFilter !== PATIENT_STATUS_FILTERS.all;

  return (
    <Container component="section" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <PatientsHeader
          search={patientsState.search}
          onSearchChange={patientsState.setSearch}
          statusFilter={patientsState.statusFilter}
          onStatusFilterChange={patientsState.setStatusFilter}
        />

        {patientsState.isLoading ? (
          <PatientsDataGridSkeleton />
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
          <PatientsDataGrid
            patients={patientsState.patients}
            onView={patientsState.openDetailsDialog}
            onRequestStatusChange={patientsState.openStatusDialog}
            statusUpdatingId={patientsState.statusUpdatingId}
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
        onClose={patientsState.closeStatusDialog}
        onConfirm={patientsState.confirmStatusChange}
      />
    </Container>
  );
}

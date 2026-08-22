"use client";

import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DoctorFormDialog } from "@/components/dialogs/DoctorFormDialog";
import { DoctorsHeader } from "@/components/doctors/DoctorsHeader";
import { DoctorsDataGridSkeleton } from "@/components/skeletons/DoctorsDataGridSkeleton";
import { DoctorsDataGrid } from "@/components/tables/DoctorsDataGrid";
import { useDoctors } from "@/hooks/useDoctors";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

export function Doctors() {
  const doctorsState = useDoctors();
  const hasFilters =
    Boolean(doctorsState.search.trim()) ||
    doctorsState.departmentFilter !== null;
  const hasActiveDepartments = doctorsState.activeDepartments.length > 0;

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <DoctorsHeader
          search={doctorsState.search}
          onSearchChange={doctorsState.setSearch}
          departments={doctorsState.departments}
          departmentFilter={doctorsState.departmentFilter}
          onDepartmentFilterChange={doctorsState.setDepartmentFilter}
          departmentFilterDisabled={
            doctorsState.departmentsLoading ||
            Boolean(doctorsState.departmentsError) ||
            doctorsState.departments.length === 0
          }
          createDisabled={!doctorsState.canCreateDoctor}
          onCreate={doctorsState.openCreateDialog}
        />

        {doctorsState.departmentsError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={doctorsState.retryLoadDepartments}
              >
                {DOCTORS_TEXT.retry}
              </Button>
            }
          >
            {doctorsState.departmentsError}
          </Alert>
        )}

        {doctorsState.isLoading ? (
          <DoctorsDataGridSkeleton />
        ) : doctorsState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={doctorsState.retryLoadDoctors}
              >
                {DOCTORS_TEXT.retry}
              </Button>
            }
          >
            {doctorsState.loadError}
          </Alert>
        ) : (
          <Stack spacing={3}>
            {!doctorsState.departmentsLoading &&
              !doctorsState.departmentsError &&
              !hasActiveDepartments && (
                <Alert severity="warning">
                  {DOCTORS_TEXT.departmentStates.noActive}
                </Alert>
              )}

            {doctorsState.doctors.length ? (
              <DoctorsDataGrid
                doctors={doctorsState.doctors}
                onEdit={doctorsState.openEditDialog}
                onToggleStatus={doctorsState.toggleDoctorStatus}
                statusUpdatingId={doctorsState.statusUpdatingId}
              />
            ) : (
              <Paper variant="outlined">
                <Stack spacing={1} sx={{ p: 4, textAlign: "center" }}>
                  <Typography component="h2" variant="h4">
                    {hasFilters
                      ? DOCTORS_TEXT.noResults.title
                      : DOCTORS_TEXT.empty.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {hasFilters
                      ? DOCTORS_TEXT.noResults.description
                      : DOCTORS_TEXT.empty.description}
                  </Typography>
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </Stack>

      <DoctorFormDialog
        key={
          doctorsState.selectedDoctor
            ? `edit-${doctorsState.selectedDoctor.id}`
            : "create"
        }
        open={doctorsState.isDialogOpen}
        doctor={doctorsState.selectedDoctor}
        departments={doctorsState.departments}
        departmentsLoading={doctorsState.departmentsLoading}
        departmentsError={doctorsState.departmentsError}
        fieldErrors={doctorsState.formFieldErrors}
        onClose={doctorsState.closeDialog}
        onRetryDepartments={doctorsState.retryLoadDepartments}
        onSubmit={doctorsState.saveDoctor}
      />
    </Container>
  );
}

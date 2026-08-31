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
import { DepartmentsHeader } from "@/components/departments/DepartmentsHeader";
import { DepartmentFormDialog } from "@/components/dialogs/DepartmentFormDialog";
import { DepartmentsDataGrid } from "@/components/tables/DepartmentsDataGrid";
import { useDepartments } from "@/hooks/useDepartments";
import { DEPARTMENTS_TEXT } from "@/views/departments/DepartmentsText";

function DepartmentsLoadingState() {
  return (
    <Paper variant="outlined" aria-label={DEPARTMENTS_TEXT.loading}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
      </Stack>
    </Paper>
  );
}

export function Departments() {
  const departmentsState = useDepartments();
  const hasSearch = Boolean(departmentsState.search.trim());

  return (
    <Container component="section" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <DepartmentsHeader
          search={departmentsState.search}
          onSearchChange={departmentsState.setSearch}
          onCreate={departmentsState.openCreateDialog}
        />

        {departmentsState.isLoading ? (
          <DepartmentsLoadingState />
        ) : departmentsState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={departmentsState.retryLoadDepartments}
              >
                {DEPARTMENTS_TEXT.retry}
              </Button>
            }
          >
            {departmentsState.loadError}
          </Alert>
        ) : departmentsState.departments.length ? (
          <DepartmentsDataGrid
            departments={departmentsState.departments}
            onEdit={departmentsState.openEditDialog}
            onToggleStatus={departmentsState.toggleDepartmentStatus}
            statusUpdatingId={departmentsState.statusUpdatingId}
          />
        ) : (
          <Paper variant="outlined">
            <Stack spacing={1} sx={{ p: 4, textAlign: "center" }}>
              <Typography component="h2" variant="h4">
                {hasSearch
                  ? DEPARTMENTS_TEXT.noResults.title
                  : DEPARTMENTS_TEXT.empty.title}
              </Typography>
              <Typography color="text.secondary">
                {hasSearch
                  ? DEPARTMENTS_TEXT.noResults.description
                  : DEPARTMENTS_TEXT.empty.description}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      <DepartmentFormDialog
        open={departmentsState.isDialogOpen}
        department={departmentsState.selectedDepartment}
        fieldErrors={departmentsState.formFieldErrors}
        onClose={departmentsState.closeDialog}
        onSubmit={departmentsState.saveDepartment}
      />
    </Container>
  );
}

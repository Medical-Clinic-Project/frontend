"use client";

import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useDoctorAvailability } from "@/hooks/useDoctorAvailability";
import {
  formatVisibleRange,
  getVisibleDays,
} from "@/views/doctorAvailability/doctorAvailabilityDates";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityView.text";
import { AvailabilityCalendar } from "@/components/calendars/AvailabilityCalendar";
import { AvailabilityFormDialog } from "@/components/dialogs/AvailabilityFormDialog";
import { AvailabilityToolbar } from "@/components/calendars/AvailabilityToolbar";
import { DeleteAvailabilityDialog } from "@/components/dialogs/DeleteAvailabilityDialog";
import  DoctorsAvailabilityCalendarSkeleton  from "@/components/skeletons/DoctorsAvailabilityCalenderSkeleton";



export function DoctorAvailabilityView() {
  const availabilityState = useDoctorAvailability();
  const days = getVisibleDays(
    availabilityState.selectedDate,
    availabilityState.viewMode,
  );
  const periodLabel = formatVisibleRange(
    availabilityState.selectedDate,
    availabilityState.viewMode,
  );

  return (
    <Container component="main" maxWidth="lg">
      <Stack spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
        <Stack component="header" spacing={1}>
          <Typography color="primary.main" sx={{ fontWeight: 700 }}>
            {DOCTOR_AVAILABILITY_TEXT.eyebrow}
          </Typography>
          <Typography component="h1" variant="h2">
            {DOCTOR_AVAILABILITY_TEXT.title}
          </Typography>
          <Typography color="text.secondary">
            {DOCTOR_AVAILABILITY_TEXT.subtitle}
          </Typography>
        </Stack>

        <AvailabilityToolbar
          periodLabel={periodLabel}
          viewMode={availabilityState.viewMode}
          onPrevious={availabilityState.goToPrevious}
          onToday={availabilityState.goToToday}
          onNext={availabilityState.goToNext}
          onViewModeChange={availabilityState.changeViewMode}
          onAdd={availabilityState.openCreateDialog}
        />

        {availabilityState.successMessage && (
          <Alert
            severity="success"
            onClose={availabilityState.clearSuccessMessage}
          >
            {availabilityState.successMessage}
          </Alert>
        )}

        {availabilityState.operationError && (
          <Alert
            severity="error"
            onClose={availabilityState.clearOperationError}
          >
            {availabilityState.operationError}
          </Alert>
        )}

        {availabilityState.isLoading ? (
          <DoctorsAvailabilityCalendarSkeleton />
        ) : availabilityState.loadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => availabilityState.retryLoad()}
              >
                {DOCTOR_AVAILABILITY_TEXT.retry}
              </Button>
            }
          >
            {availabilityState.loadError}
          </Alert>
        ) : availabilityState.availability.length > 0 ? (
          <AvailabilityCalendar
            availability={availabilityState.availability}
            days={days}
            viewMode={availabilityState.viewMode}
            movingAvailabilityId={
              availabilityState.movingAvailabilityId
            }
            onSelect={availabilityState.openEditDialog}
            onMove={availabilityState.moveAvailability}
          />
        ) : (
          <Paper variant="outlined">
            <Stack
              spacing={2}
              sx={{
                p: { xs: 3, sm: 5 },
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Stack spacing={1}>
                <Typography component="h2" variant="h4">
                  {DOCTOR_AVAILABILITY_TEXT.empty.title}
                </Typography>
                <Typography color="text.secondary">
                  {DOCTOR_AVAILABILITY_TEXT.empty.description}
                </Typography>
              </Stack>
              <Button onClick={availabilityState.openCreateDialog}>
                {DOCTOR_AVAILABILITY_TEXT.addAction}
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>

      <AvailabilityFormDialog
        key={
          availabilityState.selectedAvailability
            ? `edit-${availabilityState.selectedAvailability.id}`
            : `create-${availabilityState.selectedDate.toISOString()}`
        }
        open={availabilityState.isFormOpen}
        availability={availabilityState.selectedAvailability}
        selectedDate={availabilityState.selectedDate}
        fieldErrors={availabilityState.formFieldErrors}
        submissionError={availabilityState.formError}
        onClose={availabilityState.closeFormDialog}
        onDelete={availabilityState.requestDelete}
        onSubmit={availabilityState.saveAvailability}
      />

      <DeleteAvailabilityDialog
        open={availabilityState.isDeleteOpen}
        availability={availabilityState.deleteAvailability}
        isDeleting={availabilityState.isDeleting}
        error={availabilityState.deleteError}
        onClose={availabilityState.closeDeleteDialog}
        onConfirm={availabilityState.confirmDelete}
      />
    </Container>
  );
}

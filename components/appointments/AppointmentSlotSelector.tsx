"use client";

import {
  Alert,
  Button,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AvailabilityCalendar } from "@/components/calendars/AvailabilityCalendar";
import { APPOINTMENT_SLOT_SELECTOR_TEXT } from "@/components/appointments/AppointmentSlotSelector.text";
import { AppointmentSlotSelectorSkeleton } from "@/components/skeletons/AppointmentSlotSelectorSkeleton";
import type { usePatientAvailability } from "@/hooks/usePatientAvailability";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import {
  formatVisibleRange,
  getVisibleDays,
} from "@/utils/doctorAvailability/dateTime";

interface AppointmentSlotSelectorProps {
  availabilityState: ReturnType<typeof usePatientAvailability>;
  onSelect: (availability: DoctorAvailability) => void;
}

export function AppointmentSlotSelector({
  availabilityState,
  onSelect,
}: AppointmentSlotSelectorProps) {
  const days = getVisibleDays(
    availabilityState.selectedDate,
    availabilityState.viewMode,
  );
  const periodLabel = formatVisibleRange(
    availabilityState.selectedDate,
    availabilityState.viewMode,
  );

  return (
    <Stack spacing={3}>
      <Paper variant="outlined">
        <Stack spacing={2.5} sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            useFlexGap
            sx={{
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Typography component="h2" variant="h4">
              {periodLabel}
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={availabilityState.viewMode}
              aria-label={APPOINTMENT_SLOT_SELECTOR_TEXT.viewMode.label}
              onChange={(_, value) => {
                if (value === "day" || value === "week") {
                  availabilityState.changeViewMode(value);
                }
              }}
            >
              <ToggleButton value="day">
                {APPOINTMENT_SLOT_SELECTOR_TEXT.viewMode.day}
              </ToggleButton>
              <ToggleButton value="week">
                {APPOINTMENT_SLOT_SELECTOR_TEXT.viewMode.week}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Button size="small" variant="outlined" onClick={availabilityState.goToPrevious}>
              {APPOINTMENT_SLOT_SELECTOR_TEXT.navigation.previous}
            </Button>
            <Button size="small" variant="outlined" onClick={availabilityState.goToToday}>
              {APPOINTMENT_SLOT_SELECTOR_TEXT.navigation.today}
            </Button>
            <Button size="small" variant="outlined" onClick={availabilityState.goToNext}>
              {APPOINTMENT_SLOT_SELECTOR_TEXT.navigation.next}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {availabilityState.isLoading ? (
        <AppointmentSlotSelectorSkeleton />
      ) : availabilityState.loadError ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void availabilityState.refreshAvailability()}
            >
              {APPOINTMENT_SLOT_SELECTOR_TEXT.retry}
            </Button>
          }
        >
          {availabilityState.loadError}
        </Alert>
      ) : availabilityState.availability.length ? (
        <AvailabilityCalendar
          availability={availabilityState.availability}
          days={days}
          viewMode={availabilityState.viewMode}
          interaction="select"
          copy={APPOINTMENT_SLOT_SELECTOR_TEXT.calendar}
          isSlotSelectable={(availability) =>
            new Date(availability.startTime) > new Date()
          }
          onSelect={onSelect}
        />
      ) : (
        <Paper variant="outlined">
          <Stack
            spacing={1}
            sx={{
              p: { xs: 3, sm: 5 },
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography component="h3" variant="h5">
              {APPOINTMENT_SLOT_SELECTOR_TEXT.empty.title}
            </Typography>
            <Typography color="text.secondary">
              {APPOINTMENT_SLOT_SELECTOR_TEXT.empty.description}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

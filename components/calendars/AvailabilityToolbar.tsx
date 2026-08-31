import {
  Button,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { AvailabilityViewMode } from "@/utils/doctorAvailability/dateTime";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityText";

interface AvailabilityToolbarProps {
  periodLabel: string;
  viewMode: AvailabilityViewMode;
  onPrevious: () => void;
  onToday: () => void;
  onNext: () => void;
  onViewModeChange: (mode: AvailabilityViewMode) => void;
  onAdd: () => void;
}

export function AvailabilityToolbar({
  periodLabel,
  viewMode,
  onPrevious,
  onToday,
  onNext,
  onViewModeChange,
  onAdd,
}: AvailabilityToolbarProps) {
  return (
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
          <Button onClick={onAdd}>
            {DOCTOR_AVAILABILITY_TEXT.addAction}
          </Button>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          useFlexGap
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Button size="small" variant="outlined" onClick={onPrevious}>
              {DOCTOR_AVAILABILITY_TEXT.navigation.previous}
            </Button>
            <Button size="small" variant="outlined" onClick={onToday}>
              {DOCTOR_AVAILABILITY_TEXT.navigation.today}
            </Button>
            <Button size="small" variant="outlined" onClick={onNext}>
              {DOCTOR_AVAILABILITY_TEXT.navigation.next}
            </Button>
          </Stack>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={viewMode}
            aria-label={DOCTOR_AVAILABILITY_TEXT.viewMode.label}
            onChange={(_, value: AvailabilityViewMode | null) => {
              if (value) {
                onViewModeChange(value);
              }
            }}
          >
            <ToggleButton value="day">
              {DOCTOR_AVAILABILITY_TEXT.viewMode.day}
            </ToggleButton>
            <ToggleButton value="week">
              {DOCTOR_AVAILABILITY_TEXT.viewMode.week}
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Paper>
  );
}

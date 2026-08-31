import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { PATIENT_STATUS_FILTERS } from "@/constants/patients";
import type { PatientStatusFilter } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

interface PatientsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: PatientStatusFilter;
  onStatusFilterChange: (status: PatientStatusFilter) => void;
}

function parseStatusFilter(value: string): PatientStatusFilter {
  if (Object.values(PATIENT_STATUS_FILTERS).includes(value as PatientStatusFilter)) {
    return value as PatientStatusFilter;
  }

  return PATIENT_STATUS_FILTERS.all;
}

export function PatientsHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: PatientsHeaderProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="primary.main">
          {PATIENTS_TEXT.eyebrow}
        </Typography>
        <Typography component="h1" variant="h2">
          {PATIENTS_TEXT.title}
        </Typography>
        <Typography color="text.secondary">{PATIENTS_TEXT.subtitle}</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}
      >
        <TextField
          label={PATIENTS_TEXT.searchLabel}
          placeholder={PATIENTS_TEXT.searchPlaceholder}
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ flex: 2, minWidth: 0 }}
        />
        <TextField
          select
          label={PATIENTS_TEXT.statusFilterLabel}
          size="small"
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(parseStatusFilter(event.target.value))
          }
          sx={{ flex: 1, minWidth: 0 }}
        >
          <MenuItem value={PATIENT_STATUS_FILTERS.all}>
            {PATIENTS_TEXT.statusFilters.all}
          </MenuItem>
          <MenuItem value={PATIENT_STATUS_FILTERS.active}>
            {PATIENTS_TEXT.statusFilters.active}
          </MenuItem>
          <MenuItem value={PATIENT_STATUS_FILTERS.inactive}>
            {PATIENTS_TEXT.statusFilters.inactive}
          </MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
}

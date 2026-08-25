import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { PatientStatusFilter } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

interface PatientsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: PatientStatusFilter;
  onStatusFilterChange: (status: PatientStatusFilter) => void;
}

function parseStatusFilter(value: string): PatientStatusFilter {
  if (value === "active" || value === "inactive") {
    return value;
  }

  return "all";
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
        <Typography color="primary.main" sx={{ fontWeight: 700 }}>
          {PATIENTS_TEXT.eyebrow}
        </Typography>
        <Typography component="h1" variant="h2">
          {PATIENTS_TEXT.title}
        </Typography>
        <Typography color="text.secondary">{PATIENTS_TEXT.subtitle}</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
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
          <MenuItem value="all">{PATIENTS_TEXT.statusFilters.all}</MenuItem>
          <MenuItem value="active">{PATIENTS_TEXT.statusFilters.active}</MenuItem>
          <MenuItem value="inactive">
            {PATIENTS_TEXT.statusFilters.inactive}
          </MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
}

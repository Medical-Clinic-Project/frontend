import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

interface PatientDoctorDepartment {
  id: number;
  name: string;
}

interface PatientDoctorsHeaderProps {
  search: string;
  departments: readonly PatientDoctorDepartment[];
  departmentFilter: number | null;
  onSearchChange: (search: string) => void;
  onDepartmentFilterChange: (departmentId: number | null) => void;
}

function parseDepartmentFilter(value: string): number | null {
  const departmentId = Number(value);

  return Number.isInteger(departmentId) && departmentId > 0
    ? departmentId
    : null;
}

export function PatientDoctorsHeader({
  search,
  departments,
  departmentFilter,
  onSearchChange,
  onDepartmentFilterChange,
}: PatientDoctorsHeaderProps) {
  return (
    <Stack spacing={3} component="header">
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="primary.main">
          {PATIENT_DOCTORS_TEXT.eyebrow}
        </Typography>
        <Typography component="h1" variant="h2">
          {PATIENT_DOCTORS_TEXT.title}
        </Typography>
        <Typography color="text.secondary">
          {PATIENT_DOCTORS_TEXT.subtitle}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        useFlexGap
        sx={{ alignItems: { xs: "stretch", md: "center" } }}
      >
        <TextField
          label={PATIENT_DOCTORS_TEXT.searchLabel}
          placeholder={PATIENT_DOCTORS_TEXT.searchPlaceholder}
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ flex: 2, minWidth: 0 }}
        />
        <TextField
          select
          label={PATIENT_DOCTORS_TEXT.departmentFilterLabel}
          size="small"
          value={departmentFilter ?? ""}
          onChange={(event) =>
            onDepartmentFilterChange(parseDepartmentFilter(event.target.value))
          }
          sx={{ flex: 1, minWidth: 0 }}
        >
          <MenuItem value="">{PATIENT_DOCTORS_TEXT.allDepartments}</MenuItem>
          {departments.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import type { Department } from "@/types/department";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

interface DoctorsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  departments: readonly Department[];
  departmentFilter: number | null;
  onDepartmentFilterChange: (departmentId: number | null) => void;
  departmentFilterDisabled: boolean;
  createDisabled: boolean;
  onCreate: () => void;
}

function parseDepartmentFilter(value: string): number | null {
  if (!value) {
    return null;
  }

  const departmentId = Number(value);
  return Number.isInteger(departmentId) && departmentId > 0 ? departmentId : null;
}

export function DoctorsHeader({
  search,
  onSearchChange,
  departments,
  departmentFilter,
  onDepartmentFilterChange,
  departmentFilterDisabled,
  createDisabled,
  onCreate,
}: DoctorsHeaderProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="primary.main">
          {DOCTORS_TEXT.eyebrow}
        </Typography>
        <Typography variant="h1">{DOCTORS_TEXT.title}</Typography>
        <Typography color="text.secondary">{DOCTORS_TEXT.subtitle}</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        useFlexGap
        sx={{
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <TextField
          label={DOCTORS_TEXT.searchLabel}
          placeholder={DOCTORS_TEXT.searchPlaceholder}
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ flex: 2, minWidth: 0 }}
        />
        <TextField
          select
          label={DOCTORS_TEXT.departmentFilterLabel}
          size="small"
          value={departmentFilter ?? ""}
          disabled={departmentFilterDisabled}
          onChange={(event) =>
            onDepartmentFilterChange(parseDepartmentFilter(event.target.value))
          }
          sx={{ flex: 1, minWidth: 0 }}
        >
          <MenuItem value="">
            {DOCTORS_TEXT.allDepartments}
          </MenuItem>
          {departments.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          size="small"
          startIcon={<AddOutlinedIcon />}
          disabled={createDisabled}
          onClick={onCreate}
        >
          {DOCTORS_TEXT.createAction}
        </Button>
      </Stack>
    </Stack>
  );
}

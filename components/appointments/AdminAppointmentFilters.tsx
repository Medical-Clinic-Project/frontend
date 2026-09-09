"use client";

import { Autocomplete, Button, MenuItem, Stack, TextField } from "@mui/material";
import { APPOINTMENT_STATUS_VALUES } from "@/constants/appointments";
import type { AppointmentStatus } from "@/types/appointment";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";
import { ADMIN_APPOINTMENTS_TEXT } from "@/views/adminAppointments/AdminAppointmentsText";

interface AdminAppointmentFilterValues {
  search: string;
  status: AppointmentStatus | null;
  doctorId: number | null;
  departmentId: number | null;
  appointmentDate: string;
  selectedPatient: Patient | null;
  patientSearch: string;
  hasFilters: boolean;
}

interface AdminAppointmentFilterOptions {
  departments: readonly Department[];
  doctors: readonly Doctor[];
  patientOptions: readonly Patient[];
  isFilterOptionsLoading: boolean;
  isPatientOptionsLoading: boolean;
}

interface AdminAppointmentFilterActions {
  setSearch: (value: string) => void;
  setStatus: (value: AppointmentStatus | null) => void;
  setDoctorId: (value: number | null) => void;
  setDepartmentId: (value: number | null) => void;
  setAppointmentDate: (value: string) => void;
  setPatient: (value: Patient | null) => void;
  setPatientSearch: (value: string) => void;
  clearFilters: () => void;
}

interface AdminAppointmentFiltersProps {
  filters: AdminAppointmentFilterValues;
  options: AdminAppointmentFilterOptions;
  actions: AdminAppointmentFilterActions;
}

function parseIdentifier(value: string): number | null {
  if (!value) {
    return null;
  }

  const identifier = Number(value);
  return Number.isInteger(identifier) && identifier > 0 ? identifier : null;
}

function parseStatus(value: string): AppointmentStatus | null {
  return APPOINTMENT_STATUS_VALUES.includes(value as AppointmentStatus)
    ? (value as AppointmentStatus)
    : null;
}

export function AdminAppointmentFilters({
  filters,
  options,
  actions,
}: AdminAppointmentFiltersProps) {
  const {
    search,
    status,
    doctorId,
    departmentId,
    appointmentDate,
    selectedPatient,
    patientSearch,
    hasFilters,
  } = filters;
  const {
    departments,
    doctors,
    patientOptions,
    isFilterOptionsLoading,
    isPatientOptionsLoading,
  } = options;
  const {
    setSearch,
    setStatus,
    setDoctorId,
    setDepartmentId,
    setAppointmentDate,
    setPatient,
    setPatientSearch,
    clearFilters,
  } = actions;

  return (
    <Stack spacing={2} sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap>
        <TextField
          label={ADMIN_APPOINTMENTS_TEXT.filters.searchLabel}
          placeholder={ADMIN_APPOINTMENTS_TEXT.filters.searchPlaceholder}
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ flex: 2, minWidth: 0 }}
        />
        <TextField
          select
          label={ADMIN_APPOINTMENTS_TEXT.filters.statusLabel}
          size="small"
          value={status ?? ""}
          onChange={(event) => setStatus(parseStatus(event.target.value))}
          sx={{ flex: 1, minWidth: 0 }}
        >
          <MenuItem value="">{ADMIN_APPOINTMENTS_TEXT.filters.allStatuses}</MenuItem>
          {APPOINTMENT_STATUS_VALUES.map((option) => (
            <MenuItem key={option} value={option}>
              {ADMIN_APPOINTMENTS_TEXT.statuses[option]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={ADMIN_APPOINTMENTS_TEXT.filters.departmentLabel}
          size="small"
          value={departmentId ?? ""}
          disabled={isFilterOptionsLoading}
          onChange={(event) => setDepartmentId(parseIdentifier(event.target.value))}
          sx={{ flex: 1, minWidth: 0 }}
        >
          <MenuItem value="">{ADMIN_APPOINTMENTS_TEXT.filters.allDepartments}</MenuItem>
          {departments.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap>
        <TextField
          select
          label={ADMIN_APPOINTMENTS_TEXT.filters.doctorLabel}
          size="small"
          value={doctorId ?? ""}
          disabled={isFilterOptionsLoading}
          onChange={(event) => setDoctorId(parseIdentifier(event.target.value))}
          sx={{ flex: 1, minWidth: 0 }}
        >
          <MenuItem value="">{ADMIN_APPOINTMENTS_TEXT.filters.allDoctors}</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.fullName}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          options={patientOptions}
          value={selectedPatient}
          inputValue={patientSearch}
          loading={isPatientOptionsLoading}
          filterOptions={(options) => options}
          getOptionLabel={(patient) =>
            `${patient.fullName} (${patient.email})`
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText={ADMIN_APPOINTMENTS_TEXT.filters.noPatients}
          onChange={(_, value) => setPatient(value)}
          onInputChange={(_, value, reason) => {
            if (reason !== "reset") {
              setPatientSearch(value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={ADMIN_APPOINTMENTS_TEXT.filters.patientLabel}
              placeholder={ADMIN_APPOINTMENTS_TEXT.filters.patientPlaceholder}
              size="small"
            />
          )}
          sx={{ flex: 1, minWidth: 0 }}
        />
        <TextField
          label={ADMIN_APPOINTMENTS_TEXT.filters.dateLabel}
          size="small"
          type="date"
          value={appointmentDate}
          onChange={(event) => setAppointmentDate(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1, minWidth: 0 }}
        />
        <Button
          size="small"
          variant="text"
          disabled={!hasFilters}
          onClick={clearFilters}
        >
          {ADMIN_APPOINTMENTS_TEXT.filters.clear}
        </Button>
      </Stack>
    </Stack>
  );
}

"use client";

import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getPatientsDataGridColumns } from "@/components/tables/PatientsDataGridColumns";
import type { Patient } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

interface PatientsDataGridProps {
  patients: readonly Patient[];
  onView: (patient: Patient) => void;
  onRequestStatusChange: (patient: Patient) => void;
  statusUpdatingId: number | null;
}

export function PatientsDataGrid({
  patients,
  onView,
  onRequestStatusChange,
  statusUpdatingId,
}: PatientsDataGridProps) {
  const columns = useMemo(
    () =>
      getPatientsDataGridColumns({
        onView,
        onRequestStatusChange,
        statusUpdatingId,
      }),
    [onRequestStatusChange, onView, statusUpdatingId],
  );

  return (
    <DataGrid
      autoHeight
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      disableColumnSorting
      disableRowSelectionOnClick
      hideFooter
      label={PATIENTS_TEXT.accessibility.tableLabel}
      rows={patients}
    />
  );
}

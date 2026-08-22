"use client";

import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getDoctorsDataGridColumns } from "@/components/tables/DoctorsDataGridColumns";
import type { Doctor } from "@/types/doctor";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

interface DoctorsDataGridProps {
  doctors: readonly Doctor[];
  onEdit: (doctor: Doctor) => void;
  onToggleStatus: (doctor: Doctor) => void | Promise<void>;
  statusUpdatingId: number | null;
}

export function DoctorsDataGrid({
  doctors,
  onEdit,
  onToggleStatus,
  statusUpdatingId,
}: DoctorsDataGridProps) {
  const columns = useMemo(
    () =>
      getDoctorsDataGridColumns({
        onEdit,
        onToggleStatus,
        statusUpdatingId,
      }),
    [onEdit, onToggleStatus, statusUpdatingId],
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
      label={DOCTORS_TEXT.accessibility.tableLabel}
      rows={doctors}
    />
  );
}

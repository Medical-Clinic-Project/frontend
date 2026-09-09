"use client";

import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getDepartmentsDataGridColumns } from "@/components/tables/DepartmentsDataGridColumns";
import type { Department } from "@/types/department";
import { DEPARTMENTS_TEXT } from "@/views/departments/DepartmentsText";

interface DepartmentsDataGridProps {
  departments: readonly Department[];
  onEdit: (department: Department) => void;
  onToggleStatus: (department: Department) => void | Promise<void>;
  statusUpdatingId: number | null;
}

export function DepartmentsDataGrid({
  departments,
  onEdit,
  onToggleStatus,
  statusUpdatingId,
}: DepartmentsDataGridProps) {
  const columns = useMemo(
    () =>
      getDepartmentsDataGridColumns({
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
      label={DEPARTMENTS_TEXT.title}
      rows={departments}
    />
  );
}

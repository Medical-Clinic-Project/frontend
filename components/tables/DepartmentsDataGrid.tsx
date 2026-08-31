"use client";

import { useMemo } from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Chip, CircularProgress, Tooltip, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import {
  DEPARTMENT_GRID_COLUMN_WIDTHS,
  DEPARTMENT_GRID_FIELDS,
} from "@/constants/departments";
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
  const columns = useMemo<GridColDef<Department>[]>(
    () => [
      {
        field: DEPARTMENT_GRID_FIELDS.name,
        headerName: DEPARTMENTS_TEXT.table.name,
        rowHeader: true,
        flex: 1,
        minWidth: DEPARTMENT_GRID_COLUMN_WIDTHS.name,
        renderCell: (params) => (
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        ),
      },
      {
        field: DEPARTMENT_GRID_FIELDS.description,
        headerName: DEPARTMENTS_TEXT.table.description,
        flex: 2,
        minWidth: DEPARTMENT_GRID_COLUMN_WIDTHS.description,
        renderCell: (params) => (
          <Tooltip title={params.value} arrow>
            <Typography variant="body2" color="text.secondary" noWrap>
              {params.value}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: DEPARTMENT_GRID_FIELDS.status,
        headerName: DEPARTMENTS_TEXT.table.status,
        minWidth: DEPARTMENT_GRID_COLUMN_WIDTHS.status,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Chip
            color={params.row.isActive ? "success" : "default"}
            label={
              params.row.isActive
                ? DEPARTMENTS_TEXT.status.active
                : DEPARTMENTS_TEXT.status.inactive
            }
            size="small"
            variant={params.row.isActive ? "filled" : "outlined"}
          />
        ),
      },
      {
        field: DEPARTMENT_GRID_FIELDS.actions,
        type: "actions",
        headerName: DEPARTMENTS_TEXT.table.actions,
        minWidth: DEPARTMENT_GRID_COLUMN_WIDTHS.actions,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const department = params.row;
          const isStatusUpdating = statusUpdatingId === department.id;
          const statusActionLabel = department.isActive
            ? isStatusUpdating
              ? DEPARTMENTS_TEXT.actions.deactivating
              : DEPARTMENTS_TEXT.actions.deactivate
            : isStatusUpdating
              ? DEPARTMENTS_TEXT.actions.activating
              : DEPARTMENTS_TEXT.actions.activate;

          return (
            <GridActionsCell {...params}>
              <GridActionsCellItem
                icon={<EditOutlinedIcon />}
                label={DEPARTMENTS_TEXT.actions.edit}
                disabled={isStatusUpdating}
                onClick={() => onEdit(department)}
              />
              <GridActionsCellItem
                icon={
                  isStatusUpdating ? (
                    <CircularProgress
                      size={20}
                      color={department.isActive ? "warning" : "success"}
                      aria-label={statusActionLabel}
                    />
                  ) : department.isActive ? (
                    <BlockOutlinedIcon color="warning" />
                  ) : (
                    <CheckCircleOutlinedIcon color="success" />
                  )
                }
                label={statusActionLabel}
                disabled={isStatusUpdating}
                onClick={() => void onToggleStatus(department)}
              />
            </GridActionsCell>
          );
        },
      },
    ],
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

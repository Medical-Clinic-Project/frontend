import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Chip, CircularProgress, Tooltip, Typography } from "@mui/material";
import {
  GridActionsCell,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import {
  DOCTOR_GRID_COLUMN_WIDTHS,
  DOCTOR_GRID_FIELDS,
} from "@/constants/doctors";
import type { Doctor } from "@/types/doctor";
import { DOCTORS_TEXT } from "@/views/doctors/DoctorsText";

interface DoctorsDataGridColumnOptions {
  onEdit: (doctor: Doctor) => void;
  onToggleStatus: (doctor: Doctor) => void | Promise<void>;
  statusUpdatingId: number | null;
}

export function getDoctorsDataGridColumns({
  onEdit,
  onToggleStatus,
  statusUpdatingId,
}: DoctorsDataGridColumnOptions): GridColDef<Doctor>[] {
  return [
    {
      field: DOCTOR_GRID_FIELDS.fullName,
      headerName: DOCTORS_TEXT.table.doctor,
      rowHeader: true,
      flex: 1,
      minWidth: DOCTOR_GRID_COLUMN_WIDTHS.fullName,
      renderCell: (params) => (
        <Tooltip title={params.row.fullName} arrow>
          <Typography variant="body2" noWrap>
            {params.row.fullName}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: DOCTOR_GRID_FIELDS.email,
      headerName: DOCTORS_TEXT.table.email,
      flex: 1,
      minWidth: DOCTOR_GRID_COLUMN_WIDTHS.email,
      renderCell: (params) => (
        <Tooltip title={params.row.email} arrow>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.row.email}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: DOCTOR_GRID_FIELDS.department,
      headerName: DOCTORS_TEXT.table.department,
      flex: 1,
      minWidth: DOCTOR_GRID_COLUMN_WIDTHS.department,
      renderCell: (params) => (
        <Tooltip title={params.row.department.name} arrow>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.row.department.name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: DOCTOR_GRID_FIELDS.status,
      headerName: DOCTORS_TEXT.table.status,
      minWidth: DOCTOR_GRID_COLUMN_WIDTHS.status,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Chip
          color={params.row.isActive ? "success" : "default"}
          label={
            params.row.isActive
              ? DOCTORS_TEXT.status.active
              : DOCTORS_TEXT.status.inactive
          }
          size="small"
          variant={params.row.isActive ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: DOCTOR_GRID_FIELDS.actions,
      type: "actions",
      headerName: DOCTORS_TEXT.table.actions,
      minWidth: DOCTOR_GRID_COLUMN_WIDTHS.actions,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const doctor = params.row;
        const isStatusUpdating = statusUpdatingId === doctor.id;
        const statusActionLabel = doctor.isActive
          ? isStatusUpdating
            ? DOCTORS_TEXT.actions.deactivating
            : DOCTORS_TEXT.actions.deactivate
          : isStatusUpdating
            ? DOCTORS_TEXT.actions.activating
            : DOCTORS_TEXT.actions.activate;

        return (
          <GridActionsCell {...params}>
            <GridActionsCellItem
              icon={<EditOutlinedIcon />}
              label={DOCTORS_TEXT.accessibility.editDoctor(doctor.fullName)}
              disabled={isStatusUpdating}
              onClick={() => onEdit(doctor)}
            />
            <GridActionsCellItem
              icon={
                isStatusUpdating ? (
                  <CircularProgress
                    size={20}
                    color={doctor.isActive ? "warning" : "success"}
                    aria-label={statusActionLabel}
                  />
                ) : doctor.isActive ? (
                  <BlockOutlinedIcon color="warning" />
                ) : (
                  <CheckCircleOutlinedIcon color="success" />
                )
              }
              label={statusActionLabel}
              disabled={isStatusUpdating}
              onClick={() => void onToggleStatus(doctor)}
            />
          </GridActionsCell>
        );
      },
    },
  ];
}

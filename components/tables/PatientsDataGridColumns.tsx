import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Chip, CircularProgress, Tooltip, Typography } from "@mui/material";
import {
  GridActionsCell,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import {
  PATIENT_GRID_COLUMN_WIDTHS,
  PATIENT_GRID_FIELDS,
} from "@/constants/patients";
import type { Patient } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/PatientsText";

interface PatientsDataGridColumnOptions {
  onView: (patient: Patient) => void;
  onRequestStatusChange: (patient: Patient) => void;
  statusUpdatingId: number | null;
}

export function getPatientsDataGridColumns({
  onView,
  onRequestStatusChange,
  statusUpdatingId,
}: PatientsDataGridColumnOptions): GridColDef<Patient>[] {
  return [
    {
      field: PATIENT_GRID_FIELDS.fullName,
      headerName: PATIENTS_TEXT.table.patient,
      rowHeader: true,
      flex: 1,
      minWidth: PATIENT_GRID_COLUMN_WIDTHS.fullName,
      renderCell: (params) => (
        <Tooltip title={params.row.fullName} arrow>
          <Typography variant="body2" noWrap>
            {params.row.fullName}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: PATIENT_GRID_FIELDS.email,
      headerName: PATIENTS_TEXT.table.email,
      flex: 1,
      minWidth: PATIENT_GRID_COLUMN_WIDTHS.email,
      renderCell: (params) => (
        <Tooltip title={params.row.email} arrow>
          <Typography variant="body2" color="text.secondary" noWrap>
            {params.row.email}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: PATIENT_GRID_FIELDS.status,
      headerName: PATIENTS_TEXT.table.status,
      minWidth: PATIENT_GRID_COLUMN_WIDTHS.status,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Chip
          color={params.row.isActive ? "success" : "default"}
          label={
            params.row.isActive
              ? PATIENTS_TEXT.status.active
              : PATIENTS_TEXT.status.inactive
          }
          size="small"
          variant={params.row.isActive ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: PATIENT_GRID_FIELDS.actions,
      type: "actions",
      headerName: PATIENTS_TEXT.table.actions,
      minWidth: PATIENT_GRID_COLUMN_WIDTHS.actions,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const patient = params.row;
        const isStatusUpdating = statusUpdatingId === patient.id;
        const statusActionLabel = patient.isActive
          ? isStatusUpdating
            ? PATIENTS_TEXT.actions.deactivating
            : PATIENTS_TEXT.accessibility.deactivatePatient(patient.fullName)
          : isStatusUpdating
            ? PATIENTS_TEXT.actions.activating
            : PATIENTS_TEXT.accessibility.activatePatient(patient.fullName);

        return (
          <GridActionsCell {...params}>
            <GridActionsCellItem
              icon={<VisibilityOutlinedIcon />}
              label={PATIENTS_TEXT.accessibility.viewPatient(patient.fullName)}
              disabled={isStatusUpdating}
              onClick={() => onView(patient)}
            />
            <GridActionsCellItem
              icon={
                isStatusUpdating ? (
                  <CircularProgress
                    size={20}
                    color={patient.isActive ? "warning" : "success"}
                    aria-label={statusActionLabel}
                  />
                ) : patient.isActive ? (
                  <BlockOutlinedIcon color="warning" />
                ) : (
                  <CheckCircleOutlinedIcon color="success" />
                )
              }
              label={statusActionLabel}
              disabled={isStatusUpdating}
              onClick={() => onRequestStatusChange(patient)}
            />
          </GridActionsCell>
        );
      },
    },
  ];
}

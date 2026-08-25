import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Patient } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

const TABLE_COLUMN_CLASSES = {
  patient: "PatientsTable-patientColumn",
  email: "PatientsTable-emailColumn",
  status: "PatientsTable-statusColumn",
  actions: "PatientsTable-actionsColumn",
} as const;

const PatientsDataTable = styled(Table)(({ theme }) => ({
  tableLayout: "fixed",
  minWidth: theme.spacing(93),
  [`& .${TABLE_COLUMN_CLASSES.patient}`]: {
    width: theme.spacing(26),
    overflow: "hidden",
  },
  [`& .${TABLE_COLUMN_CLASSES.email}`]: {
    width: theme.spacing(30),
    overflow: "hidden",
  },
  [`& .${TABLE_COLUMN_CLASSES.status}`]: {
    width: theme.spacing(12),
  },
  [`& .${TABLE_COLUMN_CLASSES.actions}`]: {
    width: theme.spacing(25),
    whiteSpace: "nowrap",
  },
}));

const TruncatedText = styled(Typography)({
  display: "block",
  width: "100%",
  minWidth: 0,
  overflow: "hidden",
  overflowWrap: "anywhere",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

interface PatientsTableProps {
  patients: readonly Patient[];
  onView: (patient: Patient) => void;
  onRequestStatusChange: (patient: Patient) => void;
}

export function PatientsTable({
  patients,
  onView,
  onRequestStatusChange,
}: PatientsTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" tabIndex={0}>
      <PatientsDataTable
        size="small"
        aria-label={PATIENTS_TEXT.accessibility.tableLabel}
      >
        <TableHead>
          <TableRow>
            <TableCell className={TABLE_COLUMN_CLASSES.patient}>
              {PATIENTS_TEXT.table.patient}
            </TableCell>
            <TableCell className={TABLE_COLUMN_CLASSES.email}>
              {PATIENTS_TEXT.table.email}
            </TableCell>
            <TableCell className={TABLE_COLUMN_CLASSES.status}>
              {PATIENTS_TEXT.table.status}
            </TableCell>
            <TableCell className={TABLE_COLUMN_CLASSES.actions}>
              {PATIENTS_TEXT.table.actions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} hover>
              <TableCell
                component="th"
                scope="row"
                className={TABLE_COLUMN_CLASSES.patient}
              >
                <Tooltip title={patient.fullName} arrow>
                  <TruncatedText sx={{ fontWeight: 650 }}>
                    {patient.fullName}
                  </TruncatedText>
                </Tooltip>
              </TableCell>
              <TableCell className={TABLE_COLUMN_CLASSES.email}>
                <Tooltip title={patient.email} arrow>
                  <TruncatedText variant="body2" color="text.secondary">
                    {patient.email}
                  </TruncatedText>
                </Tooltip>
              </TableCell>
              <TableCell className={TABLE_COLUMN_CLASSES.status}>
                <Chip
                  color={patient.isActive ? "success" : "default"}
                  label={
                    patient.isActive
                      ? PATIENTS_TEXT.status.active
                      : PATIENTS_TEXT.status.inactive
                  }
                  size="small"
                  variant={patient.isActive ? "filled" : "outlined"}
                />
              </TableCell>
              <TableCell className={TABLE_COLUMN_CLASSES.actions}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Button
                    variant="text"
                    size="small"
                    aria-label={PATIENTS_TEXT.accessibility.viewPatient(
                      patient.fullName,
                    )}
                    onClick={() => onView(patient)}
                  >
                    {PATIENTS_TEXT.actions.view}
                  </Button>
                  <Button
                    color={patient.isActive ? "warning" : "success"}
                    variant="outlined"
                    size="small"
                    aria-label={
                      patient.isActive
                        ? PATIENTS_TEXT.accessibility.deactivatePatient(
                            patient.fullName,
                          )
                        : PATIENTS_TEXT.accessibility.activatePatient(
                            patient.fullName,
                          )
                    }
                    onClick={() => onRequestStatusChange(patient)}
                  >
                    {patient.isActive
                      ? PATIENTS_TEXT.actions.deactivate
                      : PATIENTS_TEXT.actions.activate}
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </PatientsDataTable>
    </TableContainer>
  );
}

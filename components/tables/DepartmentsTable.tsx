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
import type { Department } from "@/types/department";
import { DEPARTMENTS_TEXT } from "@/views/departments/Departments.text";

const TABLE_COLUMN_CLASSES = {
  name: "DepartmentsTable-nameColumn",
  description: "DepartmentsTable-descriptionColumn",
  status: "DepartmentsTable-statusColumn",
  actions: "DepartmentsTable-actionsColumn",
} as const;

const DepartmentsDataTable = styled(Table)(({ theme }) => ({
  tableLayout: "fixed",
  minWidth: theme.spacing(80),
  [`& .${TABLE_COLUMN_CLASSES.name}`]: {
    width: theme.spacing(20),
  },
  [`& .${TABLE_COLUMN_CLASSES.description}`]: {
    overflow: "hidden",
  },
  [`& .${TABLE_COLUMN_CLASSES.status}`]: {
    width: theme.spacing(12),
  },
  [`& .${TABLE_COLUMN_CLASSES.actions}`]: {
    width: theme.spacing(25),
  },
}));

const DescriptionText = styled(Typography)({
  width: "100%",
  overflow: "hidden",
  overflowWrap: "anywhere",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

interface DepartmentsTableProps {
  departments: readonly Department[];
  onEdit: (department: Department) => void;
  onToggleStatus: (department: Department) => void | Promise<void>;
  statusUpdatingId: number | null;
}

export function DepartmentsTable({
  departments,
  onEdit,
  onToggleStatus,
  statusUpdatingId,
}: DepartmentsTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <DepartmentsDataTable size="small">
        <TableHead>
          <TableRow>
            <TableCell className={TABLE_COLUMN_CLASSES.name}>
              {DEPARTMENTS_TEXT.table.name}
            </TableCell>
            <TableCell className={TABLE_COLUMN_CLASSES.description}>
              {DEPARTMENTS_TEXT.table.description}
            </TableCell>
            <TableCell className={TABLE_COLUMN_CLASSES.status}>
              {DEPARTMENTS_TEXT.table.status}
            </TableCell>
            <TableCell className={TABLE_COLUMN_CLASSES.actions}>
              {DEPARTMENTS_TEXT.table.actions}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((department) => {
            const isUpdatingStatus = statusUpdatingId === department.id;

            return (
              <TableRow key={department.id} hover>
                <TableCell component="th" scope="row">
                  <Typography sx={{ fontWeight: 650 }}>{department.name}</Typography>
                </TableCell>
                <TableCell className={TABLE_COLUMN_CLASSES.description}>
                  <Tooltip title={department.description} arrow>
                    <DescriptionText variant="body2" color="text.secondary">
                      {department.description}
                    </DescriptionText>
                  </Tooltip>
                </TableCell>
                <TableCell className={TABLE_COLUMN_CLASSES.status}>
                  <Chip
                    color={department.isActive ? "success" : "default"}
                    label={
                      department.isActive
                        ? DEPARTMENTS_TEXT.status.active
                        : DEPARTMENTS_TEXT.status.inactive
                    }
                    size="small"
                    variant={department.isActive ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell className={TABLE_COLUMN_CLASSES.actions}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => onEdit(department)}
                    >
                      {DEPARTMENTS_TEXT.actions.edit}
                    </Button>
                    <Button
                      color={department.isActive ? "warning" : "success"}
                      variant="outlined"
                      size="small"
                      loading={isUpdatingStatus}
                      disabled={statusUpdatingId !== null}
                      onClick={() => void onToggleStatus(department)}
                    >
                      {department.isActive
                        ? DEPARTMENTS_TEXT.actions.deactivate
                        : DEPARTMENTS_TEXT.actions.activate}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </DepartmentsDataTable>
    </TableContainer>
  );
}

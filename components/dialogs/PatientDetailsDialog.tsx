import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { Patient } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

interface PatientDetailsDialogProps {
  open: boolean;
  patient: Patient | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void | Promise<void>;
}

export function PatientDetailsDialog({
  open,
  patient,
  isLoading,
  error,
  onClose,
  onRetry,
}: PatientDetailsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{PATIENTS_TEXT.detailsDialog.title}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Stack
            spacing={2}
            role="status"
            aria-label={PATIENTS_TEXT.detailsLoading}
            aria-live="polite"
            aria-busy="true"
          >
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
          </Stack>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void onRetry()}>
                {PATIENTS_TEXT.retry}
              </Button>
            }
          >
            {error}
          </Alert>
        ) : patient ? (
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {PATIENTS_TEXT.detailsDialog.fullNameLabel}
              </Typography>
              <Typography>{patient.fullName}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {PATIENTS_TEXT.detailsDialog.emailLabel}
              </Typography>
              <Typography sx={{ overflowWrap: "anywhere" }}>
                {patient.email}
              </Typography>
            </Stack>
            <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
              <Typography variant="caption" color="text.secondary">
                {PATIENTS_TEXT.detailsDialog.statusLabel}
              </Typography>
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
            </Stack>
          </Stack>
        ) : (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={() => void onRetry()}>
                {PATIENTS_TEXT.retry}
              </Button>
            }
          >
            {PATIENTS_TEXT.detailsDialog.unavailable}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          {PATIENTS_TEXT.detailsDialog.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

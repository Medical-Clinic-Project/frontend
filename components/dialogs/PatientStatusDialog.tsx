import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Patient } from "@/types/patient";
import { PATIENTS_TEXT } from "@/views/patients/Patients.text";

interface PatientStatusDialogProps {
  open: boolean;
  patient: Patient | null;
  isUpdating: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function PatientStatusDialog({
  open,
  patient,
  isUpdating,
  error,
  onClose,
  onConfirm,
}: PatientStatusDialogProps) {
  const isDeactivation = Boolean(patient?.isActive);
  const title = patient
    ? isDeactivation
      ? PATIENTS_TEXT.statusDialog.deactivateTitle
      : PATIENTS_TEXT.statusDialog.activateTitle
    : PATIENTS_TEXT.statusDialog.title;

  return (
    <Dialog
      open={open}
      onClose={isUpdating ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography color="text.secondary">
            {patient
              ? isDeactivation
                ? PATIENTS_TEXT.statusDialog.deactivateDescription(
                    patient.fullName,
                  )
                : PATIENTS_TEXT.statusDialog.activateDescription(patient.fullName)
              : PATIENTS_TEXT.statusDialog.unavailable}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={isUpdating} onClick={onClose}>
          {PATIENTS_TEXT.statusDialog.cancel}
        </Button>
        <Button
          color={isDeactivation ? "warning" : "success"}
          loading={isUpdating}
          disabled={!patient}
          onClick={() => void onConfirm()}
        >
          {isDeactivation
            ? PATIENTS_TEXT.statusDialog.deactivate
            : PATIENTS_TEXT.statusDialog.activate}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

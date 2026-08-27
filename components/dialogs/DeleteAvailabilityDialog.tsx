import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { DoctorAvailability } from "@/types/doctorAvailability";
import { formatAvailabilityRange } from "@/views/doctorAvailability/doctorAvailabilityDates";
import { DOCTOR_AVAILABILITY_TEXT } from "@/views/doctorAvailability/DoctorAvailabilityView.text";

interface DeleteAvailabilityDialogProps {
  open: boolean;
  availability: DoctorAvailability | null;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function DeleteAvailabilityDialog({
  open,
  availability,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteAvailabilityDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        {DOCTOR_AVAILABILITY_TEXT.deleteDialog.title}
      </DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography color="text.secondary">
            {availability
              ? DOCTOR_AVAILABILITY_TEXT.deleteDialog.description(
                  formatAvailabilityRange(availability),
                )
              : DOCTOR_AVAILABILITY_TEXT.deleteDialog.unavailable}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={isDeleting} onClick={onClose}>
          {DOCTOR_AVAILABILITY_TEXT.deleteDialog.cancel}
        </Button>
        <Button
          color="error"
          loading={isDeleting}
          disabled={!availability}
          onClick={() => void onConfirm()}
        >
          {DOCTOR_AVAILABILITY_TEXT.deleteDialog.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

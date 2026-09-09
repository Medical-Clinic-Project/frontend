import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  type ButtonProps,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmColor?: ButtonProps["color"];
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  confirmColor = "primary",
  isConfirming,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isConfirming ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={isConfirming} onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          color={confirmColor}
          loading={isConfirming}
          onClick={() => void onConfirm()}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

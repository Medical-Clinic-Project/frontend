export const APPOINTMENT_BOOKING_DIALOG_TEXT = {
  title: "Book appointment",
  doctorLabel: "Doctor",
  departmentLabel: "Department",
  slotLabel: "Appointment time",
  reasonLabel: "Reason for visit",
  notesLabel: "Additional notes",
  optionalField: "Optional",
  cancel: "Cancel",
  confirm: "Book appointment",
  validation: {
    reasonMaximum: "Reason must be 500 characters or fewer.",
    notesMaximum: "Notes must be 2000 characters or fewer.",
  },
} as const;

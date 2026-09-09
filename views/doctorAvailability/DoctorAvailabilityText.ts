export const DOCTOR_AVAILABILITY_TEXT = {
  metadataTitle: "Doctor availability",
  eyebrow: "Doctor workspace",
  title: "Availability",
  subtitle:
    "Plan the concrete time slots when patients can find you available.",
  addAction: "Add availability",
  retry: "Try again",
  navigation: {
    previous: "Previous",
    today: "Today",
    next: "Next",
  },
  viewMode: {
    label: "Calendar view",
    day: "Day",
    week: "Week",
  },
  calendar: {
    time: "Time",
    dragHint: "Drag a slot to move it, or select it to edit.",
    slotLabel: (start: string, end: string) =>
      `Availability from ${start} to ${end}. Select to edit or drag to move.`,
    slotTooltip: (start: string, end: string) => `${start} - ${end}`,
  },
  loading: "Loading availability...",
  empty: {
    title: "No availability for this period",
    description:
      "Add a slot or navigate to another date to manage your schedule.",
  },
  form: {
    createTitle: "Add availability",
    editTitle: "Edit availability",
    startTimeLabel: "Start date and time",
    endTimeLabel: "End date and time",
    cancel: "Cancel",
    create: "Add availability",
    save: "Save changes",
  },
  deleteDialog: {
    title: "Delete availability?",
    description: (range: string) =>
      `The availability slot ${range} will be permanently removed.`,
    unavailable: "This availability slot is no longer available.",
    cancel: "Cancel",
    confirm: "Delete",
  },
  validation: {
    startTimeRequired: "Start date and time is required.",
    endTimeRequired: "End date and time is required.",
    invalidDateTime: "Enter a valid date and time.",
    endAfterStart: "End time must be after start time.",
    pastStart: "Availability cannot start in the past.",
  },
  errors: {
    load: "Unable to load availability. Please try again.",
    save: "Unable to save availability. Please try again.",
    delete: "Unable to delete availability. Please try again.",
    move: "Unable to move availability. The previous time was restored.",
    movePast: "Availability cannot be moved into the past.",
  },
  feedback: {
    created: "Availability was added successfully.",
    updated: "Availability was updated successfully.",
    deleted: "Availability was deleted successfully.",
    moved: "Availability was moved successfully.",
  },
} as const;

export const APPOINTMENT_SLOT_SELECTOR_TEXT = {
  navigation: {
    previous: "Previous",
    today: "Today",
    next: "Next",
  },
  viewMode: {
    label: "Availability calendar view",
    day: "Day",
    week: "Week",
  },
  calendar: {
    hint: "Select an available slot to continue.",
    time: "Time",
    slotLabel: (start: string, end: string) =>
      `Availability from ${start} to ${end}. Select to continue.`,
    slotTooltip: (start: string, end: string) => `${start} - ${end}`,
  },
  loading: "Loading available appointment slots...",
  retry: "Try again",
  empty: {
    title: "No available slots for this period",
    description: "Choose another date to see this doctor's availability.",
  },
} as const;

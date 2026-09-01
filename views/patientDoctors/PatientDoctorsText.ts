export const PATIENT_DOCTORS_TEXT = {
  metadataTitle: "Find a doctor",
  eyebrow: "Patient workspace",
  title: "Find a doctor",
  subtitle: "Search active doctors and choose a time that works for you.",
  searchLabel: "Search doctors",
  searchPlaceholder: "Search by doctor name",
  departmentFilterLabel: "Filter by department",
  allDepartments: "All departments",
  retry: "Try again",
  detailsAction: "View availability",
  empty: {
    title: "No doctors available yet",
    description: "Please check again later for available clinic doctors.",
  },
  noResults: {
    title: "No matching doctors",
    description: "Try another doctor name or department.",
  },
  details: {
    back: "Back to doctors",
    title: "Doctor details",
    departmentLabel: "Department",
    availabilityTitle: "Choose an appointment slot",
    unavailable: "Doctor details are unavailable.",
  },
  errors: {
    load: "Unable to load doctors. Please try again.",
    details: "Unable to load doctor details. Please try again.",
    availability: "Unable to load this doctor's availability. Please try again.",
    book: "Unable to book the appointment. Please try again.",
  },
  feedback: {
    booked: "Your appointment was booked successfully.",
  },
} as const;

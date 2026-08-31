export const PATIENTS_TEXT = {
  metadataTitle: "Patients",
  eyebrow: "Admin workspace",
  title: "Patients",
  subtitle: "Review patient accounts, details, and access status.",
  searchLabel: "Search patients",
  searchPlaceholder: "Search by name or email",
  statusFilterLabel: "Filter by status",
  statusFilters: {
    all: "All statuses",
    active: "Active",
    inactive: "Inactive",
  },
  loading: "Loading patients…",
  detailsLoading: "Loading patient details…",
  retry: "Try again",
  table: {
    patient: "Patient",
    email: "Email",
    status: "Status",
    actions: "Actions",
  },
  status: {
    active: "Active",
    inactive: "Inactive",
  },
  actions: {
    view: "View",
    activate: "Activate",
    deactivate: "Deactivate",
    activating: "Activating",
    deactivating: "Deactivating",
  },
  empty: {
    title: "No patients yet",
    description: "Patient accounts will appear here after registration.",
  },
  noResults: {
    title: "No matching patients",
    description: "Try a different search or status filter.",
  },
  detailsDialog: {
    title: "Patient details",
    fullNameLabel: "Full name",
    emailLabel: "Email address",
    statusLabel: "Status",
    unavailable: "Patient details are unavailable.",
    close: "Close",
  },
  statusDialog: {
    title: "Update patient status",
    activateTitle: "Activate patient",
    deactivateTitle: "Deactivate patient",
    activateDescription: (name: string) =>
      `Activate ${name}? They will be able to access their patient account again.`,
    deactivateDescription: (name: string) =>
      `Deactivate ${name}? They will no longer be able to access their patient account.`,
    unavailable: "Patient status information is unavailable.",
    cancel: "Cancel",
    activate: "Activate",
    deactivate: "Deactivate",
  },
  accessibility: {
    tableLabel: "Patients",
    viewPatient: (name: string) => `View details for ${name}`,
    activatePatient: (name: string) => `Activate ${name}`,
    deactivatePatient: (name: string) => `Deactivate ${name}`,
  },
  errors: {
    load: "Unable to load patients. Please try again.",
    details: "Unable to load patient details. Please try again.",
    status: "Unable to update the patient status. Please try again.",
  },
  feedback: {
    activated: (name: string) => `${name} is now active.`,
    deactivated: (name: string) => `${name} is now inactive.`,
  },
} as const;

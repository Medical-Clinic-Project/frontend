import { SidebarNavigation } from "@/components/navigation/AdminNavigation";
import {
  PATIENT_NAVIGATION_ITEMS,
  PATIENT_NAVIGATION_TEXT,
} from "@/constants/navigation";

export function PatientNavigation() {
  return (
    <SidebarNavigation
      items={PATIENT_NAVIGATION_ITEMS}
      text={PATIENT_NAVIGATION_TEXT}
    />
  );
}

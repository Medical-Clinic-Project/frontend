import { SidebarNavigation } from "@/components/navigation/AdminNavigation";
import {
  DOCTOR_NAVIGATION_ITEMS,
  DOCTOR_NAVIGATION_TEXT,
} from "@/constants/navigation";

export function DoctorNavigation() {
  return (
    <SidebarNavigation
      items={DOCTOR_NAVIGATION_ITEMS}
      text={DOCTOR_NAVIGATION_TEXT}
    />
  );
}

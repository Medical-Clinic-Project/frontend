import type { Metadata } from "next";
import { Register } from "@/views/auth/register/Register";

export const metadata: Metadata = {
  title: "Patient registration",
};

export default function RegisterPage() {
  return <Register />;
}

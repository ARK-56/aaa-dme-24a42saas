"use client";

import { useSearchParams } from "next/navigation";
import AccountDashboard from "@/components/account/AccountDashboard";

/**
 * Reads ?view=declined so the profile menu's "Declined Requests" link opens the
 * dashboard with that tab already selected.
 */
export default function AccountDashboardSection() {
  const params = useSearchParams();
  const initialFilter = params.get("view") === "declined" ? "declined" : "all";

  return <AccountDashboard initialFilter={initialFilter} />;
}

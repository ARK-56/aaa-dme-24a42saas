import type { Metadata } from "next";
import AdminBodyClass from "@/components/admin/AdminBodyClass";
import "@/styles/admin-panel.css";

export const metadata: Metadata = {
  title: "Admin Panel",
  description:
    "AAA DME Admin Panel — internal reporting and order tracking dashboard.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminBodyClass />
      {children}
    </>
  );
}

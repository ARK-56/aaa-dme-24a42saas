"use client";

import { useEffect } from "react";

/**
 * The theme served the admin dashboard with <body class="admin-body">. The root
 * layout owns <body>, so the class is applied for the lifetime of this route.
 */
export default function AdminBodyClass() {
  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => document.body.classList.remove("admin-body");
  }, []);

  return null;
}

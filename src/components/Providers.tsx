"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthProvider";
import { RequestModalProvider } from "@/context/RequestModalProvider";
import { StoreProvider } from "@/context/StoreProvider";
import { UiProvider } from "@/context/UiProvider";

/**
 * Nesting order matters: the store raises toasts through the UI layer, auth
 * reads users out of the store, and the request modal needs both.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      <StoreProvider>
        <AuthProvider>
          <RequestModalProvider>{children}</RequestModalProvider>
        </AuthProvider>
      </StoreProvider>
    </UiProvider>
  );
}

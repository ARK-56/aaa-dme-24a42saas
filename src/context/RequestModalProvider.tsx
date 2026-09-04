"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import RequestModal from "@/components/modals/RequestModal";
import { useAuth } from "@/context/AuthProvider";
import { useUi } from "@/context/UiProvider";

interface RequestModalContextValue {
  /** Opens the medical intake form for a product, prompting sign-in first. */
  openRequestModal: (productId: string) => void;
  closeRequestModal: () => void;
  activeProductId: string | null;
}

const RequestModalContext = createContext<RequestModalContextValue | null>(null);

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const { session, openModal } = useAuth();
  const { notify } = useUi();
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const openRequestModal = useCallback(
    (productId: string) => {
      if (!session.isLoggedIn) {
        notify(
          "Please sign in or register to submit a medical coverage request."
        );
        openModal("login");
        return;
      }
      setActiveProductId(productId);
    },
    [session.isLoggedIn, notify, openModal]
  );

  const closeRequestModal = useCallback(() => setActiveProductId(null), []);

  const value = useMemo(
    () => ({ openRequestModal, closeRequestModal, activeProductId }),
    [openRequestModal, closeRequestModal, activeProductId]
  );

  return (
    <RequestModalContext.Provider value={value}>
      {children}
      <RequestModal />
    </RequestModalContext.Provider>
  );
}

export function useRequestModal(): RequestModalContextValue {
  const ctx = useContext(RequestModalContext);
  if (!ctx) {
    throw new Error(
      "useRequestModal must be used inside <RequestModalProvider>"
    );
  }
  return ctx;
}

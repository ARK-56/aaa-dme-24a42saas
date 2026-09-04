"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface UiContextValue {
  /** Shows the green toast the theme used for every success/inline error. */
  notify: (message: string) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

const NOTIFICATION_MS = 3000;

export function UiProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const notify = useCallback(
    (text: string) => {
      clearTimers();
      setMessage(text);
      setVisible(true);
      timers.current.push(
        setTimeout(() => setVisible(false), NOTIFICATION_MS),
        // Keep the text mounted through the fade-out transition.
        setTimeout(() => setMessage(null), NOTIFICATION_MS + 400)
      );
    },
    [clearTimers]
  );

  useEffect(() => clearTimers, [clearTimers]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <UiContext.Provider value={value}>
      {children}
      {message !== null && (
        <div
          className={`success-notification-banner${visible ? " visible" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="banner-body-content">
            <span className="banner-tick">✓</span>
            <span className="banner-message">{message}</span>
          </div>
        </div>
      )}
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside <UiProvider>");
  return ctx;
}

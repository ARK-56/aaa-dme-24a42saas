"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "@/context/StoreProvider";
import { useUi } from "@/context/UiProvider";
import { readLocal, STORAGE_KEYS, writeLocal } from "@/lib/storage";
import type { Session, User } from "@/lib/types";

/** Email that unlocks the admin panel, carried over from the theme. */
export const ADMIN_EMAIL = "admin@example.com";

const CODE_TTL_MS = 10 * 60 * 1000;

const SIGNED_OUT: Session = {
  isLoggedIn: false,
  userEmail: null,
  userName: null,
  userId: null,
};

interface PendingSignup {
  name: string;
  email: string;
  password: string;
  code: string;
  expiresAt: number;
}

export type AuthStep = "login" | "register" | "verify";

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextValue {
  session: Session;
  isAdmin: boolean;
  /** False during the first render, before localStorage has been read. */
  hydrated: boolean;

  modalOpen: boolean;
  step: AuthStep;
  pendingEmail: string | null;
  openModal: (step?: AuthStep) => void;
  closeModal: () => void;
  setStep: (step: AuthStep) => void;

  login: (email: string, password: string) => AuthResult;
  startEmailVerification: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  confirmVerification: (code: string) => AuthResult;
  cancelVerification: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useUi();
  const { users, addUser } = useStore();

  const [session, setSession] = useState<Session>(SIGNED_OUT);
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<AuthStep>("login");
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(null);

  useEffect(() => {
    // The theme migrated sessions from sessionStorage to localStorage so a user
    // stays signed in across browser restarts; that migration is preserved.
    let stored = readLocal<Session | null>(STORAGE_KEYS.session, null);
    if (!stored && typeof window !== "undefined") {
      const legacy = window.sessionStorage.getItem(STORAGE_KEYS.session);
      if (legacy) {
        try {
          stored = JSON.parse(legacy) as Session;
          writeLocal(STORAGE_KEYS.session, stored);
          window.sessionStorage.removeItem(STORAGE_KEYS.session);
        } catch {
          stored = null;
        }
      }
    }
    if (stored) setSession(stored);
    setHydrated(true);
  }, []);

  // Locking the page behind an open modal matches the theme's overlay behaviour.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const persistSession = useCallback((next: Session) => {
    setSession(next);
    writeLocal(STORAGE_KEYS.session, next);
  }, []);

  const openModal = useCallback((nextStep: AuthStep = "login") => {
    setStep(nextStep);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    // Never reopen straight onto the verification step.
    setStep((current) => (current === "verify" ? "login" : current));
  }, []);

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        persistSession({
          isLoggedIn: true,
          userEmail: email,
          userName: user.name || email.split("@")[0],
          userId: user.userId || "guest",
        });
        setModalOpen(false);
        notify("Successfully logged in!");
        return { success: true };
      }

      // Built-in evaluation account from the theme.
      if (email === ADMIN_EMAIL && password === "admin123") {
        persistSession({
          isLoggedIn: true,
          userEmail: ADMIN_EMAIL,
          userName: "Admin",
          userId: "admin",
        });
        setModalOpen(false);
        notify("Successfully logged in!");
        return { success: true };
      }

      return { success: false, message: "Invalid email or password." };
    },
    [users, persistSession, notify]
  );

  const startEmailVerification = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setPendingSignup({
        name,
        email,
        password,
        code,
        expiresAt: Date.now() + CODE_TTL_MS,
      });
      setStep("verify");

      // The signup is never blocked on delivery; if the mail fails, the code is
      // surfaced in the console so local/QA runs can still complete.
      console.log(`[DEV] AAA DME signup verification code for ${email}: ${code}`);
      notify(`Verification code sent to ${email}.`);

      try {
        const res = await fetch("/api/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, code }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error || "Server error");
        }
        return { success: true };
      } catch (err) {
        const reason = err instanceof Error ? err.message : "unknown error";
        console.warn("Verification email dispatch failed:", err);
        return {
          success: false,
          message: `Email delivery failed: ${reason}. (Testing code [${code}] has been logged to the browser console).`,
        };
      }
    },
    [notify]
  );

  const confirmVerification = useCallback(
    (code: string): AuthResult => {
      if (!pendingSignup) {
        return {
          success: false,
          message: "Your registration session expired. Please register again.",
        };
      }
      if (Date.now() > pendingSignup.expiresAt) {
        return {
          success: false,
          message: "This code has expired. Please request a new one.",
        };
      }
      if (code.trim() !== pendingSignup.code) {
        return {
          success: false,
          message: "Incorrect verification code. Please try again.",
        };
      }

      const { name, email, password } = pendingSignup;
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: "User email already registered." };
      }

      const userId = `aaa-user_${String(users.length + 1).padStart(2, "0")}`;
      const newUser: User = {
        userId,
        name,
        email,
        password,
        doj: new Date().toISOString(),
      };
      addUser(newUser);

      setPendingSignup(null);
      persistSession({
        isLoggedIn: true,
        userEmail: email,
        userName: name,
        userId,
      });
      setModalOpen(false);
      notify("Email verified — account successfully created!");
      return { success: true };
    },
    [pendingSignup, users, addUser, persistSession, notify]
  );

  const cancelVerification = useCallback(() => {
    setPendingSignup(null);
    setStep("register");
  }, []);

  const logout = useCallback(() => {
    // The cart is intentionally preserved across logout so items are not lost.
    persistSession(SIGNED_OUT);
    notify("You have been logged out.");
  }, [persistSession, notify]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAdmin: session.userEmail?.toLowerCase() === ADMIN_EMAIL,
      hydrated,
      modalOpen,
      step,
      pendingEmail: pendingSignup?.email ?? null,
      openModal,
      closeModal,
      setStep,
      login,
      startEmailVerification,
      confirmVerification,
      cancelVerification,
      logout,
    }),
    [
      session,
      hydrated,
      modalOpen,
      step,
      pendingSignup,
      openModal,
      closeModal,
      login,
      startEmailVerification,
      confirmVerification,
      cancelVerification,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

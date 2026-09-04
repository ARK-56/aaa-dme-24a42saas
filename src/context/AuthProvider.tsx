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
import { useUi } from "@/context/UiProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@/lib/types";

const SIGNED_OUT: Session = {
  isLoggedIn: false,
  userEmail: null,
  userName: null,
  userId: null,
};

export type AuthStep = "login" | "register" | "verify";

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextValue {
  session: Session;
  isAdmin: boolean;
  /** False during the first render, before the session has been restored. */
  hydrated: boolean;

  modalOpen: boolean;
  step: AuthStep;
  pendingEmail: string | null;
  openModal: (step?: AuthStep) => void;
  closeModal: () => void;
  setStep: (step: AuthStep) => void;

  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  resendConfirmation: () => Promise<AuthResult>;
  cancelVerification: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useUi();
  const supabase = getSupabaseBrowserClient();

  const [session, setSession] = useState<Session>(SIGNED_OUT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<AuthStep>("login");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Supabase holds the session; the admin flag comes from the profiles table so
  // it cannot be forged in the browser the way the old localStorage check could.
  useEffect(() => {
    if (!supabase) {
      setHydrated(true);
      return;
    }

    let active = true;

    const applyUser = async (
      user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null
    ) => {
      if (!active) return;

      if (!user) {
        setSession(SIGNED_OUT);
        setIsAdmin(false);
        setHydrated(true);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      const metaName =
        typeof user.user_metadata?.full_name === "string"
          ? (user.user_metadata.full_name as string)
          : null;

      setSession({
        isLoggedIn: true,
        userEmail: user.email ?? null,
        userName: profile?.full_name || metaName || user.email?.split("@")[0] || null,
        userId: user.id,
      });
      setIsAdmin(Boolean(profile?.is_admin));
      setHydrated(true);
    };

    supabase.auth.getUser().then(({ data }) => applyUser(data.user));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      void applyUser(s?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const openModal = useCallback((nextStep: AuthStep = "login") => {
    setStep(nextStep);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setStep((current) => (current === "verify" ? "login" : current));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
        return { success: false, message: "Sign-in is not configured." };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Supabase returns a specific message when the address is unconfirmed;
        // surfacing it verbatim tells the user to go and click the email link.
        if (error.message.toLowerCase().includes("confirm")) {
          setPendingEmail(email.trim());
          setStep("verify");
          return {
            success: false,
            message: "Please confirm your email address first — check your inbox.",
          };
        }
        return { success: false, message: "Invalid email or password." };
      }

      setModalOpen(false);
      notify("Successfully logged in!");
      return { success: true };
    },
    [supabase, notify]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
        return { success: false, message: "Registration is not configured." };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo:
            typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      setPendingEmail(email.trim());

      // With email confirmation on, signUp returns a user but no session.
      if (data.session) {
        setModalOpen(false);
        notify("Account created — you are signed in.");
        return { success: true };
      }

      setStep("verify");
      notify(`Confirmation email sent to ${email.trim()}.`);
      return { success: true };
    },
    [supabase, notify]
  );

  const resendConfirmation = useCallback(async (): Promise<AuthResult> => {
    if (!supabase || !pendingEmail) {
      return { success: false, message: "Nothing to resend." };
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
    });
    if (error) return { success: false, message: error.message };
    notify(`Confirmation email resent to ${pendingEmail}.`);
    return { success: true };
  }, [supabase, pendingEmail, notify]);

  const cancelVerification = useCallback(() => {
    setPendingEmail(null);
    setStep("register");
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    notify("You have been logged out.");
  }, [supabase, notify]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAdmin,
      hydrated,
      modalOpen,
      step,
      pendingEmail,
      openModal,
      closeModal,
      setStep,
      login,
      register,
      resendConfirmation,
      cancelVerification,
      logout,
    }),
    [
      session,
      isAdmin,
      hydrated,
      modalOpen,
      step,
      pendingEmail,
      openModal,
      closeModal,
      login,
      register,
      resendConfirmation,
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

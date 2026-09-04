"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthProvider";

const SubmitArrow = () => (
  <div className="submit-arrow-badge">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  </div>
);

/**
 * Login / Register / Confirm modal, rendered once at the app root.
 *
 * The theme generated its own six-digit code and mailed it through Resend.
 * Supabase Auth sends a confirmation link instead, so the third step is now an
 * instruction to check the inbox rather than a code entry form.
 */
export default function AuthModal() {
  const {
    modalOpen,
    step,
    setStep,
    closeModal,
    login,
    register,
    resendConfirmation,
    cancelVerification,
    pendingEmail,
  } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [sending, setSending] = useState(false);

  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (modalOpen) return;
    setLoginError("");
    setRegisterError("");
    setVerifyError("");
  }, [modalOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    if (modalOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError("");
    const result = await login(loginEmail.trim(), loginPassword);
    if (result.success) {
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setLoginError(result.message ?? "Invalid email or password.");
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setRegisterError("");

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    setSending(true);
    // Supabase rejects an address that is already registered, so there is no
    // need to check a client-side user list first — and no such list exists now.
    const result = await register(name.trim(), email.trim(), password);
    setSending(false);

    if (!result.success) {
      setRegisterError(result.message ?? "Could not create your account.");
      return;
    }
    setPassword("");
    setConfirmPassword("");
  };

  const handleResend = async () => {
    setVerifyError("");
    const result = await resendConfirmation();
    if (!result.success && result.message) setVerifyError(result.message);
  };

  return (
    <div
      className="auth-modal-overlay modal-active"
      id="global-auth-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div className="auth-modal-card" role="dialog" aria-modal="true">
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeModal}
          aria-label="Close Authentication Modal"
        >
          &times;
        </button>

        {step !== "verify" && (
          <div className="auth-tabs-row">
            <button
              type="button"
              className={`auth-tab-btn${step === "login" ? " active" : ""}`}
              onClick={() => setStep("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab-btn${step === "register" ? " active" : ""}`}
              onClick={() => setStep("register")}
            >
              Register
            </button>
          </div>
        )}

        <form
          className={`auth-form${step === "login" ? " active" : ""}`}
          id="auth-login-form"
          onSubmit={handleLogin}
          style={{ display: step === "login" ? undefined : "none" }}
        >
          <h3 className="auth-form-title">Welcome Back</h3>
          <p className="auth-form-subtitle">
            Enter your credentials to access your patient portal
          </p>

          <div className="auth-input-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              required
              placeholder="name@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <div
            className="auth-error-banner"
            style={{ display: loginError ? "block" : "none" }}
          >
            {loginError}
          </div>

          <button type="submit" className="auth-submit-btn">
            <span>Sign In</span>
            <SubmitArrow />
          </button>
        </form>

        <form
          className={`auth-form${step === "register" ? " active" : ""}`}
          id="auth-register-form"
          onSubmit={handleRegister}
          style={{ display: step === "register" ? undefined : "none" }}
        >
          <h3 className="auth-form-title">Create Patient Account</h3>
          <p className="auth-form-subtitle">
            Register to verify insurance benefits and track prescriptions
          </p>

          <div className="auth-input-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              type="text"
              id="register-name"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              type="email"
              id="register-email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="register-password">Password</label>
            <input
              type="password"
              id="register-password"
              required
              minLength={8}
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="register-confirm-password"
              required
              minLength={8}
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div
            className="auth-error-banner"
            style={{ display: registerError ? "block" : "none" }}
          >
            {registerError}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={sending}>
            <span>{sending ? "Creating account…" : "Register Account"}</span>
            <SubmitArrow />
          </button>
        </form>

        <div
          className={`auth-form${step === "verify" ? " active" : ""}`}
          id="auth-verify-form"
          style={{ display: step === "verify" ? undefined : "none" }}
        >
          <h3 className="auth-form-title">Confirm Your Email</h3>
          <p className="auth-form-subtitle">
            {pendingEmail
              ? `We sent a confirmation link to ${pendingEmail}. Open it to activate your account, then sign in.`
              : "We sent you a confirmation link. Open it to activate your account, then sign in."}
          </p>

          <div
            className="auth-error-banner"
            style={{ display: verifyError ? "block" : "none" }}
          >
            {verifyError}
          </div>

          <button
            type="button"
            className="auth-submit-btn"
            onClick={() => setStep("login")}
          >
            <span>Back to Sign In</span>
            <SubmitArrow />
          </button>

          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              textAlign: "center",
              color: "#667085",
            }}
          >
            Didn&apos;t get the email?{" "}
            <button
              type="button"
              onClick={handleResend}
              style={{
                color: "#22c55e",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              Resend Link
            </button>
            &nbsp;|&nbsp;
            <button
              type="button"
              onClick={() => {
                setVerifyError("");
                cancelVerification();
              }}
              style={{
                color: "#667085",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
              }}
            >
              Back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

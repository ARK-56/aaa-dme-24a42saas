"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";

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

/** Login / Register / Verify modal, rendered once at the app root. */
export default function AuthModal() {
  const {
    modalOpen,
    step,
    setStep,
    closeModal,
    login,
    startEmailVerification,
    confirmVerification,
    cancelVerification,
    pendingEmail,
  } = useAuth();
  const { users } = useStore();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [sending, setSending] = useState(false);

  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState("");

  // Clear transient state whenever the modal is dismissed.
  useEffect(() => {
    if (modalOpen) return;
    setLoginError("");
    setRegisterError("");
    setVerifyError("");
    setCode("");
  }, [modalOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    if (modalOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    const result = login(loginEmail.trim(), loginPassword);
    if (result.success) {
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
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
    // Fail before a code is sent if the address is already taken.
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setRegisterError("User email already registered.");
      return;
    }

    setSending(true);
    const result = await startEmailVerification(
      name.trim(),
      email.trim(),
      password
    );
    setSending(false);
    // Delivery failures are surfaced on the verify step, not treated as fatal.
    if (!result.success && result.message) setVerifyError(result.message);
  };

  const handleVerify = (event: FormEvent) => {
    event.preventDefault();
    setVerifyError("");
    const result = confirmVerification(code);
    if (result.success) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCode("");
    } else {
      setVerifyError(result.message ?? "Verification failed.");
    }
  };

  const handleResend = async () => {
    setVerifyError("");
    const result = await startEmailVerification(
      name.trim(),
      email.trim(),
      password
    );
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
              placeholder="••••••••"
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
              placeholder="••••••••"
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
            <span>{sending ? "Sending code…" : "Register Account"}</span>
            <SubmitArrow />
          </button>
        </form>

        <form
          className={`auth-form${step === "verify" ? " active" : ""}`}
          id="auth-verify-form"
          onSubmit={handleVerify}
          style={{ display: step === "verify" ? undefined : "none" }}
        >
          <h3 className="auth-form-title">Verify Your Email</h3>
          <p className="auth-form-subtitle">
            {pendingEmail
              ? `Enter the 6-digit code we sent to ${pendingEmail}`
              : "Enter the 6-digit code we sent to your email address"}
          </p>

          <div className="auth-input-group">
            <label htmlFor="verify-code-input">Verification Code</label>
            <input
              type="text"
              id="verify-code-input"
              required
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div
            className="auth-error-banner"
            style={{ display: verifyError ? "block" : "none" }}
          >
            {verifyError}
          </div>

          <button type="submit" className="auth-submit-btn">
            <span>Verify &amp; Create Account</span>
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
            Didn&apos;t get a code?{" "}
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
              Resend Code
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
        </form>
      </div>
    </div>
  );
}

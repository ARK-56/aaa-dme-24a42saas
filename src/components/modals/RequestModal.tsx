"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRequestModal } from "@/context/RequestModalProvider";
import { useStore } from "@/context/StoreProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useUi } from "@/context/UiProvider";
import { sendIntakeEmail } from "@/lib/emailService";

interface PrescriptionFile {
  name: string;
  size: number;
  file: File;
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  address: "",
  zip_code: "",
  medicare_id: "",
  physician_instruction: "",
};

/** Insurance intake form shown by every "Request Product" button. */
export default function RequestModal() {
  const { activeProductId, closeRequestModal } = useRequestModal();
  const { getProductById, addToCart, cart, refresh } = useStore();
  const supabase = getSupabaseBrowserClient();
  const { session } = useAuth();
  const { notify } = useUi();

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<PrescriptionFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = activeProductId ? getProductById(activeProductId) : null;

  // Prefill from the signed-in account each time the modal opens.
  useEffect(() => {
    if (!activeProductId) return;
    setForm({
      ...EMPTY_FORM,
      name: session.userName ?? "",
      email: session.userEmail ?? "",
    });
    setFile(null);
  }, [activeProductId, session.userName, session.userEmail]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = activeProductId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProductId]);

  if (!activeProductId) return null;

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const readFile = (selected: File) => {
    setFile({ name: selected.name, size: selected.size, file: selected });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) readFile(dropped);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!supabase || !session.userId) {
      setError("Please sign in again before submitting this request.");
      return;
    }

    setSubmitting(true);
    const requestRef = `REQ-${Date.now()}`;

    // Upload the prescription first. The old build read it in the browser and
    // kept only a boolean — the document itself was thrown away.
    let prescriptionPath: string | null = null;
    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${session.userId}/${requestRef}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("prescriptions")
        .upload(path, file.file, { upsert: false });

      if (uploadError) {
        setSubmitting(false);
        setError(`Could not upload the prescription: ${uploadError.message}`);
        return;
      }
      prescriptionPath = path;
    }

    const { error: insertError } = await supabase
      .from("coverage_requests")
      .insert({
        request_ref: requestRef,
        user_id: session.userId,
        product_id: activeProductId,
        product_name: product?.name ?? "Unknown",
        full_name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dob: form.dob || null,
        address: form.address.trim(),
        zip_code: form.zip_code.trim(),
        medicare_id: form.medicare_id.trim(),
        physician_instruction: form.physician_instruction.trim(),
        prescription_path: prescriptionPath,
      });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const alreadyInCart = cart.some((item) => item.productId === activeProductId);
    if (!alreadyInCart) addToCart(activeProductId, 1);

    void sendIntakeEmail({
      name: form.name.trim(),
      dob: form.dob,
      medicare_id: form.medicare_id.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      zip_code: form.zip_code.trim(),
      address: form.address.trim(),
      physician_instruction: form.physician_instruction.trim(),
      product_id: activeProductId,
      product_name: product?.name ?? "Unknown",
    }).catch((err) => console.error("Medical intake email failed:", err));

    void refresh();

    const cartNote = alreadyInCart ? "" : " It has been added to your cart.";
    notify(
      `Request successfully filed for ${product?.name ?? "your device"}!${cartNote}`
    );

    setForm(EMPTY_FORM);
    setFile(null);
    closeRequestModal();
  };

  return (
    <div
      className="request-modal-overlay modal-active"
      id="request-intake-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeRequestModal();
      }}
    >
      <div className="request-modal-card" role="dialog" aria-modal="true">
        <button
          type="button"
          className="request-modal-close"
          onClick={closeRequestModal}
          aria-label="Close Intake Modal"
        >
          &times;
        </button>

        <div className="intake-header">
          <h2 className="intake-title">Insurance Medical Intake Form</h2>
          <p className="intake-subtitle">
            Please file this request to verify coverage and start physician
            review.
          </p>
          <span className="intake-device-tag">
            {product
              ? `DEVICE: ${product.name} (HCPCS: ${product.hcpcsCode})`
              : "DEVICE: Loading Details..."}
          </span>
        </div>

        <form id="medical-intake-form" onSubmit={handleSubmit}>
          <div className="request-modal-grid">
            <div className="intake-field-group">
              <label htmlFor="intake-name">Full Name *</label>
              <input
                type="text"
                id="intake-name"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={update("name")}
              />
            </div>
            <div className="intake-field-group">
              <label htmlFor="intake-email">Email Address *</label>
              <input
                type="email"
                id="intake-email"
                required
                placeholder="john@example.com"
                value={form.email}
                onChange={update("email")}
              />
            </div>
            <div className="intake-field-group">
              <label htmlFor="intake-phone">Phone Number *</label>
              <input
                type="tel"
                id="intake-phone"
                required
                placeholder="(555) 000-0000"
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
            <div className="intake-field-group">
              <label htmlFor="intake-dob">Date of Birth *</label>
              <input
                type="date"
                id="intake-dob"
                required
                value={form.dob}
                onChange={update("dob")}
              />
            </div>
            <div className="intake-field-group full-width">
              <label htmlFor="intake-address">Street Address *</label>
              <input
                type="text"
                id="intake-address"
                required
                placeholder="123 Care Street, Suite 4B"
                value={form.address}
                onChange={update("address")}
              />
            </div>
            <div className="intake-field-group">
              <label htmlFor="intake-zip">Zip Code *</label>
              <input
                type="text"
                id="intake-zip"
                required
                placeholder="10001"
                value={form.zip_code}
                onChange={update("zip_code")}
              />
            </div>
            <div className="intake-field-group">
              <label htmlFor="intake-medicare">
                Medicare ID (Required for claims)
              </label>
              <input
                type="text"
                id="intake-medicare"
                placeholder="e.g. 1EG4-TE5-MK72"
                value={form.medicare_id}
                onChange={update("medicare_id")}
              />
            </div>
            <div className="intake-field-group full-width">
              <label htmlFor="intake-notes">
                Intake Notes / Physician Instructions
              </label>
              <textarea
                id="intake-notes"
                rows={3}
                placeholder="Provide any specifications, clinical guidance, or diagnostic codes if known."
                value={form.physician_instruction}
                onChange={update("physician_instruction")}
              />
            </div>
            <div className="intake-field-group full-width">
              <label>Prescription Document Upload *</label>
              <div
                className={`prescription-drag-drop${dragOver ? " drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="intake-prescription-file"
                  className="hidden-file-input"
                  accept="image/*,.pdf"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (selected) readFile(selected);
                  }}
                />
                <div className="prescription-inner-preview">
                  {file ? (
                    <div className="file-loaded-view">
                      <span className="file-icon-loaded">📄</span>
                      <div className="file-loaded-info">
                        <p className="file-name-txt">{file.name}</p>
                        <span className="file-size-txt">
                          {(file.size / 1024).toFixed(1)} KB - Ready to upload
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="upload-icon">✦</span>
                      <p>
                        Drag &amp; Drop Prescription PDF/Image or{" "}
                        <strong>Browse</strong>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="auth-error-banner"
            style={{ display: error ? "block" : "none", marginBottom: 12 }}
          >
            {error}
          </div>

          <button
            type="submit"
            className="intake-submit-btn"
            disabled={submitting}
          >
            <span>{submitting ? "Submitting…" : "Submit Inquiry"}</span>
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
          </button>
        </form>
      </div>
    </div>
  );
}

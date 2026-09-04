"use client";

import { useState, type FormEvent } from "react";
import { useUi } from "@/context/UiProvider";
import { sendContactEmail } from "@/lib/emailService";

const EMPTY = { name: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const { notify } = useUi();
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSending(true);
    try {
      await sendContactEmail(form);
      notify("Your message has been sent! We'll be in touch within 24 hours.");
      setForm(EMPTY);
    } catch (err) {
      console.error("Contact form send failed:", err);
      notify("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      id="premium-contact-form"
      className="premium-contact-form"
      onSubmit={handleSubmit}
    >
      <div className="floating-input-group">
        <input
          type="text"
          id="contact-full-name"
          name="name"
          className="contact-input-field"
          placeholder=" "
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label htmlFor="contact-full-name" className="contact-field-label">
          Full Name <span className="required-asterisk">*</span>
        </label>
      </div>

      <div className="floating-input-group">
        <input
          type="email"
          id="contact-email"
          name="email"
          className="contact-input-field"
          placeholder=" "
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label htmlFor="contact-email" className="contact-field-label">
          E-mail Address <span className="required-asterisk">*</span>
        </label>
      </div>

      <div className="floating-input-group">
        <input
          type="tel"
          id="contact-phone"
          name="phone"
          className="contact-input-field"
          placeholder=" "
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <label htmlFor="contact-phone" className="contact-field-label">
          Phone Number <span className="required-asterisk">*</span>
        </label>
      </div>

      <div className="floating-input-group">
        <textarea
          id="contact-message"
          name="message"
          className="contact-input-field contact-textarea"
          placeholder=" "
          rows={1}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <label htmlFor="contact-message" className="contact-field-label">
          Message
        </label>
      </div>

      <button type="submit" className="btn-contact-submit" disabled={sending}>
        <span>{sending ? "Sending..." : "Submit Details"}</span>
        <div className="submit-arrow-circle-badge">
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
  );
}

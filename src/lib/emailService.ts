import emailjs from "@emailjs/browser";

/**
 * EmailJS delivery for the contact form, the footer CTA form, and the medical
 * intake modal. These are browser-side credentials by design — EmailJS public
 * keys are meant to be exposed — but they now come from env so they can be
 * swapped per environment.
 *
 * Template 1 (contact/CTA): name, email, phone, message
 * Template 2 (product request): name, dob, medicare_id, email, phone, zip_code,
 *   address, physician_instruction, product_id, product_name
 */
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const CONTACT_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID ?? "";
const REQUEST_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_REQUEST_TEMPLATE_ID ?? "";

export interface ContactParams extends Record<string, string> {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface IntakeParams extends Record<string, string> {
  name: string;
  dob: string;
  medicare_id: string;
  email: string;
  phone: string;
  zip_code: string;
  address: string;
  physician_instruction: string;
  product_id: string;
  product_name: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(PUBLIC_KEY && SERVICE_ID);
}

function send(templateId: string, params: Record<string, string>) {
  if (!isEmailConfigured() || !templateId) {
    return Promise.reject(
      new Error(
        "EmailJS is not configured — set NEXT_PUBLIC_EMAILJS_* in .env.local"
      )
    );
  }
  return emailjs.send(SERVICE_ID, templateId, params, {
    publicKey: PUBLIC_KEY,
  });
}

/** Used by both the contact page form and the footer CTA form. */
export function sendContactEmail(params: ContactParams) {
  return send(CONTACT_TEMPLATE_ID, params);
}

/** Used by the medical intake / product request modal. */
export function sendIntakeEmail(params: IntakeParams) {
  return send(REQUEST_TEMPLATE_ID, params);
}

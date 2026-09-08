"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import { assetSrc } from "@/lib/routes";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/avif", "image/webp", "image/png", "image/jpeg", "image/gif"];

const SHIPPING_CLASSES = ["standard", "freight", "white-glove"];

interface Props {
  /** null = closed; a product = edit; EMPTY_PRODUCT = create. */
  product: Product | null;
  onClose: () => void;
  /** Called after a successful write so the catalogue can refetch. */
  onSaved: () => void;
}

/** A blank product, used as the "create" sentinel. */
export const EMPTY_PRODUCT: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  image: "",
  images: [],
  category: PRODUCT_CATEGORIES[0],
  hcpcsCode: "",
  fdaClass: "",
  isPrescriptionRequired: false,
  shippingClass: "standard",
  warrantyType: "",
  inStock: true,
  inventory: 0,
  rating: 0,
  reviewCount: 0,
  colors: [],
  sizes: [],
  overview: [],
  features: [],
  bestFor: "",
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#98a1a9",
  marginBottom: 6,
  display: "block",
};

const input: React.CSSProperties = {
  border: "1px solid #e2e2e2",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  color: "#03231c",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const field: React.CSSProperties = { minWidth: 0 };

/** Multi-line textareas hold one item per line; blank lines are dropped. */
const toLines = (value: string) =>
  value.split("\n").map((line) => line.trim()).filter(Boolean);

const fromLines = (items: string[] | undefined) => (items ?? []).join("\n");

const toCsv = (items: string[] | undefined) => (items ?? []).join(", ");
const fromCsv = (value: string) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

export default function ProductFormModal({ product, onClose, onSaved }: Props) {
  const supabase = getSupabaseBrowserClient();
  const isCreate = product !== null && product.id === "";

  const [form, setForm] = useState<Product>(EMPTY_PRODUCT);
  const [galleryText, setGalleryText] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!product) return;
    setForm(product);
    setGalleryText(fromLines(product.images));
    setError("");
  }, [product]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = product ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    if (product) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [product, onClose, busy]);

  const set = useCallback(
    <K extends keyof Product>(key: K, value: Product[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  /** Uploads to the product-images bucket and returns the public URL. */
  const handleUpload = async (file: File, target: "main" | "gallery") => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      setError(`${file.type || "That file type"} is not an image we accept.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB; the limit is 5 MB.`
      );
      return;
    }

    setUploading(true);
    setError("");

    // Prefixed with a timestamp so re-uploading a file of the same name never
    // silently replaces another product's image.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const objectName = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectName, file, { contentType: file.type, cacheControl: "31536000" });

    setUploading(false);

    if (uploadError) {
      setError(
        `Upload failed: ${uploadError.message}. If this says row-level security, ` +
          `the account is not flagged as an administrator.`
      );
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectName);
    if (target === "main") {
      set("image", data.publicUrl);
    } else {
      setGalleryText((prev) => (prev ? `${prev}\n${data.publicUrl}` : data.publicUrl));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    const name = form.name.trim();
    if (!name) return setError("Name is required.");
    if (!form.category) return setError("Category is required.");
    if (!Number.isFinite(form.price) || form.price < 0) {
      return setError("Price must be zero or more.");
    }

    setBusy(true);
    setError("");

    // Column names, not the camelCase Product shape.
    const row = {
      name,
      description: form.description.trim(),
      price: form.price,
      original_price: form.originalPrice ?? null,
      image: form.image.trim() || null,
      images: toLines(galleryText),
      category: form.category,
      hcpcs_code: form.hcpcsCode.trim() || null,
      fda_class: form.fdaClass.trim() || null,
      is_prescription_required: form.isPrescriptionRequired,
      shipping_class: String(form.shippingClass || "standard"),
      warranty_type: form.warrantyType.trim() || null,
      in_stock: form.inStock,
      inventory: Math.max(0, Math.trunc(form.inventory ?? 0)),
      colors: form.colors ?? [],
      sizes: form.sizes ?? [],
      is_sale: Boolean(form.isSale),
      overview: form.overview ?? [],
      features: form.features ?? [],
      best_for: (form.bestFor ?? "").trim(),
    };

    const { error: writeError } = isCreate
      ? await supabase.from("products").insert(row)
      : await supabase.from("products").update(row).eq("id", form.id);

    setBusy(false);

    if (writeError) {
      setError(
        `Could not save: ${writeError.message}. If this mentions row-level ` +
          `security, the account is not flagged as an administrator.`
      );
      return;
    }

    onSaved();
    onClose();
  };

  if (!product) return null;

  return (
    <div
      className="admin-modal-overlay modal-active"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div className="admin-modal-card product-form-card">
        <div className="admin-modal-header">
          <div className="admin-modal-title-block">
            <h3 className="admin-modal-title">
              {isCreate ? "Add Product" : "Edit Product"}
            </h3>
            {!isCreate && <span className="admin-modal-id">{form.id}</span>}
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close product form"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="admin-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="product-form-grid">
              <div style={{ ...field, gridColumn: "1 / -1" }}>
                <label style={label} htmlFor="pf-name">Name *</label>
                <input id="pf-name" style={input} value={form.name} required
                       onChange={(e) => set("name", e.target.value)} />
              </div>

              <div style={{ ...field, gridColumn: "1 / -1" }}>
                <label style={label} htmlFor="pf-desc">Short description</label>
                <textarea id="pf-desc" style={{ ...input, minHeight: 64, resize: "vertical" }}
                          value={form.description}
                          onChange={(e) => set("description", e.target.value)} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-cat">Category *</label>
                <select id="pf-cat" style={input} value={form.category} required
                        onChange={(e) => set("category", e.target.value)}>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-price">Price (USD) *</label>
                <input id="pf-price" style={input} type="number" min="0" step="0.01"
                       value={form.price} required
                       onChange={(e) => set("price", Number(e.target.value))} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-orig">Original price</label>
                <input id="pf-orig" style={input} type="number" min="0" step="0.01"
                       value={form.originalPrice ?? ""}
                       onChange={(e) => set("originalPrice",
                         e.target.value === "" ? undefined : Number(e.target.value))} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-inv">Inventory</label>
                <input id="pf-inv" style={input} type="number" min="0" step="1"
                       value={form.inventory ?? 0}
                       onChange={(e) => set("inventory", Number(e.target.value))} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-hcpcs">HCPCS code</label>
                <input id="pf-hcpcs" style={input} value={form.hcpcsCode}
                       onChange={(e) => set("hcpcsCode", e.target.value)} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-fda">FDA class</label>
                <input id="pf-fda" style={input} value={form.fdaClass}
                       onChange={(e) => set("fdaClass", e.target.value)} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-ship">Shipping class</label>
                <select id="pf-ship" style={input} value={String(form.shippingClass)}
                        onChange={(e) => set("shippingClass", e.target.value)}>
                  {SHIPPING_CLASSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-warranty">Warranty</label>
                <input id="pf-warranty" style={input} value={form.warrantyType}
                       onChange={(e) => set("warrantyType", e.target.value)} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-colors">Colours (comma separated)</label>
                <input id="pf-colors" style={input} value={toCsv(form.colors)}
                       onChange={(e) => set("colors", fromCsv(e.target.value))} />
              </div>

              <div style={field}>
                <label style={label} htmlFor="pf-sizes">Sizes (comma separated)</label>
                <input id="pf-sizes" style={input} value={toCsv(form.sizes)}
                       onChange={(e) => set("sizes", fromCsv(e.target.value))} />
              </div>
            </div>

            <div className="product-form-checks">
              <label className="product-form-check">
                <input type="checkbox" checked={form.isPrescriptionRequired}
                       onChange={(e) => set("isPrescriptionRequired", e.target.checked)} />
                Prescription required
              </label>
              <label className="product-form-check">
                <input type="checkbox" checked={form.inStock}
                       onChange={(e) => set("inStock", e.target.checked)} />
                In stock
              </label>
              <label className="product-form-check">
                <input type="checkbox" checked={Boolean(form.isSale)}
                       onChange={(e) => set("isSale", e.target.checked)} />
                On sale
              </label>
            </div>

            <div className="modal-section-divider" />
            <p className="modal-section-label">Images</p>

            <div className="product-form-image-row">
              <div className="product-form-preview">
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetSrc(form.image)} alt="" />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label style={label} htmlFor="pf-image">Main image URL</label>
                <input id="pf-image" style={input} value={form.image}
                       placeholder="Upload below, or paste a URL"
                       onChange={(e) => set("image", e.target.value)} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button type="button" className="product-form-upload"
                          disabled={uploading}
                          onClick={() => fileRef.current?.click()}>
                    {uploading ? "Uploading…" : "Upload image"}
                  </button>
                  {form.image && (
                    <button type="button" className="product-form-ghost"
                            onClick={() => set("image", "")}>
                      Clear
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept={ACCEPTED.join(",")}
                       style={{ display: "none" }}
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) void handleUpload(file, "main");
                         e.target.value = "";
                       }} />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={label} htmlFor="pf-gallery">
                Gallery URLs (one per line)
              </label>
              <textarea id="pf-gallery"
                        style={{ ...input, minHeight: 70, resize: "vertical",
                                 fontFamily: "monospace", fontSize: 12 }}
                        value={galleryText}
                        onChange={(e) => setGalleryText(e.target.value)} />
            </div>

            <div className="modal-section-divider" />
            <p className="modal-section-label">Detail page copy</p>

            <div style={{ marginTop: 10 }}>
              <label style={label} htmlFor="pf-overview">
                Overview paragraphs (one per line)
              </label>
              <textarea id="pf-overview"
                        style={{ ...input, minHeight: 90, resize: "vertical" }}
                        value={fromLines(form.overview)}
                        onChange={(e) => set("overview", toLines(e.target.value))} />
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={label} htmlFor="pf-features">
                Key features (one per line)
              </label>
              <textarea id="pf-features"
                        style={{ ...input, minHeight: 90, resize: "vertical" }}
                        value={fromLines(form.features)}
                        onChange={(e) => set("features", toLines(e.target.value))} />
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={label} htmlFor="pf-bestfor">Best for</label>
              <input id="pf-bestfor" style={input} value={form.bestFor ?? ""}
                     onChange={(e) => set("bestFor", e.target.value)} />
            </div>

            {error && <div className="product-form-error">{error}</div>}

            <div className="product-form-actions">
              <button type="button" className="product-form-ghost"
                      onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className="product-form-save"
                      disabled={busy || uploading}>
                {busy ? "Saving…" : isCreate ? "Create product" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

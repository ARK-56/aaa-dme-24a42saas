/**
 * Row shapes for the tables in supabase/migrations/0001_initial_schema.sql.
 *
 * Hand-written rather than generated so the repo does not depend on the
 * Supabase CLI. If you later run `supabase gen types typescript`, replace this
 * file with the output and the rest of the app keeps compiling.
 */

export type RequestStatus = "pending" | "granted" | "declined";
export type VoucherStatus = "granted" | "used" | "expired";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image: string | null;
  images: string[];
  category: string;
  hcpcs_code: string | null;
  fda_class: string | null;
  is_prescription_required: boolean;
  shipping_class: string;
  warranty_type: string | null;
  in_stock: boolean;
  inventory: number;
  rating: number;
  review_count: number;
  colors: string[];
  sizes: string[];
  is_sale: boolean;
  is_featured: boolean;
  featured_rank: number | null;
  overview: string[];
  features: string[];
  best_for: string;
  created_at: string;
  updated_at: string;
}

export type CoverageRequestRow = {
  id: string;
  request_ref: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  address: string | null;
  zip_code: string | null;
  medicare_id: string | null;
  physician_instruction: string | null;
  prescription_path: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export type VoucherRow = {
  id: string;
  code: string;
  product_id: string;
  user_id: string;
  request_id: string | null;
  status: VoucherStatus;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export type OrderRow = {
  id: string;
  order_ref: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  items: OrderItem[];
  total_products: number;
  total_price: number;
  confirmation_code: string | null;
  personal_details: PersonalDetails;
  shipping_details: ShippingDetails;
  created_at: string;
}

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

export type PersonalDetails = {
  fullName?: string;
  email?: string;
  phone?: string;
}

export type ShippingDetails = {
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

/**
 * Shape supabase-js expects so  infers row types. Each table needs a
 * Relationships key — without it the table fails to match GenericTable and
 * every Row silently resolves to never.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & { name: string; price: number; category: string };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      coverage_requests: {
        Row: CoverageRequestRow;
        Insert: Omit<CoverageRequestRow, "id" | "created_at" | "updated_at" | "status"> & Partial<Pick<CoverageRequestRow, "id" | "status">>;
        Update: Partial<CoverageRequestRow>;
        Relationships: [];
      };
      vouchers: {
        Row: VoucherRow;
        Insert: Omit<VoucherRow, "id" | "created_at" | "used_at" | "status"> & Partial<Pick<VoucherRow, "id" | "status" | "used_at">>;
        Update: Partial<VoucherRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow>;
        Update: Partial<OrderRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      place_order: {
        Args: {
          p_code: string;
          p_product_id: string;
          p_quantity: number;
          p_personal_details: PersonalDetails;
          p_shipping_details: ShippingDetails;
        };
        Returns: OrderRow;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      request_status: RequestStatus;
      voucher_status: VoucherStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

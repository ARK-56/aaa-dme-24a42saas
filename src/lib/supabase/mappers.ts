import type {
  CoverageRequestRow,
  OrderRow,
  ProductRow,
  VoucherRow,
} from "@/lib/supabase/types";
import type {
  CoverageRequest,
  Order,
  Product,
  Voucher,
} from "@/lib/types";

/**
 * Translates snake_case Postgres rows into the camelCase shapes the components
 * already use, so the UI did not have to change when the backend did.
 */

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price === null ? undefined : Number(row.original_price),
    image: row.image ?? "",
    images: row.images,
    category: row.category,
    hcpcsCode: row.hcpcs_code ?? "",
    fdaClass: row.fda_class ?? "",
    isPrescriptionRequired: row.is_prescription_required,
    shippingClass: row.shipping_class,
    warrantyType: row.warranty_type ?? "",
    inStock: row.in_stock,
    inventory: row.inventory,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    colors: row.colors,
    sizes: row.sizes,
    isSale: row.is_sale,
    isFeatured: row.is_featured,
    featuredRank: row.featured_rank ?? undefined,
    overview: row.overview,
    features: row.features,
    bestFor: row.best_for,
  };
}

export function toOrder(row: OrderRow): Order {
  const timestamp = row.created_at;
  return {
    orderId: row.order_ref,
    orderDate: timestamp,
    timestamp,
    confirmationCode: row.confirmation_code ?? "",
    productId: row.product_id ?? "",
    productName: row.product_name,
    items: (row.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      image: item.image ?? "",
      quantity: item.quantity,
      hcpcsCode: "",
      isPrescriptionRequired: false,
    })),
    totalProducts: row.total_products,
    totalPrice: Number(row.total_price),
    personalDetails: {
      fullName: row.personal_details?.fullName ?? "",
      email: row.personal_details?.email ?? "",
      phone: row.personal_details?.phone ?? "",
    },
    shippingDetails: {
      streetAddress: row.shipping_details?.streetAddress ?? "",
      city: row.shipping_details?.city ?? "",
      state: row.shipping_details?.state ?? "",
      zipCode: row.shipping_details?.zipCode ?? "",
    },
    paymentDetails: {
      method: "insurance",
      billingSameAsShipping: true,
      billingAddress: "",
    },
    userEmail: row.personal_details?.email ?? "",
    userId: row.user_id,
    userName: row.personal_details?.fullName ?? "",
  };
}

export function toCoverageRequest(row: CoverageRequestRow): CoverageRequest {
  return {
    requestId: row.request_ref,
    timestamp: row.created_at,
    productId: row.product_id ?? "",
    productName: row.product_name,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    medicare_id: row.medicare_id ?? "",
    dob: row.dob ?? "",
    address: row.address ?? "",
    zip_code: row.zip_code ?? "",
    physician_instruction: row.physician_instruction ?? "",
    hasPrescriptionFile: Boolean(row.prescription_path),
    status: row.status,
    userId: row.user_id,
  };
}

export function toVoucher(row: VoucherRow): Voucher {
  return {
    code: row.code,
    productId: row.product_id,
    userId: row.user_id,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
    isUsed: row.status === "used" || row.used_at !== null,
    requestId: row.request_id ?? undefined,
  };
}

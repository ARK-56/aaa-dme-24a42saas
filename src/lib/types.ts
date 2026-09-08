export type ShippingClass = "standard" | "white-glove" | "ltl-freight";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  hcpcsCode: string;
  fdaClass: string;
  isPrescriptionRequired: boolean;
  shippingClass: ShippingClass | string;
  warrantyType: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  colors?: string[];
  sizes?: string[];
  description: string;
  isSale?: boolean;
  inventory?: number;
  isFeatured?: boolean;
  featuredRank?: number;
  /** Detail-page copy. Lived in src/data/productContent.ts before 0003. */
  overview?: string[];
  features?: string[];
  bestFor?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  hcpcsCode: string;
  isPrescriptionRequired: boolean;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  /**
   * Carried over from the original theme, which stored credentials in plain text.
   * See README — this needs to be replaced with a hashed credential store before
   * the app handles real patient accounts.
   */
  password: string;
  doj: string;
}

export interface Session {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  userId: string | null;
}

export type VoucherStatus = "active" | "used" | "expired" | "declined";

export interface Voucher {
  code: string;
  productId: string;
  userId: string;
  status: VoucherStatus | "granted" | string;
  createdAt?: number;
  expiresAt?: number;
  isUsed?: boolean;
  requestId?: string;
  email?: string;
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingDetails {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentDetails {
  method: string;
  billingSameAsShipping: boolean;
  billingAddress: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  timestamp: string;
  confirmationCode: string;
  productId: string;
  productName: string;
  items: CartItem[];
  totalProducts: number;
  totalPrice: string | number;
  personalDetails: PersonalDetails;
  shippingDetails: ShippingDetails;
  paymentDetails: PaymentDetails;
  userEmail: string;
  userId: string;
  userName: string;
}

export type RequestStatus = "pending" | "granted" | "approved" | "declined";

export interface CoverageRequest {
  requestId: string;
  timestamp: string;
  productId: string;
  productName: string;
  fullName: string;
  email: string;
  phone: string;
  medicare_id: string;
  dob: string;
  address: string;
  zip_code: string;
  physician_instruction: string;
  hasPrescriptionFile: boolean;
  status?: RequestStatus | string;
  /** Present on records filed while signed in; used to match the account. */
  userId?: string;
}

/** Order handed from the cart to the checkout page via localStorage. */
export interface PendingCheckout {
  confirmationCode: string;
  productId: string;
  productName: string;
  items: CartItem[];
  totalProducts: number;
  totalPrice: string;
}

/** A completed order, kept so the thank-you state survives a reload. */
export interface PlacedOrderReceipt {
  orderId: string;
  productId: string;
  email: string;
  userId: string;
}

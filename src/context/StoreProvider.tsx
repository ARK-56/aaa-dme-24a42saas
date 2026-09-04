"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useUi } from "@/context/UiProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  toCoverageRequest,
  toOrder,
  toProduct,
  toVoucher,
} from "@/lib/supabase/mappers";
import { PRODUCT_CATEGORIES, SEED_PRODUCTS, SEED_FEATURED_PRODUCTS } from "@/lib/seed";
import { readLocal, STORAGE_KEYS, writeLocal } from "@/lib/storage";
import type {
  CartItem,
  CoverageRequest,
  Order,
  Product,
  Voucher,
} from "@/lib/types";

const MAX_QUANTITY = 99;

interface StoreContextValue {
  products: Product[];
  featuredProducts: Product[];
  /** Rows the signed-in user is allowed to see; admins see everything. */
  orders: Order[];
  requests: CoverageRequest[];
  vouchers: Voucher[];
  cart: CartItem[];
  categories: readonly string[];
  /** False until the first catalogue load settles. */
  synced: boolean;

  getProductById: (id: string) => Product | null;
  refresh: () => Promise<void>;

  addToCart: (productId: string, quantity?: number) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { notify } = useUi();
  const supabase = getSupabaseBrowserClient();

  // Seeded so the server render and first client render agree, and so the
  // storefront still works if Supabase is unreachable.
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    SEED_FEATURED_PRODUCTS
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [synced, setSynced] = useState(false);

  const productsRef = useRef(products);
  productsRef.current = products;

  const loadCatalogue = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("featured_rank", { ascending: true, nullsFirst: false });

    if (error || !data) {
      console.warn("Catalogue load failed, using seed:", error?.message);
      return;
    }

    const mapped = data.map(toProduct);
    setProducts(mapped);
    setFeaturedProducts(
      data
        .filter((row) => row.is_featured)
        .sort((a, b) => (a.featured_rank ?? 0) - (b.featured_rank ?? 0))
        .map(toProduct)
    );
  }, [supabase]);

  /**
   * Personal rows. RLS scopes these to the signed-in user automatically, so
   * there is no user id filter here — an anonymous visitor simply gets none.
   */
  const loadPersonal = useCallback(async () => {
    if (!supabase) return;

    const [ordersRes, requestsRes, vouchersRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase
        .from("coverage_requests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("vouchers").select("*"),
    ]);

    setOrders((ordersRes.data ?? []).map(toOrder));
    setRequests((requestsRes.data ?? []).map(toCoverageRequest));
    setVouchers((vouchersRes.data ?? []).map(toVoucher));
  }, [supabase]);

  const refresh = useCallback(async () => {
    await Promise.all([loadCatalogue(), loadPersonal()]);
  }, [loadCatalogue, loadPersonal]);

  useEffect(() => {
    setCart(readLocal<CartItem[]>(STORAGE_KEYS.cart, []));

    if (!supabase) {
      setSynced(true);
      return;
    }

    let active = true;
    loadCatalogue().finally(() => {
      if (active) setSynced(true);
    });
    void loadPersonal();

    // Personal rows depend on who is signed in, so reload when that changes.
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void loadPersonal();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, loadCatalogue, loadPersonal]);

  const getProductById = useCallback(
    (id: string) => productsRef.current.find((p) => p.id === id) ?? null,
    []
  );

  // The cart stays in the browser: it holds no PHI and needs no account.
  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const product = productsRef.current.find((p) => p.id === productId);
      if (!product) return;
      if (!product.inStock) {
        notify("This item is currently out of stock.");
        return;
      }

      setCart((current) => {
        const existing = current.find((item) => item.productId === productId);
        const next = existing
          ? current.map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, MAX_QUANTITY),
                  }
                : item
            )
          : [
              ...current,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity,
                hcpcsCode: product.hcpcsCode,
                isPrescriptionRequired: product.isPrescriptionRequired,
              },
            ];
        writeLocal(STORAGE_KEYS.cart, next);
        return next;
      });

      notify(`${product.name} added to cart!`);
    },
    [notify]
  );

  const setCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((current) => {
      const next = current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), MAX_QUANTITY) }
          : item
      );
      writeLocal(STORAGE_KEYS.cart, next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => {
      const next = current.filter((item) => item.productId !== productId);
      writeLocal(STORAGE_KEYS.cart, next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    writeLocal(STORAGE_KEYS.cart, []);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      featuredProducts,
      orders,
      requests,
      vouchers,
      cart,
      categories: PRODUCT_CATEGORIES,
      synced,
      getProductById,
      refresh,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      products,
      featuredProducts,
      orders,
      requests,
      vouchers,
      cart,
      synced,
      getProductById,
      refresh,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

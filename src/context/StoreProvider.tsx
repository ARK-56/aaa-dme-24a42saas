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
import { fetchDoc, saveDoc } from "@/lib/dbClient";
import type { DbFile } from "@/lib/dbFiles";
import {
  PRODUCT_CATEGORIES,
  SEED_FEATURED_PRODUCTS,
  SEED_PRODUCTS,
} from "@/lib/seed";
import { readLocal, STORAGE_KEYS, writeLocal } from "@/lib/storage";
import type {
  CartItem,
  CoverageRequest,
  Order,
  Product,
  User,
  Voucher,
} from "@/lib/types";

const MAX_QUANTITY = 99;

interface StoreContextValue {
  products: Product[];
  featuredProducts: Product[];
  users: User[];
  vouchers: Voucher[];
  orders: Order[];
  requests: CoverageRequest[];
  cart: CartItem[];
  categories: readonly string[];
  /** False until the first server sync settles, so views can show a loading state. */
  synced: boolean;

  getProductById: (id: string) => Product | null;

  saveProducts: (products: Product[]) => void;
  saveFeaturedProducts: (products: Product[]) => void;
  deductInventory: (productId: string, quantity: number) => void;

  addToCart: (productId: string, quantity?: number) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  saveUsers: (users: User[]) => void;
  addUser: (user: User) => void;

  saveVouchers: (vouchers: Voucher[]) => void;
  addVoucher: (voucher: Voucher) => void;
  updateVoucherStatus: (code: string, status: string) => void;

  saveOrders: (orders: Order[]) => void;
  addPlacedOrder: (order: Order) => void;

  saveRequests: (requests: CoverageRequest[]) => void;
  addRequestedOrder: (request: CoverageRequest) => void;
  removeRequestedOrder: (requestId: string) => void;
  updateRequestedOrderStatus: (requestId: string, status: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { notify } = useUi();

  // Seeded so the server render and the first client render agree; the effect
  // below replaces these with the cached and then the server-side values.
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    SEED_FEATURED_PRODUCTS
  );
  const [users, setUsers] = useState<User[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [synced, setSynced] = useState(false);

  // addToCart reads the catalog but must not be re-created on every catalog
  // change, or every consumer would re-render whenever inventory shifts.
  const productsRef = useRef(products);
  productsRef.current = products;

  useEffect(() => {
    let cancelled = false;

    // 1. Warm state from the local cache so the page is usable offline.
    setProducts(readLocal(STORAGE_KEYS.products, SEED_PRODUCTS));
    setFeaturedProducts(
      readLocal(STORAGE_KEYS.featuredProducts, SEED_FEATURED_PRODUCTS)
    );
    setUsers(readLocal<User[]>(STORAGE_KEYS.users, []));
    setVouchers(readLocal<Voucher[]>(STORAGE_KEYS.vouchers, []));
    setOrders(readLocal<Order[]>(STORAGE_KEYS.orders, []));
    setRequests(readLocal<CoverageRequest[]>(STORAGE_KEYS.requests, []));
    setCart(readLocal<CartItem[]>(STORAGE_KEYS.cart, []));

    // 2. Then pull authoritative copies from the server store.
    const sync = async <T,>(
      file: DbFile,
      key: string,
      apply: (value: T) => void
    ) => {
      const data = await fetchDoc<T>(file);
      if (cancelled || data === null) return;
      writeLocal(key, data);
      apply(data);
    };

    Promise.all([
      sync<Product[]>("products.json", STORAGE_KEYS.products, setProducts),
      sync<Product[]>(
        "featured-products.json",
        STORAGE_KEYS.featuredProducts,
        setFeaturedProducts
      ),
      sync<User[]>("users.json", STORAGE_KEYS.users, setUsers),
      sync<Voucher[]>(
        "verification-codes.json",
        STORAGE_KEYS.vouchers,
        setVouchers
      ),
      sync<Order[]>("orders.json", STORAGE_KEYS.orders, setOrders),
      sync<CoverageRequest[]>(
        "requests.json",
        STORAGE_KEYS.requests,
        setRequests
      ),
    ]).finally(() => {
      if (!cancelled) setSynced(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /** Updates state, the local cache, and the server copy in one step. */
  const persist = useCallback(
    <T,>(file: DbFile, key: string, setter: (value: T) => void, value: T): void => {
      setter(value);
      writeLocal(key, value);
      void saveDoc(file, value);
    },
    []
  );

  /** Cart lives only in the browser — the theme never synced it server-side. */
  const persistCart = useCallback((next: CartItem[]) => {
    setCart(next);
    writeLocal(STORAGE_KEYS.cart, next);
  }, []);

  const getProductById = useCallback(
    (id: string) => productsRef.current.find((p) => p.id === id) ?? null,
    []
  );

  const saveProducts = useCallback(
    (next: Product[]) =>
      persist("products.json", STORAGE_KEYS.products, setProducts, next),
    [persist]
  );

  const saveFeaturedProducts = useCallback(
    (next: Product[]) =>
      persist(
        "featured-products.json",
        STORAGE_KEYS.featuredProducts,
        setFeaturedProducts,
        next
      ),
    [persist]
  );

  const deductInventory = useCallback(
    (productId: string, quantity: number) => {
      const next = productsRef.current.map((p) => {
        if (p.id !== productId) return p;
        const inventory = Math.max(0, (p.inventory ?? 0) - quantity);
        return { ...p, inventory, inStock: inventory === 0 ? false : p.inStock };
      });
      saveProducts(next);
    },
    [saveProducts]
  );

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

  const clearCart = useCallback(() => persistCart([]), [persistCart]);

  const saveUsers = useCallback(
    (next: User[]) => persist("users.json", STORAGE_KEYS.users, setUsers, next),
    [persist]
  );

  const usersRef = useRef(users);
  usersRef.current = users;

  const addUser = useCallback(
    (user: User) => saveUsers([...usersRef.current, user]),
    [saveUsers]
  );

  const saveVouchers = useCallback(
    (next: Voucher[]) =>
      persist("verification-codes.json", STORAGE_KEYS.vouchers, setVouchers, next),
    [persist]
  );

  const vouchersRef = useRef(vouchers);
  vouchersRef.current = vouchers;

  const addVoucher = useCallback(
    (voucher: Voucher) => saveVouchers([...vouchersRef.current, voucher]),
    [saveVouchers]
  );

  const updateVoucherStatus = useCallback(
    (code: string, status: string) => {
      if (!code) return;
      const upper = code.toUpperCase();
      const next = vouchersRef.current.map((v) =>
        v.code?.toUpperCase() === upper ? { ...v, status } : v
      );
      saveVouchers(next);
    },
    [saveVouchers]
  );

  const saveOrders = useCallback(
    (next: Order[]) => persist("orders.json", STORAGE_KEYS.orders, setOrders, next),
    [persist]
  );

  const ordersRef = useRef(orders);
  ordersRef.current = orders;

  const addPlacedOrder = useCallback(
    (order: Order) => saveOrders([...ordersRef.current, order]),
    [saveOrders]
  );

  const saveRequests = useCallback(
    (next: CoverageRequest[]) =>
      persist("requests.json", STORAGE_KEYS.requests, setRequests, next),
    [persist]
  );

  const requestsRef = useRef(requests);
  requestsRef.current = requests;

  const addRequestedOrder = useCallback(
    (request: CoverageRequest) =>
      saveRequests([
        ...requestsRef.current,
        { ...request, status: request.status ?? "pending" },
      ]),
    [saveRequests]
  );

  const removeRequestedOrder = useCallback(
    (requestId: string) =>
      saveRequests(requestsRef.current.filter((r) => r.requestId !== requestId)),
    [saveRequests]
  );

  const updateRequestedOrderStatus = useCallback(
    (requestId: string, status: string) =>
      saveRequests(
        requestsRef.current.map((r) =>
          r.requestId === requestId ? { ...r, status } : r
        )
      ),
    [saveRequests]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      featuredProducts,
      users,
      vouchers,
      orders,
      requests,
      cart,
      categories: PRODUCT_CATEGORIES,
      synced,
      getProductById,
      saveProducts,
      saveFeaturedProducts,
      deductInventory,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      saveUsers,
      addUser,
      saveVouchers,
      addVoucher,
      updateVoucherStatus,
      saveOrders,
      addPlacedOrder,
      saveRequests,
      addRequestedOrder,
      removeRequestedOrder,
      updateRequestedOrderStatus,
    }),
    [
      products,
      featuredProducts,
      users,
      vouchers,
      orders,
      requests,
      cart,
      synced,
      getProductById,
      saveProducts,
      saveFeaturedProducts,
      deductInventory,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      saveUsers,
      addUser,
      saveVouchers,
      addVoucher,
      updateVoucherStatus,
      saveOrders,
      addPlacedOrder,
      saveRequests,
      addRequestedOrder,
      removeRequestedOrder,
      updateRequestedOrderStatus,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

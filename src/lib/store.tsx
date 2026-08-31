import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  artisans as seedArtisans,
  messages as seedMessages,
  orders as seedOrders,
  products as seedProducts,
} from "./data";
import type { Artisan, Message, Order, OrderStatus, Product, SessionUser } from "./types";
import { ORDER_FLOW } from "./types";

interface PersistedState {
  artisans: Artisan[];
  products: Product[];
  orders: Order[];
  messages: Message[];
  interestedBuyers: number;
  user: SessionUser | null;
}

interface StoreValue extends PersistedState {
  hydrated: boolean;
  activeArtisan: Artisan;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  registerView: (id: string) => void;
  registerInterest: (n?: number) => void;
  advanceOrder: (id: string) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  placeOrder: (productId: string, buyerName: string, city: string, qty: number) => Order | null;
  sendMessage: (productId: string, text: string) => void;
  updateArtisan: (patch: Partial<Artisan>) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const STORAGE_KEY = "karigarai.state.v2";

const seed = (): PersistedState => ({
  artisans: seedArtisans,
  products: seedProducts,
  orders: seedOrders,
  messages: seedMessages,
  interestedBuyers: 127,
  user: null,
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(seed);
  const [hydrated, setHydrated] = useState(false);
  const viewed = useRef<Set<string>>(new Set());

  // Hydrate once on the client so SSR markup stays stable.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* corrupted storage — keep the seed */
    }
    setHydrated(true);
  }, []);

  // Persist every change after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exceeded — the demo keeps working in memory */
    }
  }, [state, hydrated]);

  const patch = useCallback(
    (fn: (prev: PersistedState) => Partial<PersistedState>) =>
      setState((prev) => ({ ...prev, ...fn(prev) })),
    [],
  );

  const signIn = useCallback((user: SessionUser) => patch(() => ({ user })), [patch]);
  const signOut = useCallback(() => patch(() => ({ user: null })), [patch]);

  const addProduct = useCallback(
    (p: Product) => patch((prev) => ({ products: [p, ...prev.products] })),
    [patch],
  );

  const updateProduct = useCallback(
    (id: string, next: Partial<Product>) =>
      patch((prev) => ({
        products: prev.products.map((p) => (p.id === id ? { ...p, ...next } : p)),
      })),
    [patch],
  );

  const removeProduct = useCallback(
    (id: string) =>
      patch((prev) => ({
        products: prev.products.filter((p) => p.id !== id),
        orders: prev.orders.filter((o) => o.productId !== id),
      })),
    [patch],
  );

  const toggleProductStatus = useCallback(
    (id: string) =>
      patch((prev) => ({
        products: prev.products.map((p) =>
          p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p,
        ),
      })),
    [patch],
  );

  /** Counts one view per product per browser session. */
  const registerView = useCallback(
    (id: string) => {
      if (viewed.current.has(id)) return;
      viewed.current.add(id);
      patch((prev) => ({
        products: prev.products.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
      }));
    },
    [patch],
  );

  const registerInterest = useCallback(
    (n = 1) => patch((prev) => ({ interestedBuyers: prev.interestedBuyers + n })),
    [patch],
  );

  const setOrderStatus = useCallback(
    (id: string, status: OrderStatus) =>
      patch((prev) => ({
        orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      })),
    [patch],
  );

  const advanceOrder = useCallback(
    (id: string) =>
      patch((prev) => ({
        orders: prev.orders.map((o) => {
          if (o.id !== id) return o;
          const idx = ORDER_FLOW.indexOf(o.status);
          return { ...o, status: ORDER_FLOW[Math.min(idx + 1, ORDER_FLOW.length - 1)]! };
        }),
      })),
    [patch],
  );

  const placeOrder = useCallback(
    (productId: string, buyerName: string, city: string, qty: number) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return null;
      const order: Order = {
        id: `ORD-${Math.floor(2500 + Math.random() * 9000)}`,
        productId,
        buyerName,
        city,
        qty,
        amount: product.price * qty,
        status: "Pending",
        placedAt: new Date().toISOString().slice(0, 10),
      };
      patch((prev) => ({
        orders: [order, ...prev.orders],
        products: prev.products.map((p) =>
          p.id === productId ? { ...p, sold: p.sold + qty } : p,
        ),
        interestedBuyers: prev.interestedBuyers + 1,
      }));
      return order;
    },
    [patch, state.products],
  );

  const sendMessage = useCallback(
    (productId: string, text: string) => {
      const mine: Message = { id: `m${Date.now()}`, productId, from: "buyer", text };
      patch((prev) => ({
        messages: [...prev.messages, mine],
        interestedBuyers: prev.interestedBuyers + 1,
      }));

      const reply = artisanReply(text);
      window.setTimeout(() => {
        patch((prev) => ({
          messages: [
            ...prev.messages,
            {
              id: `m${Date.now()}`,
              productId,
              from: "artisan",
              text: reply.hi,
              translated: reply.en,
            },
          ],
        }));
      }, 1400);
    },
    [patch],
  );

  const updateArtisan = useCallback(
    (next: Partial<Artisan>) =>
      patch((prev) => {
        const id = prev.user?.artisanId ?? "a1";
        return {
          artisans: prev.artisans.map((a) => (a.id === id ? { ...a, ...next } : a)),
        };
      }),
    [patch],
  );

  const resetDemoData = useCallback(() => {
    viewed.current.clear();
    setState((prev) => ({ ...seed(), user: prev.user }));
  }, []);

  const activeArtisan = useMemo(
    () => state.artisans.find((a) => a.id === (state.user?.artisanId ?? "a1")) ?? state.artisans[0]!,
    [state.artisans, state.user],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      hydrated,
      activeArtisan,
      signIn,
      signOut,
      addProduct,
      updateProduct,
      removeProduct,
      toggleProductStatus,
      registerView,
      registerInterest,
      advanceOrder,
      setOrderStatus,
      placeOrder,
      sendMessage,
      updateArtisan,
      resetDemoData,
    }),
    [
      state,
      hydrated,
      activeArtisan,
      signIn,
      signOut,
      addProduct,
      updateProduct,
      removeProduct,
      toggleProductStatus,
      registerView,
      registerInterest,
      advanceOrder,
      setOrderStatus,
      placeOrder,
      sendMessage,
      updateArtisan,
      resetDemoData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** Canned but context-aware artisan replies for the buyer chat. */
function artisanReply(text: string): { hi: string; en: string } {
  const t = text.toLowerCase();
  if (/price|discount|cost|kitna|₹/.test(t))
    return {
      hi: "यह दाम नौ दिन की मेहनत और असली सामग्री का है। दो या ज़्यादा लेने पर मैं 10% छूट दे सकती हूँ।",
      en: "The price reflects nine days of work and genuine materials. For two pieces or more I can offer a 10% discount.",
    };
  if (/ship|deliver|when|time|kab/.test(t))
    return {
      hi: "मैं इसे 2 दिन में पैक कर दूँगी, और भारत में 3–5 दिन में पहुँच जाएगा।",
      en: "I will pack it within 2 days, and delivery across India takes 3–5 days.",
    };
  if (/custom|size|colour|color|design|banw/.test(t))
    return {
      hi: "जी हाँ, मैं आपके रंग और नाप के अनुसार बना सकती हूँ — इसमें लगभग 7 दिन लगेंगे।",
      en: "Yes, I can make it in your colour and size — that would take about 7 days.",
    };
  if (/care|wash|clean|safe|water/.test(t))
    return {
      hi: "इसे नरम कपड़े से पोंछें, तेज़ साबुन न लगाएँ। पानी से कोई नुकसान नहीं होगा।",
      en: "Wipe it with a soft cloth and avoid harsh detergent. Water will not damage it.",
    };
  return {
    hi: "धन्यवाद! मैं यह टुकड़ा खुद अपने हाथों से बनाती हूँ — और कुछ पूछना हो तो ज़रूर बताइए।",
    en: "Thank you! I make this piece entirely with my own hands — please ask me anything else you'd like to know.",
  };
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  artisans as seedArtisans,
  messages as seedMessages,
  orders as seedOrders,
  products as seedProducts,
} from "./data";
import type { Artisan, Message, Order, OrderStatus, Product, Role } from "./types";
import { ORDER_FLOW } from "./types";

interface SessionUser {
  role: Role;
  name: string;
  email: string;
  artisanId?: string;
}

interface StoreValue {
  artisans: Artisan[];
  products: Product[];
  orders: Order[];
  messages: Message[];
  user: SessionUser | null;
  activeArtisan: Artisan;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  advanceOrder: (id: string) => void;
  placeOrder: (productId: string, buyerName: string, city: string, qty: number) => Order;
  sendMessage: (productId: string, text: string) => void;
  updateArtisan: (patch: Partial<Artisan>) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const STORAGE_KEY = "karigarai.session.v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [artisans, setArtisans] = useState<Artisan[]>(seedArtisans);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = useCallback((next: SessionUser) => {
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const addProduct = useCallback((p: Product) => setProducts((prev) => [p, ...prev]), []);

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [],
  );

  const removeProduct = useCallback(
    (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id)),
    [],
  );

  const advanceOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = ORDER_FLOW.indexOf(o.status);
        const next = ORDER_FLOW[Math.min(idx + 1, ORDER_FLOW.length - 1)] as OrderStatus;
        return { ...o, status: next };
      }),
    );
  }, []);

  const placeOrder = useCallback(
    (productId: string, buyerName: string, city: string, qty: number) => {
      const product = seedProducts.concat().find((p) => p.id === productId);
      let created: Order | null = null;
      setProducts((prev) => {
        const found = prev.find((p) => p.id === productId) ?? product;
        const price = found?.price ?? 0;
        created = {
          id: `ORD-${2419 + Math.floor(Math.random() * 400)}`,
          productId,
          buyerName,
          city,
          qty,
          amount: price * qty,
          status: "Pending",
          placedAt: new Date().toISOString().slice(0, 10),
        };
        return prev.map((p) => (p.id === productId ? { ...p, sold: p.sold + qty } : p));
      });
      const order: Order = created ?? {
        id: `ORD-${2419 + Math.floor(Math.random() * 400)}`,
        productId,
        buyerName,
        city,
        qty,
        amount: 0,
        status: "Pending",
        placedAt: new Date().toISOString().slice(0, 10),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [],
  );

  const sendMessage = useCallback((productId: string, text: string) => {
    const mine: Message = { id: `m${Date.now()}`, productId, from: "buyer", text };
    setMessages((prev) => [...prev, mine]);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now() + 1}`,
          productId,
          from: "artisan",
          text: "धन्यवाद! मैं इसे आपके लिए विशेष रूप से तैयार कर सकती हूँ — 7 दिन लगेंगे।",
          translated:
            "Thank you! I can make this specially for you — it will take about 7 days to craft and ship.",
        },
      ]);
    }, 1400);
  }, []);

  const updateArtisan = useCallback((patch: Partial<Artisan>) => {
    setArtisans((prev) => prev.map((a) => (a.id === "a1" ? { ...a, ...patch } : a)));
  }, []);

  const activeArtisan = useMemo(
    () => artisans.find((a) => a.id === (user?.artisanId ?? "a1")) ?? artisans[0]!,
    [artisans, user],
  );

  const value = useMemo<StoreValue>(
    () => ({
      artisans,
      products,
      orders,
      messages,
      user,
      activeArtisan,
      signIn,
      signOut,
      addProduct,
      updateProduct,
      removeProduct,
      advanceOrder,
      placeOrder,
      sendMessage,
      updateArtisan,
    }),
    [
      artisans,
      products,
      orders,
      messages,
      user,
      activeArtisan,
      signIn,
      signOut,
      addProduct,
      updateProduct,
      removeProduct,
      advanceOrder,
      placeOrder,
      sendMessage,
      updateArtisan,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const inr = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

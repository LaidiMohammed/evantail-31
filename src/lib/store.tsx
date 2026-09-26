"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "fr" | "ar";
export type CartItem = { slug: string; ml: number; qty: number; price: number; name: string };
export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "returned" | "cancelled";
export type Order = {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  delivery: "home" | "stopdesk";
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  date: string;
};

type StoreCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (fr: string, ar: string) => string;
  cart: CartItem[];
  addToCart: (i: CartItem) => void;
  removeFromCart: (slug: string, ml: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order;
  updateStatus: (id: string, s: OrderStatus) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const l = localStorage.getItem("ev-lang") as Lang | null;
      if (l) setLang(l);
      setCart(JSON.parse(localStorage.getItem("ev-cart") || "[]"));
      setWishlist(JSON.parse(localStorage.getItem("ev-wish") || "[]"));
      setOrders(JSON.parse(localStorage.getItem("ev-orders") || "[]"));
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("ev-lang", lang);
  }, [lang]);

  useEffect(() => { localStorage.setItem("ev-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("ev-wish", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("ev-orders", JSON.stringify(orders)); }, [orders]);

  const t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);

  const addToCart = (i: CartItem) =>
    setCart((c) => {
      const k = c.find((x) => x.slug === i.slug && x.ml === i.ml);
      if (k) return c.map((x) => (x.slug === i.slug && x.ml === i.ml ? { ...x, qty: x.qty + i.qty } : x));
      return [...c, i];
    });
  const removeFromCart = (slug: string, ml: number) =>
    setCart((c) => c.filter((x) => !(x.slug === slug && x.ml === ml)));
  const clearCart = () => setCart([]);
  const toggleWish = (slug: string) =>
    setWishlist((w) => (w.includes(slug) ? w.filter((x) => x !== slug) : [...w, slug]));

  const placeOrder = (o: Omit<Order, "id" | "date" | "status">) => {
    const order: Order = {
      ...o,
      id: "EV-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      status: "new",
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };
  const updateStatus = (id: string, s: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: s } : o)));

  const v = useMemo(
    () => ({ lang, setLang, t, cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen, wishlist, toggleWish, orders, placeOrder, updateStatus }),
    [lang, cart, cartOpen, wishlist, orders]
  );
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
};

"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, Product } from "@/data/catalog";

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

export type Promo = { code: string; pct: number; active: boolean };

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
  deleteOrder: (id: string) => void;
  clearOrders: () => void;
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (slug: string, p: Product) => void;
  deleteProduct: (slug: string) => void;
  resetProducts: () => void;
  promos: Promo[];
  addPromo: (p: Promo) => void;
  togglePromo: (code: string) => void;
  deletePromo: (code: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [promos, setPromos] = useState<Promo[]>([{ code: "EVANT20", pct: 20, active: true }]);

  useEffect(() => {
    setLang((load("ev-lang", "fr") as Lang) === "ar" ? "ar" : "fr");
    setCart(load<CartItem[]>("ev-cart", []));
    setWishlist(load<string[]>("ev-wish", []));
    setOrders(load<Order[]>("ev-orders", []));
    setProducts(load<Product[]>("ev-products", PRODUCTS));
    setPromos(load<Promo[]>("ev-promos", [{ code: "EVANT20", pct: 20, active: true }]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("ev-lang", lang); } catch {}
  }, [lang]);

  useEffect(() => { try { localStorage.setItem("ev-cart", JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { try { localStorage.setItem("ev-wish", JSON.stringify(wishlist)); } catch {} }, [wishlist]);
  useEffect(() => { try { localStorage.setItem("ev-orders", JSON.stringify(orders)); } catch {} }, [orders]);
  useEffect(() => { try { localStorage.setItem("ev-products", JSON.stringify(products)); } catch {} }, [products]);
  useEffect(() => { try { localStorage.setItem("ev-promos", JSON.stringify(promos)); } catch {} }, [promos]);

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
  const deleteOrder = (id: string) => setOrders((prev) => prev.filter((o) => o.id !== id));
  const clearOrders = () => setOrders([]);

  const addProduct = (p: Product) => setProducts((prev) => [p, ...prev]);
  const updateProduct = (slug: string, p: Product) =>
    setProducts((prev) => prev.map((x) => (x.slug === slug ? p : x)));
  const deleteProduct = (slug: string) => setProducts((prev) => prev.filter((x) => x.slug !== slug));
  const resetProducts = () => setProducts(PRODUCTS);

  const addPromo = (p: Promo) => setPromos((prev) => [p, ...prev.filter((x) => x.code !== p.code)]);
  const togglePromo = (code: string) =>
    setPromos((prev) => prev.map((x) => (x.code === code ? { ...x, active: !x.active } : x)));
  const deletePromo = (code: string) => setPromos((prev) => prev.filter((x) => x.code !== code));

  const v = useMemo(
    () => ({
      lang, setLang, t, cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen,
      wishlist, toggleWish, orders, placeOrder, updateStatus, deleteOrder, clearOrders,
      products, addProduct, updateProduct, deleteProduct, resetProducts,
      promos, addPromo, togglePromo, deletePromo,
    }),
    [lang, cart, cartOpen, wishlist, orders, products, promos]
  );
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
};

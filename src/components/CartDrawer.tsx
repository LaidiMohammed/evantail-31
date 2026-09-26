"use client";
import Link from "next/link";
import { ArrowRight, Banknote, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, t, lang, products } = useStore();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={() => setCartOpen(false)} />
      <aside className="absolute end-0 top-0 h-full w-full max-w-md bg-[#111] border-s border-[#2a2a2a] flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-[#2a2a2a]">
          <h2 className="font-bold text-lg inline-flex items-center gap-2">
            <ShoppingBag size={19} className="text-[#e8cf8f]" /> {t("Panier", "السلة")} ({cart.length})
          </h2>
          <button onClick={() => setCartOpen(false)} aria-label="close" className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 && <p className="text-neutral-400 text-center py-10">{t("Panier vide. Découvrez nos décantes 100% originales.", "السلة فارغة. اكتشف تقسيماتنا الأصلية.")}</p>}
          {cart.map((i) => {
            const p = products.find((x) => x.slug === i.slug);
            return (
              <div key={i.slug + i.ml} className="card p-3 flex gap-3">
                <img src={p?.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-bold text-sm">{i.name}</div>
                  <div className="text-xs text-neutral-400">{i.ml}ml • x{i.qty}</div>
                  <div className="text-[#e8cf8f] font-bold">{(i.price * i.qty).toLocaleString()} DA</div>
                </div>
                <button onClick={() => removeFromCart(i.slug, i.ml)} aria-label="remove" className="text-neutral-500 px-2 self-start">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-[#2a2a2a] space-y-3">
          <div className="flex justify-between font-bold"><span>{t("Sous-total", "المجموع")}</span><span className="text-[#e8cf8f]">{subtotal.toLocaleString()} DA</span></div>
          <p className="text-xs text-neutral-500 inline-flex items-start gap-1.5">
            <Truck size={14} className="mt-0.5 shrink-0" />
            {t("Livraison calculée au checkout (58 wilayas). Paiement à la livraison.", "التوصيل يُحسب عند الطلب (58 ولاية). الدفع عند الاستلام.")}
          </p>
          <p className="text-xs text-neutral-500 inline-flex items-center gap-1.5"><Banknote size={14} /> COD — {t("espèces à la réception", "الدفع نقداً عند الاستلام")}</p>
          <Link href="/checkout" onClick={() => setCartOpen(false)} className="gold-btn flex items-center justify-center gap-2 text-center py-3.5 rounded-full min-h-[52px]">
            {t("Commander", "اطلب الآن")}
            <ArrowRight size={17} strokeWidth={2.5} className={lang === "ar" ? "rotate-180" : ""} />
          </Link>
        </div>
      </aside>
    </div>
  );
}

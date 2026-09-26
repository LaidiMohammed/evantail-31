"use client";
import Link from "next/link";
import { Heart, Music2, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { STORE } from "@/data/catalog";

export default function Header() {
  const { lang, setLang, t, cart, setCartOpen, wishlist } = useStore();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <>
      <div className="bg-[#c9a24b] text-black text-center text-[13px] sm:text-sm font-bold py-2 px-3 flex items-center justify-center gap-2">
        <Sparkles size={15} strokeWidth={2.5} />
        <span>{t("-20% Nuit Castor + pochette offerte — Paiement à la livraison", "خصم 20% + حقيبة هدية — الدفع عند الاستلام")}</span>
        <Sparkles size={15} strokeWidth={2.5} />
      </div>
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/evenatil.jpg" alt="Evantail" className="w-10 h-10 rounded-full object-cover border border-[#c9a24b]" />
            <div className="leading-tight">
              <div className="font-lux text-xl gold-text font-bold">Evantail</div>
              <div className="text-[11px] text-neutral-400">Oran • {t("Parfums originaux", "عطور أصلية")}</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#e8cf8f]">{t("Accueil", "الرئيسية")}</Link>
            <Link href="/shop" className="hover:text-[#e8cf8f]">{t("Boutique", "المتجر")}</Link>
            <Link href="/track" className="hover:text-[#e8cf8f]">{t("Suivi", "تتبع")}</Link>
            <Link href="/admin" className="hover:text-[#e8cf8f] inline-flex items-center gap-1.5"><ShieldCheck size={15} /> Admin</Link>
            <a href={STORE.tiktok} target="_blank" className="hover:text-[#e8cf8f] inline-flex items-center gap-1.5"><Music2 size={15} /> TikTok</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#1a1a1a] rounded-full p-1 text-xs font-bold">
              <button onClick={() => setLang("fr")} className={`px-3 py-1 rounded-full ${lang === "fr" ? "bg-[#c9a24b] text-black" : "text-neutral-300"}`}>FR</button>
              <button onClick={() => setLang("ar")} className={`px-3 py-1 rounded-full ${lang === "ar" ? "bg-[#c9a24b] text-black" : "text-neutral-300"}`}>AR</button>
            </div>
            <Link href="/shop" aria-label="wishlist" className="hidden sm:flex relative w-10 h-10 items-center justify-center rounded-full bg-[#1a1a1a]">
              <Heart size={18} />
              <span className="absolute -top-1 -end-1 bg-[#c9a24b] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>
            </Link>
            <button onClick={() => setCartOpen(true)} className="gold-btn px-4 py-2 rounded-full text-sm inline-flex items-center gap-2">
              <ShoppingBag size={16} strokeWidth={2.5} />
              {t("Panier", "السلة")} • {count}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

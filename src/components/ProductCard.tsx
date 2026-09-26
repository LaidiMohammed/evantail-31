"use client";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function ProductCard({ p }: { p: Product }) {
  const { lang, t, addToCart, setCartOpen, wishlist, toggleWish } = useStore();
  const [ml, setMl] = useState(p.variants[1]?.ml ?? p.variants[0].ml);
  const v = p.variants.find((x) => x.ml === ml) ?? p.variants[0];
  const wished = wishlist.includes(p.slug);

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="relative">
        <Link href={`/product/${p.slug}`}>
          <img src={p.image} alt={p.brand} className="w-full h-52 sm:h-60 object-cover" loading="lazy" />
        </Link>
        {p.badge && (
          <span className="absolute top-2 start-2 bg-[#c9a24b] text-black text-[11px] font-bold px-2 py-1 rounded-full">
            {lang === "ar" ? p.badge.ar : p.badge.fr}
          </span>
        )}
        <button onClick={() => toggleWish(p.slug)} aria-label="wishlist"
          className={`absolute top-2 end-2 w-9 h-9 rounded-full flex items-center justify-center font-bold ${wished ? "bg-[#c9a24b] text-black" : "bg-black/60 text-white"}`}>
          {wished ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="text-[11px] uppercase tracking-wider text-[#c9a24b] font-bold">{p.brand}</div>
        <Link href={`/product/${p.slug}`} className="font-bold leading-snug hover:text-[#e8cf8f]">
          {lang === "ar" ? p.name.ar : p.name.fr}
        </Link>
        <div className="text-xs text-neutral-400">{lang === "ar" ? p.notes.ar : p.notes.fr} • {p.tenue}</div>
        <div className="flex gap-1.5 flex-wrap">
          {p.variants.map((x) => (
            <button key={x.ml} onClick={() => setMl(x.ml)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${x.ml === ml ? "bg-[#c9a24b] text-black border-[#c9a24b]" : "border-neutral-700 text-neutral-300"}`}>
              {x.ml}ml
            </button>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <div className="text-lg font-extrabold text-[#e8cf8f]">{v.price.toLocaleString()} DA</div>
            <div className="text-[11px] text-neutral-500">★ {p.rating} • {p.sold}+ {t("vendus", "مبيع")}</div>
          </div>
          <button onClick={() => { addToCart({ slug: p.slug, ml: v.ml, qty: 1, price: v.price, name: `${p.brand} ${lang === "ar" ? p.name.ar : p.name.fr}` }); setCartOpen(true); }}
            className="gold-btn px-4 py-2.5 rounded-full text-sm min-h-[44px]">
            {t("+ Panier", "+ سلة")}
          </button>
        </div>
      </div>
    </div>
  );
}

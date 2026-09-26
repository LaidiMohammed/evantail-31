"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Banknote, MessageCircle, Minus, Phone, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang, addToCart, setCartOpen, products } = useStore();
  const p = products.find((x) => x.slug === slug);
  const [ml, setMl] = useState(p?.variants[1]?.ml ?? p?.variants[0]?.ml ?? 10);
  const [qty, setQty] = useState(1);
  if (!p) return <div className="max-w-3xl mx-auto px-4 py-16 text-center">{t("Produit introuvable.", "المنتج غير موجود.")} <Link href="/shop" className="text-[#e8cf8f]">Shop</Link></div>;
  const v = p.variants.find((x) => x.ml === ml) ?? p.variants[0];
  const related = products.filter((x) => x.slug !== p.slug && x.gender === p.gender).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/shop" className="text-sm text-neutral-400 inline-flex items-center gap-1.5">
        <ArrowLeft size={15} className={lang === "ar" ? "rotate-180" : ""} /> {t("Boutique", "المتجر")}
      </Link>
      <div className="mt-4 grid md:grid-cols-2 gap-6 lg:gap-10">
        <div className="card overflow-hidden">
          <img src={p.image} alt={p.brand} className="w-full h-[320px] sm:h-[480px] object-cover" />
        </div>
        <div>
          <div className="text-[#c9a24b] font-bold text-sm uppercase tracking-wider">{p.brand}</div>
          <h1 className="font-lux text-3xl sm:text-4xl font-bold mt-1">{lang === "ar" ? p.name.ar : p.name.fr}</h1>
          <div className="mt-2 text-sm text-neutral-400 inline-flex items-center gap-1.5 flex-wrap">
            <Star size={14} className="text-[#c9a24b]" fill="currentColor" /> {p.rating} • {p.sold}+ {t("vendus", "مبيع")} • {t("Tenue", "الثبات")} {p.tenue} • 100% Original
          </div>
          <p className="mt-3 text-neutral-300">{lang === "ar" ? p.notes.ar : p.notes.fr}</p>

          <div className="mt-5">
            <div className="text-sm font-bold mb-2">{t("Contenance — تقسيم", "الحجم — تقسيم")}</div>
            <div className="grid grid-cols-3 gap-2">
              {p.variants.map((x) => (
                <button key={x.ml} onClick={() => setMl(x.ml)}
                  className={`rounded-2xl border p-3 text-center min-h-[72px] ${x.ml === ml ? "border-[#c9a24b] bg-[#c9a24b15]" : "border-neutral-700"}`}>
                  <div className="font-extrabold text-lg">{x.ml}ml</div>
                  <div className="text-[#e8cf8f] font-bold text-sm">{x.price.toLocaleString()} DA</div>
                  <div className="text-[11px] text-neutral-500">{x.stock > 0 ? t("En stock", "متوفر") : t("Rupture", "نفد")}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center border border-neutral-700 rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="decrease" className="w-11 h-11 flex items-center justify-center"><Minus size={16} /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="increase" className="w-11 h-11 flex items-center justify-center"><Plus size={16} /></button>
            </div>
            <div className="text-2xl font-extrabold text-[#e8cf8f]">{(v.price * qty).toLocaleString()} DA</div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onClick={() => { addToCart({ slug: p.slug, ml: v.ml, qty, price: v.price, name: `${p.brand} ${lang === "ar" ? p.name.ar : p.name.fr}` }); setCartOpen(true); }}
              className="gold-btn py-3.5 rounded-full min-h-[52px] inline-flex items-center justify-center gap-2">
              <ShoppingBag size={17} strokeWidth={2.5} /> {t("Ajouter au panier", "أضف إلى السلة")}
            </button>
            <a href={`https://wa.me/213699440352?text=${encodeURIComponent("Salam Evantail, je veux " + p.brand + " " + v.ml + "ml")}`} target="_blank"
              className="py-3.5 rounded-full border border-[#c9a24b] text-center font-bold min-h-[52px] inline-flex items-center justify-center gap-2">
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-neutral-300">
            <li className="flex items-start gap-2"><ShieldCheck size={16} className="text-[#c9a24b] mt-0.5 shrink-0" /> {t("Décante remplie depuis flacon scellé original", "تعبئة من قارورة أصلية مختومة")}</li>
            <li className="flex items-start gap-2"><Truck size={16} className="text-[#c9a24b] mt-0.5 shrink-0" /> {t("Paiement à la livraison — 58 wilayas", "الدفع عند الاستلام — 58 ولاية")}</li>
            <li className="flex items-start gap-2"><Phone size={16} className="text-[#c9a24b] mt-0.5 shrink-0" /> <span dir="ltr">0699 44 03 52 / 0771 09 45 15</span></li>
            <li className="flex items-start gap-2"><BadgeCheck size={16} className="text-[#c9a24b] mt-0.5 shrink-0" /> 100% Original • <Banknote size={16} className="text-[#c9a24b]" /> COD</li>
          </ul>
        </div>
      </div>

      <h2 className="font-lux text-2xl font-bold mt-12 mb-4">{t("Vous aimerez aussi", "قد يعجبك أيضاً")}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {related.map((r) => <ProductCard key={r.slug} p={r} />)}
      </div>
    </div>
  );
}

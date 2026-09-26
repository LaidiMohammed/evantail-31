"use client";
import Link from "next/link";
import { PRODUCTS, STORE } from "@/data/catalog";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const { t, lang } = useStore();
  const best = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop"
          alt="Evantail parfum" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/60 border border-[#c9a24b55] rounded-full px-4 py-1.5 text-xs sm:text-sm mb-4">
              ✦ Evantail.31 • Oran • <span className="text-[#e8cf8f] font-bold">261.8K TikTok</span>
            </div>
            <h1 className="font-lux text-4xl sm:text-6xl font-bold leading-tight">
              <span className="gold-text">{t("Le luxe se respire.", "الفخامة تُستنشق.")}</span>
              <br />{t("100% Original.", "أصلي 100%.")}
            </h1>
            <p className="mt-4 text-neutral-300 max-w-md">
              {t("تقسيم العطور الأصلية — décantes 5/10/20ml testées sur peau. Paiement à la livraison, 58 wilayas.",
                "تقسيم العطور الأصلية — 5/10/20 مل مجربة على البشرة. الدفع عند الاستلام، توصيل 58 ولاية.")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="gold-btn px-7 py-3.5 rounded-full min-h-[52px] inline-flex items-center">
                {t("Découvrir la boutique →", "اكتشف المتجر ←")}
              </Link>
              <a href={STORE.tiktok} target="_blank" className="px-7 py-3.5 rounded-full border border-[#c9a24b] min-h-[52px] inline-flex items-center font-bold">
                TikTok ↗
              </a>
            </div>
            <div className="mt-6 flex gap-6 text-sm">
              <div><div className="font-extrabold text-xl text-[#e8cf8f]">4.9★</div><div className="text-neutral-400">{t("1200+ avis", "1200+ تقييم")}</div></div>
              <div><div className="font-extrabold text-xl text-[#e8cf8f]">58</div><div className="text-neutral-400">Wilayas</div></div>
              <div><div className="font-extrabold text-xl text-[#e8cf8f]">10h+</div><div className="text-neutral-400">{t("Tenue", "الثبات")}</div></div>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <img src="/evenatil.jpg" alt="Evantail logo" className="w-80 h-80 rounded-full object-cover border-4 border-[#c9a24b] shadow-[0_0_80px_#c9a24b44]" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-[#2a2a2a] bg-[#111] py-2.5 overflow-hidden whitespace-nowrap text-sm text-[#e8cf8f]">
        <div className="inline-block animate-pulse">✦ Aventus ✦ Bleu Chanel ✦ Scandal ✦ Oud Satin Mood ✦ {t("Livraison 58 wilayas", "توصيل 58 ولاية")} ✦ {t("Paiement à la livraison", "الدفع عند الاستلام")} ✦ Akid Lotfi Oran ✦&nbsp;</div>
      </div>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-lux text-2xl sm:text-3xl font-bold">{t("Best-sellers TikTok", "الأكثر مبيعاً في تيك توك")}</h2>
          <Link href="/shop" className="text-sm text-[#e8cf8f] font-bold">{t("Boutique →", "المتجر ←")}</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {best.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      {/* DECANT EXPLAINER */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="card p-6 sm:p-10 grid md:grid-cols-3 gap-6 text-center">
          {[
            { n: "5ml", fr: "Découverte — testez avant le flacon", ar: "اكتشاف — جرب قبل القارورة" },
            { n: "10ml", fr: "Le favori — 1 mois d'utilisation", ar: "المفضل — شهر استعمال" },
            { n: "20ml", fr: "Passion — 2-3 mois, meilleur prix/ml", ar: "العشق — 2-3 أشهر، أفضل سعر" },
          ].map((x) => (
            <div key={x.n} className="bg-black/40 rounded-2xl p-5 border border-[#2a2a2a]">
              <div className="font-lux text-4xl gold-text font-bold">{x.n}</div>
              <p className="mt-2 text-sm text-neutral-300">{lang === "ar" ? x.ar : x.fr}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="font-lux text-2xl sm:text-3xl font-bold mb-5">{t("Catalogue décantes", "كتالوج التقسيمات")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {best.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
        <div className="text-center mt-8">
          <Link href="/shop" className="gold-btn px-8 py-3.5 rounded-full inline-block min-h-[52px]">{t("Voir tout le shop", "شاهد كل المتجر")}</Link>
        </div>
      </section>

      {/* STORE */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="card p-6 sm:p-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-lux text-2xl font-bold gold-text">Evantail — Akid Lotfi</h3>
            <p className="mt-2 text-neutral-300 text-sm">{t("Oran, Akid Lotfi, derrière la mairie. Ouvert 7j/7 • 10h–20h.", "وهران العقيد لطفي خلف البلدية. مفتوح 7/7 • 10-20.")}</p>
            <div className="mt-4 space-y-2 font-bold" dir="ltr">
              <a href="tel:0699440352" className="block bg-[#1a1a1a] rounded-xl px-4 py-3 border border-[#2a2a2a]">📞 0699 44 03 52</a>
              <a href="tel:0771094515" className="block bg-[#1a1a1a] rounded-xl px-4 py-3 border border-[#2a2a2a]">📞 0771 09 45 15</a>
            </div>
            <div className="mt-4 flex gap-2">
              <a href="https://maps.google.com/?q=Akid+Lotfi+Oran" target="_blank" className="gold-btn px-5 py-2.5 rounded-full text-sm">{t("Itinéraire →", "الاتجاهات ←")}</a>
              <a href={STORE.tiktok} target="_blank" className="px-5 py-2.5 rounded-full border border-[#c9a24b] text-sm font-bold">TikTok 261.8K ↗</a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#2a2a2a] min-h-[240px]">
            <iframe title="map" src="https://maps.google.com/maps?q=Akid%20Lotfi%20Oran&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[240px]" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  );
}

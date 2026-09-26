"use client";
import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, Search, SlidersHorizontal } from "lucide-react";
import { PRODUCTS } from "@/data/catalog";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const { t, products } = useStore();
  const [q, setQ] = useState("");
  const [gender, setGender] = useState("all");
  const [sort, setSort] = useState("sold");

  const list = useMemo(() => {
    let l = [...products];
    if (gender !== "all") l = l.filter((p) => p.gender === gender);
    if (q) {
      const s = q.toLowerCase();
      l = l.filter((p) => (p.brand + " " + p.name.fr + " " + p.name.ar).toLowerCase().includes(s));
    }
    if (sort === "price-asc") l.sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === "price-desc") l.sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sort === "sold") l.sort((a, b) => b.sold - a.sold);
    return l;
  }, [q, gender, sort, products]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-lux text-3xl sm:text-4xl font-bold">{t("Boutique", "المتجر")} <span className="gold-text">Evantail</span></h1>
      <p className="text-neutral-400 text-sm mt-1">{t("Décantes 5/10/20ml • 100% originales • COD 58 wilayas", "تقسيمات 5/10/20 مل • أصلية 100% • الدفع عند الاستلام")}</p>

      <div className="mt-5 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Rechercher Dior, Aventus, Oud…", "ابحث عن ديور، أفنتوس، عود…")}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-full ps-11 pe-5 py-3 text-sm outline-none focus:border-[#c9a24b] min-h-[48px]" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
          <SlidersHorizontal size={17} className="text-neutral-500 shrink-0" />
          {[["all", t("Tous", "الكل")], ["homme", t("Homme", "رجالي")], ["femme", t("Femme", "نسائي")], ["mixte", t("Mixte", "مشترك")]].map(([v, l]) => (
            <button key={v} onClick={() => setGender(v)}
              className={`px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap min-h-[44px] border ${gender === v ? "bg-[#c9a24b] text-black border-[#c9a24b]" : "border-neutral-700"}`}>{l}</button>
          ))}
          <div className="relative shrink-0">
            <ArrowDownWideNarrow size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-[#141414] border border-neutral-700 rounded-full ps-9 pe-4 py-2.5 text-sm min-h-[44px] appearance-none">
              <option value="sold">{t("Top ventes", "الأكثر مبيعاً")}</option>
              <option value="price-asc">{t("Prix ↑", "السعر ↑")}</option>
              <option value="price-desc">{t("Prix ↓", "السعر ↓")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {list.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
      {list.length === 0 && <p className="text-center text-neutral-500 py-12">{t("Aucun parfum trouvé.", "لا يوجد عطر.")}</p>}
    </div>
  );
}

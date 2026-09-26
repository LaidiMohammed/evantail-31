"use client";
import { useState } from "react";
import { useStore, OrderStatus } from "@/lib/store";

const LABELS: Record<OrderStatus, { fr: string; ar: string; color: string }> = {
  new: { fr: "Nouvelle", ar: "جديدة", color: "bg-yellow-500/20 text-yellow-300" },
  confirmed: { fr: "Confirmée", ar: "مؤكدة", color: "bg-blue-500/20 text-blue-300" },
  shipped: { fr: "Expédiée", ar: "مشحونة", color: "bg-purple-500/20 text-purple-300" },
  delivered: { fr: "Livrée", ar: "تم التوصيل", color: "bg-green-500/20 text-green-300" },
  returned: { fr: "Retournée", ar: "مرتجعة", color: "bg-orange-500/20 text-orange-300" },
  cancelled: { fr: "Annulée", ar: "ملغاة", color: "bg-red-500/20 text-red-300" },
};

export default function Track() {
  const { t, lang, orders } = useStore();
  const [q, setQ] = useState("");
  const list = q ? orders.filter((o) => (o.id + o.phone).toLowerCase().includes(q.toLowerCase())) : orders;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-lux text-3xl font-bold">{t("Suivi commande", "تتبع الطلب")}</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("ID (EV-123456) ou téléphone…", "رقم الطلب أو الهاتف…")}
        className="mt-4 w-full bg-[#141414] border border-neutral-700 rounded-full px-5 py-3 min-h-[52px] outline-none focus:border-[#c9a24b]" />
      <div className="mt-5 space-y-3">
        {list.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono font-bold text-[#e8cf8f]">{o.id}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${LABELS[o.status].color}`}>{lang === "ar" ? LABELS[o.status].ar : LABELS[o.status].fr}</span>
            </div>
            <div className="mt-2 text-sm text-neutral-300">{o.name} • <span dir="ltr">{o.phone}</span> • {o.wilaya}</div>
            <div className="mt-1 text-sm">{o.items.map((i) => `${i.name} ${i.ml}ml x${i.qty}`).join(" • ")}</div>
            <div className="mt-1 font-bold">Total: <span className="text-[#e8cf8f]">{o.total.toLocaleString()} DA</span></div>
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-neutral-500 py-10">{t("Aucune commande. Passez votre première commande COD.", "لا توجد طلبات.")}</p>}
      </div>
    </div>
  );
}

export { LABELS };

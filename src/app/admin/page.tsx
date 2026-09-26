"use client";
import { useMemo, useState } from "react";
import { useStore, OrderStatus } from "@/lib/store";
import { PRODUCTS } from "@/data/catalog";
import { LABELS } from "../track/page";

const ADMIN_PIN = "3131";

export default function Admin() {
  const { t, orders, updateStatus } = useStore();
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + (o.status !== "cancelled" ? o.total : 0), 0);
    return {
      count: orders.length,
      total,
      newer: orders.filter((o) => o.status === "new").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
  }, [orders]);

  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16">
        <div className="card p-6 text-center">
          <h1 className="font-lux text-2xl font-bold gold-text">Admin Evantail</h1>
          <p className="text-xs text-neutral-500 mt-1">PIN démo: 3131 • {t("Contrôle commandes", "مراقبة الطلبات")}</p>
          <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" type="password" placeholder="PIN"
            className="mt-4 w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest outline-none focus:border-[#c9a24b]" />
          <button onClick={() => pin === ADMIN_PIN && setAuthed(true)} className="gold-btn w-full mt-3 py-3 rounded-full">Entrer</button>
          {pin && pin !== ADMIN_PIN && <p className="text-xs text-red-400 mt-2">PIN incorrect</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-lux text-3xl font-bold">Dashboard <span className="gold-text">Admin</span></h1>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Commandes", stats.count],
          ["CA (DA)", stats.total.toLocaleString()],
          ["Nouvelles", stats.newer],
          ["Livrées", stats.delivered],
        ].map(([l, v]) => (
          <div key={l as string} className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-[#e8cf8f]">{v}</div>
            <div className="text-xs text-neutral-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {(["all", "new", "confirmed", "shipped", "delivered", "returned", "cancelled"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border min-h-[40px] ${filter === s ? "bg-[#c9a24b] text-black border-[#c9a24b]" : "border-neutral-700"}`}>
            {s === "all" ? `Toutes (${orders.length})` : `${LABELS[s].fr} (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {list.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-[#e8cf8f]">{o.id}</span>
                <span className="text-xs text-neutral-500 ms-2">{new Date(o.date).toLocaleString()}</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${LABELS[o.status].color}`}>{LABELS[o.status].fr}</span>
            </div>
            <div className="mt-2 text-sm font-bold">{o.name} • <a href={`tel:${o.phone.replace(/\s/g, "")}`} dir="ltr" className="text-[#e8cf8f]">📞 {o.phone}</a> • {o.wilaya} ({o.commune})</div>
            <div className="text-xs text-neutral-400">{o.address} • {o.delivery === "home" ? "Domicile" : "Stopdesk"}</div>
            <div className="mt-1 text-sm">{o.items.map((i) => `${i.name} ${i.ml}ml x${i.qty}`).join(" • ")}</div>
            <div className="mt-1 font-bold text-sm">Total COD: <span className="text-[#e8cf8f]">{o.total.toLocaleString()} DA</span> (liv: {o.shipping.toLocaleString()})</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(Object.keys(LABELS) as OrderStatus[]).map((s) => (
                <button key={s} onClick={() => updateStatus(o.id, s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold border min-h-[36px] ${o.status === s ? "bg-[#c9a24b] text-black border-[#c9a24b]" : "border-neutral-700 text-neutral-300"}`}>
                  {LABELS[s].fr}
                </button>
              ))}
              <a href={`https://wa.me/213${o.phone.replace(/\D/g, "").slice(1)}?text=${encodeURIComponent("Salam " + o.name + ", Evantail Oran confirme votre commande " + o.id + " (" + o.total + " DA).")}`} target="_blank"
                className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-green-700 min-h-[36px]">WhatsApp ✓</a>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-neutral-500 py-10">Aucune commande dans ce statut.</p>}
      </div>

      <h2 className="font-lux text-2xl font-bold mt-10 mb-3">Stock décantes</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRODUCTS.map((p) => (
          <div key={p.slug} className="card p-4 text-sm">
            <div className="font-bold">{p.brand} {p.name.fr}</div>
            <div className="mt-1 space-y-1">
              {p.variants.map((v) => (
                <div key={v.ml} className="flex justify-between bg-black/30 rounded-lg px-2 py-1">
                  <span>{v.ml}ml • {v.sku}</span>
                  <span className={v.stock < 10 ? "text-red-400 font-bold" : "text-green-400"}>{v.stock} pcs</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

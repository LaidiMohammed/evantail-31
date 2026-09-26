"use client";
import { useMemo, useState } from "react";
import {
  BadgeDollarSign, Check, FlaskConical, LayoutDashboard, Lock, MessageCircle,
  Package, Pencil, Phone, Plus, Power, RotateCcw, TicketPercent, Trash2, X,
} from "lucide-react";
import { useStore, OrderStatus } from "@/lib/store";
import { Product } from "@/data/catalog";
import { LABELS } from "../track/page";

const ADMIN_PIN = "3131";
type Tab = "dash" | "orders" | "products" | "promos";

const emptyProduct = (): Product => ({
  slug: "parfum-" + Date.now().toString(36),
  brand: "",
  name: { fr: "", ar: "" },
  gender: "mixte",
  notes: { fr: "", ar: "" },
  tenue: "10h+",
  image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
  variants: [
    { ml: 5, price: 2000, stock: 20, sku: "NEW-5" },
    { ml: 10, price: 3500, stock: 15, sku: "NEW-10" },
    { ml: 20, price: 6500, stock: 8, sku: "NEW-20" },
  ],
  rating: 4.8,
  sold: 0,
});

export default function Admin() {
  const {
    t, orders, updateStatus, deleteOrder, clearOrders,
    products, addProduct, updateProduct, deleteProduct, resetProducts,
    promos, addPromo, togglePromo, deletePromo,
  } = useStore();
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("dash");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoPct, setPromoPct] = useState(20);

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
          <Lock size={30} className="mx-auto text-[#c9a24b]" />
          <h1 className="font-lux text-2xl font-bold gold-text mt-2">Admin Evantail</h1>
          <p className="text-xs text-neutral-500 mt-1">PIN démo: 3131 • {t("Contrôle commandes", "مراقبة الطلبات")}</p>
          <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" type="password" placeholder="PIN"
            onKeyDown={(e) => e.key === "Enter" && pin === ADMIN_PIN && setAuthed(true)}
            className="mt-4 w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest outline-none focus:border-[#c9a24b]" />
          <button onClick={() => pin === ADMIN_PIN && setAuthed(true)} className="gold-btn w-full mt-3 py-3 rounded-full">Entrer</button>
          {pin && pin !== ADMIN_PIN && <p className="text-xs text-red-400 mt-2">PIN incorrect</p>}
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; Icon: typeof Package; count?: number }[] = [
    { id: "dash", label: "Dashboard", Icon: LayoutDashboard },
    { id: "orders", label: `${t("Commandes", "الطلبات")} (${orders.length})`, Icon: Package, count: stats.newer },
    { id: "products", label: `${t("Produits", "المنتجات")} (${products.length})`, Icon: FlaskConical },
    { id: "promos", label: `Promos (${promos.length})`, Icon: TicketPercent },
  ];

  const saveProduct = () => {
    if (!editing || !editing.brand.trim() || !editing.name.fr.trim()) return;
    const slug = editing.slug.trim().toLowerCase().replace(/\s+/g, "-") || "parfum-" + Date.now().toString(36);
    const p = { ...editing, slug };
    if (isNew) addProduct(p);
    else updateProduct(editing.slug, p);
    setEditing(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-lux text-3xl font-bold">Dashboard <span className="gold-text">Admin</span></h1>

      {/* TABS */}
      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map(({ id, label, Icon, count }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border min-h-[44px] inline-flex items-center gap-1.5 ${tab === id ? "bg-[#c9a24b] text-black border-[#c9a24b]" : "border-neutral-700"}`}>
            <Icon size={15} /> {label}
            {typeof count === "number" && count > 0 && (
              <span className="bg-red-500 text-white text-[10px] min-w-5 h-5 px-1 rounded-full inline-flex items-center justify-center font-bold">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "dash" && (
        <>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ["Commandes", stats.count, <Package key="i" size={18} />],
              ["CA (DA)", stats.total.toLocaleString(), <BadgeDollarSign key="i" size={18} />],
              ["Nouvelles", stats.newer, <Plus key="i" size={18} />],
              ["Livrées", stats.delivered, <Check key="i" size={18} />],
            ].map(([l, v, icon]) => (
              <div key={l as string} className="card p-4 text-center">
                <div className="flex justify-center text-[#c9a24b]">{icon}</div>
                <div className="text-2xl font-extrabold text-[#e8cf8f] mt-1">{v}</div>
                <div className="text-xs text-neutral-400">{l}</div>
              </div>
            ))}
          </div>
          <h2 className="font-bold mt-6 mb-2">Dernières commandes</h2>
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="card p-3 flex items-center justify-between text-sm">
                <span className="font-mono text-[#e8cf8f] font-bold">{o.id}</span>
                <span className="text-neutral-400 truncate flex-1 mx-3">{o.name} • {o.total.toLocaleString()} DA</span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${LABELS[o.status].color}`}>{LABELS[o.status].fr}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-neutral-500 text-sm">Aucune commande pour le moment.</p>}
          </div>
        </>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
            {(["all", "new", "confirmed", "shipped", "delivered", "returned", "cancelled"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border min-h-[40px] ${filter === s ? "bg-[#c9a24b] text-black border-[#c9a24b]" : "border-neutral-700"}`}>
                {s === "all" ? `Toutes (${orders.length})` : `${LABELS[s].fr} (${orders.filter((o) => o.status === s).length})`}
              </button>
            ))}
            {orders.length > 0 && (
              <button onClick={() => confirm("Tout effacer ?") && clearOrders()}
                className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-red-800 text-red-400 min-h-[40px] inline-flex items-center gap-1">
                <Trash2 size={13} /> Tout effacer
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {list.map((o) => (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-[#e8cf8f]">{o.id}</span>
                    <span className="text-xs text-neutral-500 ms-2">{new Date(o.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${LABELS[o.status].color}`}>{LABELS[o.status].fr}</span>
                    <button onClick={() => confirm(`Supprimer ${o.id} ?`) && deleteOrder(o.id)} title="Supprimer"
                      className="w-9 h-9 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm font-bold flex items-center gap-2 flex-wrap">
                  {o.name} •
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`} dir="ltr" className="text-[#e8cf8f] inline-flex items-center gap-1"><Phone size={13} /> {o.phone}</a>
                  • {o.wilaya} ({o.commune})
                </div>
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
                    className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-green-700 min-h-[36px] inline-flex items-center gap-1">
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
            {list.length === 0 && <p className="text-center text-neutral-500 py-10">Aucune commande dans ce statut.</p>}
          </div>
        </>
      )}

      {/* PRODUCTS */}
      {tab === "products" && (
        <>
          <div className="mt-5 flex gap-2 flex-wrap">
            <button onClick={() => { setEditing(emptyProduct()); setIsNew(true); }}
              className="gold-btn px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-1.5 min-h-[44px]">
              <Plus size={16} strokeWidth={3} /> Nouveau parfum
            </button>
            <button onClick={() => confirm("Réinitialiser le catalogue ?") && resetProducts()}
              className="px-5 py-2.5 rounded-full text-sm border border-neutral-700 inline-flex items-center gap-1.5 min-h-[44px]">
              <RotateCcw size={15} /> Reset catalogue
            </button>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => (
              <div key={p.slug} className="card p-4">
                <div className="flex gap-3">
                  <img src={p.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{p.brand} {p.name.fr}</div>
                    <div className="text-xs text-neutral-500 font-mono truncate">{p.slug}</div>
                    <div className="text-xs text-[#e8cf8f] font-bold">dès {Math.min(...p.variants.map((v) => v.price)).toLocaleString()} DA</div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {p.variants.map((v, i) => (
                    <div key={i} className="flex justify-between bg-black/30 rounded-lg px-2 py-1 text-xs">
                      <span>{v.ml}ml • {v.sku}</span>
                      <span>{v.price.toLocaleString()} DA • <b className={v.stock < 10 ? "text-red-400" : "text-green-400"}>{v.stock}</b></span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setEditing({ ...p, variants: p.variants.map((v) => ({ ...v })) }); setIsNew(false); }}
                    className="flex-1 py-2 rounded-full text-xs font-bold bg-[#1d1d1d] border border-[#c9a24b66] inline-flex items-center justify-center gap-1 min-h-[40px]">
                    <Pencil size={13} /> Modifier
                  </button>
                  <button onClick={() => confirm(`Supprimer ${p.brand} ${p.name.fr} ?`) && deleteProduct(p.slug)}
                    className="w-11 h-10 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PROMOS */}
      {tab === "promos" && (
        <>
          <div className="card p-4 mt-5 flex flex-col sm:flex-row gap-2 sm:items-center">
            <input value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="CODE (ex: RAMADAN15)"
              className="flex-1 bg-black/40 border border-neutral-700 rounded-xl px-4 py-2.5 min-h-[48px] outline-none focus:border-[#c9a24b] font-mono font-bold uppercase" />
            <div className="flex items-center gap-2">
              <input type="number" min={5} max={70} value={promoPct} onChange={(e) => setPromoPct(Number(e.target.value))}
                className="w-20 bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 min-h-[48px] outline-none text-center font-bold" />
              <span className="text-sm text-neutral-400">%</span>
            </div>
            <button onClick={() => { if (promoCode.trim()) { addPromo({ code: promoCode.trim().toUpperCase(), pct: promoPct, active: true }); setPromoCode(""); } }}
              className="gold-btn px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-1.5 min-h-[48px]">
              <Plus size={15} strokeWidth={3} /> Ajouter
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {promos.map((p) => (
              <div key={p.code} className="card p-3 flex items-center gap-3">
                <TicketPercent size={19} className="text-[#c9a24b] shrink-0" />
                <div className="flex-1">
                  <div className="font-mono font-bold">{p.code} <span className="text-[#e8cf8f]">-{p.pct}%</span></div>
                  <div className="text-[11px] text-neutral-500">{p.active ? "Actif — utilisable au checkout" : "Désactivé"}</div>
                </div>
                <button onClick={() => togglePromo(p.code)} title="activer/désactiver"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center ${p.active ? "bg-green-800 border-green-600 text-green-200" : "border-neutral-700 text-neutral-500"}`}>
                  <Power size={16} />
                </button>
                <button onClick={() => deletePromo(p.code)} title="supprimer"
                  className="w-10 h-10 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {promos.length === 0 && <p className="text-neutral-500 text-sm text-center py-6">Aucun code promo.</p>}
          </div>
        </>
      )}

      {/* PRODUCT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/75" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg inline-flex items-center gap-2">
                <FlaskConical size={18} className="text-[#c9a24b]" /> {isNew ? "Nouveau parfum" : "Modifier parfum"}
              </h3>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <label className="block">Marque*<input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none focus:border-[#c9a24b]" placeholder="Dior" /></label>
                <label className="block">Slug<input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none font-mono text-xs" /></label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">Nom FR*<input value={editing.name.fr} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, fr: e.target.value } })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none focus:border-[#c9a24b]" /></label>
                <label className="block">Nom AR<input value={editing.name.ar} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, ar: e.target.value } })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none focus:border-[#c9a24b]" /></label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="block">Genre<select value={editing.gender} onChange={(e) => setEditing({ ...editing, gender: e.target.value as Product["gender"] })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none">
                  <option value="homme">Homme</option><option value="femme">Femme</option><option value="mixte">Mixte</option>
                </select></label>
                <label className="block">Tenue<input value={editing.tenue} onChange={(e) => setEditing({ ...editing, tenue: e.target.value })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none" /></label>
                <label className="block">Note ★<input type="number" min={3} max={5} step={0.1} value={editing.rating}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                  className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none text-center" /></label>
              </div>
              <label className="block">Image URL<input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none text-xs" /></label>
              <label className="block">Notes FR<input value={editing.notes.fr} onChange={(e) => setEditing({ ...editing, notes: { ...editing.notes, fr: e.target.value } })}
                className="mt-1 w-full bg-black/40 border border-neutral-700 rounded-xl px-3 py-2.5 outline-none" placeholder="Oud • Musc • Ambre" /></label>
              <div>
                <div className="font-bold mb-1.5">Variantes ml / prix / stock</div>
                {editing.variants.map((v, i) => (
                  <div key={i} className="flex gap-1.5 mb-1.5">
                    <input type="number" value={v.ml} onChange={(e) => setEditing({ ...editing, variants: editing.variants.map((x, j) => j === i ? { ...x, ml: Number(e.target.value) } : x) })}
                      className="w-16 bg-black/40 border border-neutral-700 rounded-lg px-2 py-2 text-center" title="ml" />
                    <input type="number" value={v.price} onChange={(e) => setEditing({ ...editing, variants: editing.variants.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x) })}
                      className="flex-1 bg-black/40 border border-neutral-700 rounded-lg px-2 py-2" title="prix DA" />
                    <input type="number" value={v.stock} onChange={(e) => setEditing({ ...editing, variants: editing.variants.map((x, j) => j === i ? { ...x, stock: Number(e.target.value) } : x) })}
                      className="w-20 bg-black/40 border border-neutral-700 rounded-lg px-2 py-2 text-center" title="stock" />
                    <button onClick={() => setEditing({ ...editing, variants: editing.variants.filter((_, j) => j !== i) })}
                      className="w-10 rounded-lg bg-red-900/40 border border-red-800 text-red-400 flex items-center justify-center"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={() => setEditing({ ...editing, variants: [...editing.variants, { ml: 30, price: 9000, stock: 5, sku: "NEW-" + Date.now().toString(36).slice(-4).toUpperCase() }] })}
                  className="text-xs font-bold text-[#e8cf8f] inline-flex items-center gap-1 mt-1"><Plus size={13} /> Ajouter variante</button>
              </div>
              <button onClick={saveProduct} className="gold-btn w-full py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 min-h-[52px]">
                <Check size={17} strokeWidth={3} /> {isNew ? "Créer le parfum" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

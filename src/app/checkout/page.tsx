"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Building2, CheckCircle2, Home, MapPin, Package, Phone, TicketPercent, Truck, User } from "lucide-react";
import { WILAYAS } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function Checkout() {
  const { t, lang, cart, placeOrder, promos } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaId, setWilayaId] = useState(31);
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState<"home" | "stopdesk">("home");
  const [promoCode, setPromoCode] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const w = WILAYAS.find((x) => x.id === wilayaId)!;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = delivery === "home" ? w.home : w.stopdesk;
  const promo = promos.find((p) => p.active && p.code.toLowerCase() === promoCode.trim().toLowerCase());
  const discount = promo ? Math.round((subtotal * promo.pct) / 100) : 0;
  const total = subtotal - discount + (cart.length ? shipping : 0);
  const valid = useMemo(() => name.trim().length >= 3 && /^0[567]\d{8}$/.test(phone.replace(/[\s-]/g, "")), [name, phone]);

  const submit = () => {
    if (!valid || cart.length === 0) return;
    const o = placeOrder({
      name, phone, wilaya: lang === "ar" ? w.ar : w.fr, commune, address, delivery,
      items: cart, subtotal: subtotal - discount, shipping, total,
    });
    setDone(o.id);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14 text-center">
        <div className="card p-8">
          <CheckCircle2 size={52} className="mx-auto text-green-400" />
          <h1 className="font-lux text-2xl font-bold mt-3">{t("Merci", "شكراً")} {name}!</h1>
          <p className="text-neutral-300 mt-2 text-sm">{t("Commande reçue. On vous appellera pour confirmer.", "تم استلام طلبك. سنتصل بك للتأكيد.")}</p>
          <div className="mt-4 bg-black/50 rounded-xl p-4 font-mono font-bold text-[#e8cf8f]">{done} • {total.toLocaleString()} DA</div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link href="/track" className="gold-btn py-3 rounded-full text-sm inline-flex items-center justify-center gap-1.5">
              {t("Suivre", "تتبع")} <ArrowRight size={15} className={lang === "ar" ? "rotate-180" : ""} />
            </Link>
            <Link href="/shop" className="py-3 rounded-full border border-neutral-700 text-sm">{t("Continuer", "مواصلة")}</Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = "w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 min-h-[52px] outline-none focus:border-[#c9a24b] ps-11";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
      <div className="card p-5 sm:p-6">
        <h1 className="font-lux text-2xl font-bold inline-flex items-center gap-2"><Package size={22} className="text-[#c9a24b]" /> {t("Commander — COD", "اطلب — الدفع عند الاستلام")}</h1>
        <div className="mt-4 space-y-3">
          <div className="relative">
            <User size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Nom complet *", "الاسم الكامل *")} className={inputCls} />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 / 05 / 07 — 10 chiffres *" inputMode="tel" dir="ltr" className={`${inputCls} ps-11`} />
          </div>
          {!valid && phone.length > 3 && <p className="text-xs text-red-400">{t("Numéro invalide (ex: 0699440352).", "رقم غير صحيح.")}</p>}
          <div className="grid grid-cols-2 gap-3">
            <select value={wilayaId} onChange={(e) => setWilayaId(Number(e.target.value))}
              className="bg-black/40 border border-neutral-700 rounded-xl px-3 py-3 min-h-[52px] outline-none">
              {WILAYAS.map((x) => <option key={x.id} value={x.id}>{x.id} — {lang === "ar" ? x.ar : x.fr}</option>)}
            </select>
            <div className="relative">
              <MapPin size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input value={commune} onChange={(e) => setCommune(e.target.value)} placeholder={t("Commune", "البلدية")}
                className="w-full bg-black/40 border border-neutral-700 rounded-xl ps-10 pe-4 py-3 min-h-[52px] outline-none focus:border-[#c9a24b]" />
            </div>
          </div>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("Adresse / point repère", "العنوان")}
            className="w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 min-h-[52px] outline-none focus:border-[#c9a24b]" />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setDelivery("home")} className={`rounded-xl border p-3 text-sm font-bold min-h-[64px] inline-flex flex-col items-center gap-1 ${delivery === "home" ? "border-[#c9a24b] bg-[#c9a24b15]" : "border-neutral-700"}`}>
              <span className="inline-flex items-center gap-1.5"><Home size={15} /> {t("Domicile", "للمنزل")}</span>
              <span className="text-[#e8cf8f]">{w.home.toLocaleString()} DA</span>
            </button>
            <button onClick={() => setDelivery("stopdesk")} className={`rounded-xl border p-3 text-sm font-bold min-h-[64px] inline-flex flex-col items-center gap-1 ${delivery === "stopdesk" ? "border-[#c9a24b] bg-[#c9a24b15]" : "border-neutral-700"}`}>
              <span className="inline-flex items-center gap-1.5"><Building2 size={15} /> Stopdesk</span>
              <span className="text-[#e8cf8f]">{w.stopdesk.toLocaleString()} DA</span>
            </button>
          </div>
          <div className="relative">
            <TicketPercent size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder={t("Code promo (ex: EVANT20)", "كود الخصم")}
              className={inputCls} />
          </div>
          {promo && <p className="text-xs text-green-400 inline-flex items-center gap-1"><CheckCircle2 size={13} /> -{promo.pct}% {t("appliqué", "مطبق")} (-{discount.toLocaleString()} DA)</p>}
          <button disabled={!valid || cart.length === 0} onClick={submit}
            className="gold-btn w-full py-4 rounded-full min-h-[56px] disabled:opacity-40 inline-flex items-center justify-center gap-2">
            <Banknote size={18} /> {t(`Confirmer • ${total.toLocaleString()} DA`, `تأكيد • ${total.toLocaleString()} دج`)}
          </button>
          <p className="text-[11px] text-neutral-500 inline-flex items-center gap-1.5"><Truck size={13} /> {t("Paiement espèces à la livraison.", "الدفع نقداً عند الاستلام.")}</p>
        </div>
      </div>
      <div className="card p-5 sm:p-6 h-fit">
        <h2 className="font-bold inline-flex items-center gap-2"><Package size={17} className="text-[#c9a24b]" /> {t("Résumé", "الملخص")} ({cart.length})</h2>
        <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
          {cart.map((i) => (
            <div key={i.slug + i.ml} className="flex justify-between text-sm bg-black/30 rounded-lg px-3 py-2">
              <span>{i.name} • {i.ml}ml x{i.qty}</span>
              <span className="font-bold text-[#e8cf8f]">{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          {cart.length === 0 && <p className="text-neutral-500 text-sm">{t("Panier vide.", "السلة فارغة.")} <Link href="/shop" className="text-[#e8cf8f]">Shop</Link></p>}
        </div>
        <div className="mt-4 space-y-1 text-sm border-t border-neutral-800 pt-3">
          <div className="flex justify-between"><span>{t("Sous-total", "المجموع الفرعي")}</span><span>{subtotal.toLocaleString()} DA</span></div>
          {discount > 0 && <div className="flex justify-between text-green-400"><span>Promo {promo?.code}</span><span>-{discount.toLocaleString()} DA</span></div>}
          <div className="flex justify-between"><span>{t("Livraison", "التوصيل")} ({w.fr})</span><span>{shipping.toLocaleString()} DA</span></div>
          <div className="flex justify-between font-extrabold text-lg"><span>Total</span><span className="text-[#e8cf8f]">{total.toLocaleString()} DA</span></div>
        </div>
      </div>
    </div>
  );
}

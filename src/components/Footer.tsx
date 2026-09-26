"use client";
import { useStore } from "@/lib/store";
import { STORE } from "@/data/catalog";

export default function Footer() {
  const { t } = useStore();
  return (
    <footer className="mt-12 border-t border-[#2a2a2a] bg-[#0d0d0d] pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/evenatil.jpg" alt="Evantail" className="w-11 h-11 rounded-full object-cover border border-[#c9a24b]" />
            <div className="font-lux text-2xl gold-text font-bold">Evantail</div>
          </div>
          <p className="text-sm text-neutral-400">{t("Parfums originaux & تقسيم العطور الأصلية — Oran. TikTok: @evantail.31", "عطور أصلية وتقسيم العطور — وهران. تيك توك: @evantail.31")}</p>
          <div className="mt-3 flex gap-2">
            <a href={STORE.tiktok} target="_blank" className="px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-sm">TikTok ↗</a>
            <a href="https://maps.google.com/?q=Akid+Lotfi+Oran" target="_blank" className="px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-sm">Maps ↗</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-[#e8cf8f]">{t("Boutique", "المتجر")}</h4>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><a href="/shop">Boutique</a></li>
            <li><a href="/track">{t("Suivi commande", "تتبع الطلب")}</a></li>
            <li><a href="/checkout">{t("Commander", "اطلب")}</a></li>
            <li><a href="/admin">Admin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-[#e8cf8f]">{t("Contact", "اتصل بنا")}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:0699440352" className="text-neutral-200 font-bold" dir="ltr">📞 0699 44 03 52</a></li>
            <li><a href="tel:0771094515" className="text-neutral-200 font-bold" dir="ltr">📞 0771 09 45 15</a></li>
            <li className="text-neutral-400">📍 {t("Oran, Akid Lotfi, derrière la mairie", "وهران العقيد لطفي خلف البلدية")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-[#e8cf8f]">{t("Infos", "معلومات")}</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>✓ {t("Paiement à la livraison", "الدفع عند الاستلام")}</li>
            <li>✓ {t("Livraison 58 wilayas", "توصيل 58 ولاية")}</li>
            <li>✓ {t("100% Original", "أصلي 100%")}</li>
            <li>{t("Ouvert 7j/7 • 10h–20h", "مفتوح 7/7 • 10-20")}</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-600 pb-2">© 2026 Evantail.31 Oran — 134 suivis • 261.8K followers • 2.3M j'aime</div>
    </footer>
  );
}

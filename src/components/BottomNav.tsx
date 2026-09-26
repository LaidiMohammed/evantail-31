"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export default function BottomNav() {
  const { t } = useStore();
  const path = usePathname();
  const items = [
    { href: "/", icon: "⌂", label: t("Accueil", "الرئيسية") },
    { href: "/shop", icon: "✦", label: t("Boutique", "المتجر") },
    { href: "/track", icon: "⌕", label: t("Suivi", "تتبع") },
    { href: "/admin", icon: "○", label: "Admin" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 border-t border-[#2a2a2a] backdrop-blur">
      <div className="grid grid-cols-4 h-16">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${path === i.href ? "text-[#e8cf8f]" : "text-neutral-400"}`}>
            <span className="text-xl leading-none">{i.icon}</span>
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

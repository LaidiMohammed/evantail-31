"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackageSearch, ShieldCheck, Store } from "lucide-react";
import { useStore } from "@/lib/store";

export default function BottomNav() {
  const { t } = useStore();
  const path = usePathname();
  const items = [
    { href: "/", Icon: Home, label: t("Accueil", "الرئيسية") },
    { href: "/shop", Icon: Store, label: t("Boutique", "المتجر") },
    { href: "/track", Icon: PackageSearch, label: t("Suivi", "تتبع") },
    { href: "/admin", Icon: ShieldCheck, label: "Admin" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 border-t border-[#2a2a2a] backdrop-blur">
      <div className="grid grid-cols-4 h-16">
        {items.map(({ href, Icon, label }) => (
          <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${path === href ? "text-[#e8cf8f]" : "text-neutral-400"}`}>
            <Icon size={21} strokeWidth={path === href ? 2.5 : 2} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Evantail.31 — تقسيم العطور الأصلية | Oran",
  description: "Evantail Oran — décantes parfums 100% originaux 5/10/20ml. Paiement à la livraison 58 wilayas. Akid Lotfi derrière la mairie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}

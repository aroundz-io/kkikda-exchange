import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Toasts from "@/components/ui/Toasts";

export const metadata: Metadata = {
  title: "KKIKDA — RWA Tea Exchange",
  description:
    "The world's first RWA exchange for authenticated vintage Pu'er tea. Trade, stake, and redeem real-world assets on-chain.",
  keywords: ["RWA", "blockchain", "tea", "NFT", "DeFi", "exchange"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col noise-overlay">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toasts />
      </body>
    </html>
  );
}

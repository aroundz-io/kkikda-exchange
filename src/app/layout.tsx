import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Web3Provider } from "@/lib/web3/provider";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { Toasts } from "@/components/ui/Toasts";

export const metadata: Metadata = {
  title: "KKIKDAGEO | Digital Kura Exchange",
  description:
    "A vintage Pu'er tea RWA crypto exchange. Trade authenticated, tokenized tea cakes on-chain with full provenance tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Manrope:wght@300;400;600;800&family=Space+Grotesk:wght@300;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">
        <Web3Provider>
          <Navbar />
          <Sidebar />
          <main
            className="min-h-screen overflow-x-hidden"
            style={{ paddingTop: "5rem", marginLeft: 0 }}
          >
            <style>{`@media (min-width:1024px){main{margin-left:16rem!important}}`}</style>
            {children}
          </main>
          <Footer />
          <Toasts />
        </Web3Provider>
      </body>
    </html>
  );
}

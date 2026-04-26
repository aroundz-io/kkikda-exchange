"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/stores/useStore";
import { useWalletSync } from "@/hooks/useWallet";
import { useT } from "@/lib/i18n/useT";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { labelKey: "nav.market", href: "/nft" },
  { labelKey: "nav.exchange", href: "/dex" },
  { labelKey: "nav.vault", href: "/rwa" },
  { labelKey: "nav.history", href: "/ledger" },
] as const;

export function Navbar() {
  useWalletSync();
  const t = useT();

  const pathname = usePathname();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 backdrop-blur-xl bg-surface/80 border-b border-outline-variant/10">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-headline tracking-tighter text-primary">
          KKIKDAGEO
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-headline tracking-widest uppercase text-[10px] transition-colors ${
                  active
                    ? "text-primary border-b-[0.5px] border-primary pb-1"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          className="hidden sm:block font-label text-[10px] uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          {lang === "ko" ? "KO/EN" : "EN/KO"}
        </button>

        <button
          onClick={toggleSidebar}
          className="md:hidden text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Lang } from "@/stores/useStore";
import { t } from "@/lib/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ko", label: "KO" },
  { code: "zh", label: "ZH" },
  { code: "ja", label: "JA" },
  { code: "es", label: "ES" },
];

const NAV_ITEMS = [
  { label: "MARKET", href: "/nft" },
  { label: "EXCHANGE", href: "/dex" },
  { label: "VAULT", href: "/rwa" },
  { label: "HISTORY", href: "/dashboard" },
];

export default function Navbar() {
  const { lang, setLang, user, connectWallet, disconnectWallet, siteConfig } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Cycle language between KO and EN for the toggle shortcut
  const currentLangLabel = lang === "ko" ? "KO" : "EN";
  const alternateLangLabel = lang === "ko" ? "EN" : "KO";

  return (
    <>
      {/* Announcement bar */}
      <AnimatePresence>
        {siteConfig.announcementEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-primary/[0.08] border-b border-primary/10"
          >
            <div className="text-center py-2 px-4">
              <p className="text-primary text-[11px] font-mono tracking-wide">
                {siteConfig.announcement}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-surface/90 backdrop-blur-xl border-b border-outline-ghost shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[56px]">
            {/* Logo — gold serif text only */}
            <Link href="/" className="shrink-0">
              <span className="text-serif text-[18px] font-bold text-primary tracking-wider">
                KKIKDAGEO
              </span>
            </Link>

            {/* Desktop Nav Links — centered */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-[11px] font-mono tracking-[0.15em] uppercase transition-colors ${
                      active
                        ? "text-primary"
                        : "text-on-surface-dim hover:text-on-surface"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-[1px] bg-primary"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className={`px-4 py-2 text-[11px] font-mono tracking-[0.15em] uppercase transition-colors ${
                    pathname.startsWith("/admin")
                      ? "text-accent"
                      : "text-on-surface-dim hover:text-accent"
                  }`}
                >
                  {t("nav.admin", lang)}
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language toggle / selector */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-0.5 px-2 py-1.5 text-[11px] font-mono tracking-[0.12em] text-on-surface-mid hover:text-on-surface transition-colors uppercase"
                >
                  <span className="text-on-surface">{currentLangLabel}</span>
                  <span className="text-on-surface-dim">/</span>
                  <span className="text-on-surface-dim">{alternateLangLabel}</span>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 bg-surface-low/95 backdrop-blur-xl border border-outline-ghost p-1 min-w-[90px] z-50"
                    >
                      {LANGS.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setLangOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-[11px] font-mono tracking-[0.1em] transition-colors ${
                            lang === l.code
                              ? "text-primary bg-primary/10"
                              : "text-on-surface-mid hover:text-on-surface hover:bg-surface-mid"
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wallet Button */}
              {user.address ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-ghost">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] font-mono tracking-[0.08em] text-on-surface-mid">
                      {user.address}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="px-3 py-1.5 text-[11px] font-mono tracking-[0.1em] uppercase text-on-surface-dim hover:text-error transition-colors"
                  >
                    {t("nav.disconnect", lang)}
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="hidden sm:block px-5 py-2 text-[11px] font-mono tracking-[0.15em] uppercase border border-primary text-primary hover:bg-primary/10 transition-colors"
                >
                  CONNECT WALLET
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-on-surface-mid hover:text-on-surface transition-colors"
                aria-label="Menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {mobileOpen ? (
                    <path d="M6 6l12 12M6 18L18 6" />
                  ) : (
                    <>
                      <path d="M4 7h16" />
                      <path d="M4 12h12" />
                      <path d="M4 17h8" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-surface-low/95 backdrop-blur-xl border-t border-outline-ghost"
            >
              <div className="px-6 py-6 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 text-[13px] font-mono tracking-[0.15em] uppercase transition-colors ${
                        active
                          ? "text-primary bg-primary/5"
                          : "text-on-surface-dim hover:text-on-surface"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-[13px] font-mono tracking-[0.15em] uppercase text-accent"
                  >
                    {t("nav.admin", lang)}
                  </Link>
                )}
                {/* Mobile wallet */}
                <div className="pt-4 mt-4 border-t border-outline-ghost">
                  {user.address ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[11px] font-mono tracking-[0.08em] text-on-surface-mid">
                          {user.address}
                        </span>
                      </div>
                      <button
                        onClick={disconnectWallet}
                        className="block w-full text-left px-4 py-2 text-[12px] font-mono tracking-[0.1em] uppercase text-error"
                      >
                        {t("nav.disconnect", lang)}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={connectWallet}
                      className="w-full py-3 text-[12px] font-mono tracking-[0.15em] uppercase border border-primary text-primary hover:bg-primary/10 transition-colors"
                    >
                      CONNECT WALLET
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

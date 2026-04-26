"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useStore } from "@/stores/useStore";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useT } from "@/lib/i18n/useT";
import {
  FolderOpen,
  Package,
  Gavel,
  Settings,
  User,
  BadgeCheck,
  ShieldCheck,
  Coins,
  Boxes,
  Droplets,
  Receipt,
} from "lucide-react";

const NAV_ITEMS = [
  { labelKey: "sidebar.collections", href: "/nft", icon: FolderOpen },
  { labelKey: "sidebar.myKura", href: "/dashboard", icon: Package, requiresWallet: true },
  { labelKey: "sidebar.governance", href: "/staking", icon: Gavel },
] as const;

const ADMIN_NAV_ITEMS = [
  { labelKey: "sidebar.dashboard", href: "/admin", icon: Settings },
  { labelKey: "sidebar.tokens", href: "/admin/tokens", icon: Coins },
  { labelKey: "sidebar.nftInventory", href: "/admin/nft-manage", icon: Boxes },
  { labelKey: "sidebar.liquidity", href: "/admin/liquidity", icon: Droplets },
  { labelKey: "sidebar.orders", href: "/admin/orders", icon: Receipt },
] as const;

export function Sidebar() {
  const t = useT();
  const pathname = usePathname();
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const { isAdmin } = useIsAdmin();
  const { isConnected, address } = useAccount();
  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !("requiresWallet" in item && item.requiresWallet) || isConnected,
  );

  const sidebarContent = (
    <div className="flex flex-col h-full py-8">
      {/* User Profile — disconnected / collector / admin */}
      <div className="px-8 mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-10 h-10 border-[0.5px] flex items-center justify-center ${
              isConnected
                ? "bg-surface-container-highest border-outline-variant"
                : "bg-surface-container border-outline-variant/40"
            }`}
          >
            <User
              className={`w-5 h-5 ${
                isConnected ? "text-primary" : "text-outline"
              }`}
            />
          </div>
          <div className="min-w-0">
            <p
              className={`font-headline font-bold text-sm tracking-tight ${
                isConnected ? "text-primary" : "text-outline"
              }`}
            >
              {!isConnected
                ? t("sidebar.guest")
                : isAdmin
                  ? t("sidebar.kuraMaster")
                  : t("sidebar.collector")}
            </p>
            <p className="text-outline font-label text-[10px] uppercase tracking-widest flex items-center gap-1.5 truncate">
              {!isConnected ? (
                t("sidebar.guestPrompt")
              ) : isAdmin ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-secondary" />
                  <span className="truncate normal-case tracking-normal text-on-surface-variant">
                    {t("sidebar.admin")} · {shortAddr}
                  </span>
                </>
              ) : (
                <span className="truncate normal-case tracking-normal text-on-surface-variant">
                  {shortAddr}
                </span>
              )}
            </p>
          </div>
        </div>

        {!isConnected ? (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={() => {
                  openConnectModal();
                  setSidebarOpen(false);
                }}
                className="block w-full text-center bg-gradient-to-br from-primary to-on-primary-container text-on-primary py-3 px-4 font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                {t("sidebar.connectCta")}
              </button>
            )}
          </ConnectButton.Custom>
        ) : (
          <Link
            href={isAdmin ? "/admin/nft-manage" : "/dex"}
            onClick={() => setSidebarOpen(false)}
            className="block w-full text-center bg-gradient-to-br from-primary to-on-primary-container text-on-primary py-3 px-4 font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            {isAdmin ? t("sidebar.newMint") : t("sidebar.quickTrade")}
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {visibleNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-8 py-4 font-label text-xs tracking-tighter uppercase transition-all duration-200 ${
                active
                  ? "bg-surface-container-low text-primary font-bold border-l-2 border-primary"
                  : "text-outline hover:bg-surface-container-low/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {t(item.labelKey)}
            </Link>
          );
        })}

        {/* Admin-only section */}
        {isAdmin && (
          <div className="pt-6 mt-6 border-t-[0.5px] border-outline-variant/30">
            <p className="px-8 mb-2 font-label text-[9px] uppercase tracking-[0.2em] text-secondary flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              {t("sidebar.adminPanel")}
            </p>
            {ADMIN_NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-8 py-3 font-label text-xs tracking-tighter uppercase transition-all duration-200 ${
                    active
                      ? "bg-surface-container-low text-primary font-bold border-l-2 border-primary"
                      : "text-outline hover:bg-surface-container-low/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* KYC / Status — only when connected (otherwise the badge would
          imply an identity that doesn't exist yet) */}
      {isConnected && (
        <div className="px-8 mt-auto">
          <div className="p-4 bg-surface-container-low border-b-[0.5px] border-outline-variant/30">
            <p className="text-[10px] font-label text-outline uppercase mb-2">
              {isAdmin ? t("sidebar.adminStatus") : t("sidebar.kycStatus")}
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  isAdmin ? "text-primary" : "text-secondary"
                }`}
              >
                {isAdmin ? t("sidebar.authorized") : t("sidebar.tier2")}
              </span>
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-primary" />
              ) : (
                <BadgeCheck className="w-4 h-4 text-secondary fill-secondary" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-surface border-r-0 z-40 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed left-0 top-20 bottom-0 w-64 z-50 bg-surface overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

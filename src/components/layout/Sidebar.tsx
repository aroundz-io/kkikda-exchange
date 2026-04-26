"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useStore } from "@/stores/useStore";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useT } from "@/lib/i18n/useT";
import { useTokenBalance } from "@/hooks/useTokenContract";
import { useNFTBalance } from "@/hooks/useNFTContract";
import { USDT_ADDRESS, KKDA_ADDRESS } from "@/hooks/useSwap";
import type { Address } from "viem";
import {
  Package,
  Send,
  Settings,
  User,
  BadgeCheck,
  ShieldCheck,
  Coins,
  Boxes,
  Droplets,
  Receipt,
} from "lucide-react";

// Personal shortcuts — only visible when wallet connected
const PERSONAL_SHORTCUTS = [
  { labelKey: "sidebar.myActivity", href: "/dashboard", icon: Package },
  { labelKey: "sidebar.myRedemptions", href: "/rwa", icon: Send },
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

  // Live wallet holdings (only when connected)
  const { balance: usdtBalance } = useTokenBalance(USDT_ADDRESS, address);
  const { balance: kkdaBalance } = useTokenBalance(KKDA_ADDRESS, address);
  const { balance: nftBalance } = useNFTBalance(address as Address | undefined);

  const usdt = usdtBalance ? Number(formatUnits(usdtBalance, 18)) : 0;
  const kkda = kkdaBalance ? Number(formatUnits(kkdaBalance, 18)) : 0;
  const nfts = nftBalance ? Number(nftBalance) : 0;

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(2)}M`
      : n >= 1_000
        ? `${(n / 1_000).toFixed(1)}K`
        : n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const sidebarContent = (
    <div className="flex flex-col h-full py-8">
      {/* User Profile — disconnected / collector / admin */}
      <div className="px-8 mb-10">
        <ConnectButton.Custom>
          {({ openConnectModal, openAccountModal }) => (
            <>
              <button
                onClick={() => {
                  if (isConnected) openAccountModal();
                  else openConnectModal();
                }}
                title={isConnected ? "Manage wallet" : "Connect wallet"}
                className="flex items-center gap-4 mb-6 w-full text-left hover:opacity-80 transition-opacity"
              >
                <div
                  className={`w-10 h-10 border-[0.5px] flex items-center justify-center shrink-0 ${
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
                <div className="min-w-0 flex-1">
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
                  {!isConnected ? (
                    /* Multi-line wrap — sentence-style prompt, no truncate.
                       break-keep keeps Korean word boundaries intact. */
                    <p className="text-outline font-body text-[11px] leading-snug mt-0.5 break-keep">
                      {t("sidebar.guestPrompt")}
                    </p>
                  ) : (
                    <p className="font-label text-[10px] flex items-center gap-1.5 truncate text-on-surface-variant">
                      {isAdmin && (
                        <ShieldCheck className="w-3 h-3 text-secondary shrink-0" />
                      )}
                      <span className="truncate">
                        {isAdmin ? `${t("sidebar.admin")} · ${shortAddr}` : shortAddr}
                      </span>
                    </p>
                  )}
                </div>
              </button>

              {!isConnected ? (
                <button
                  onClick={() => {
                    openConnectModal();
                    setSidebarOpen(false);
                  }}
                  className="block w-full text-center bg-gradient-to-br from-primary to-on-primary-container text-on-primary py-3 px-4 font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  {t("sidebar.connectCta")}
                </button>
              ) : (
                <Link
                  href={isAdmin ? "/admin/nft-manage" : "/dex"}
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full text-center bg-gradient-to-br from-primary to-on-primary-container text-on-primary py-3 px-4 font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  {isAdmin ? t("sidebar.newMint") : t("sidebar.quickTrade")}
                </Link>
              )}
            </>
          )}
        </ConnectButton.Custom>
      </div>

      {/* Personal Dashboard — only when connected */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {isConnected && (
          <>
            {/* Holdings card */}
            <div className="px-8 mb-6">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-outline mb-3">
                {t("sidebar.holdings")}
              </p>
              <div className="bg-surface-container-low border-[0.5px] border-outline-variant divide-y divide-outline-variant/30">
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {t("sidebar.holdingsUsdt")}
                  </span>
                  <span className="font-label text-xs text-on-surface">
                    {fmt(usdt)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {t("sidebar.holdingsKkda")}
                  </span>
                  <span className="font-label text-xs text-on-surface">
                    {fmt(kkda)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {t("sidebar.holdingsNfts")}
                  </span>
                  <span className="font-label text-xs text-on-surface">
                    {nfts.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal shortcuts */}
            <p className="px-8 mb-2 font-label text-[9px] uppercase tracking-[0.2em] text-outline">
              {t("sidebar.shortcuts")}
            </p>
            {PERSONAL_SHORTCUTS.map((item) => {
              const active = pathname === item.href;
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
          </>
        )}

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

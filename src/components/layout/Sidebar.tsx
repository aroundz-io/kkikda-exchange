"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import {
  FolderOpen,
  Package,
  Gavel,
  Settings,
  User,
  BadgeCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Collections", href: "/nft", icon: FolderOpen },
  { label: "My Kura", href: "/dashboard", icon: Package },
  { label: "Governance", href: "/staking", icon: Gavel },
  { label: "Settings", href: "/admin", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full py-8">
      {/* User Profile */}
      <div className="px-8 mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-surface-container-highest border-[0.5px] border-outline-variant flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-primary font-headline font-bold text-sm tracking-tight">
              Kura Master
            </p>
            <p className="text-outline font-label text-[10px] uppercase tracking-widest">
              Vintage Curator
            </p>
          </div>
        </div>
        <Link
          href="/dex"
          onClick={() => setSidebarOpen(false)}
          className="block w-full text-center bg-gradient-to-br from-primary to-on-primary-container text-on-primary py-3 px-4 font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          New Mint
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
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
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* KYC Status */}
      <div className="px-8 mt-auto">
        <div className="p-4 bg-surface-container-low border-b-[0.5px] border-outline-variant/30">
          <p className="text-[10px] font-label text-outline uppercase mb-2">
            KYC Status
          </p>
          <div className="flex items-center justify-between">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest">
              Tier 2 Verified
            </span>
            <BadgeCheck className="w-4 h-4 text-secondary fill-secondary" />
          </div>
        </div>
      </div>
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

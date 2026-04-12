"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import { t } from "@/lib/i18n";

const ADMIN_NAV = [
  { key: "admin.site", href: "/admin", icon: "⚙" },
  { key: "admin.tokens", href: "/admin/tokens", icon: "◆" },
  { key: "admin.nfts", href: "/admin/nft-manage", icon: "◇" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, user } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !user.isAdmin) {
      router.push("/");
    }
  }, [hydrated, user.isAdmin, router]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-serif text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-on-surface-dim text-sm">
            Admin privileges required. Please connect your admin wallet.
          </p>
          <button
            onClick={() => useStore.getState().connectWallet()}
            className="btn-gold px-6 py-2 text-xs mt-4"
          >
            {t("nav.connect", lang)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-56 bg-surface-low border-r border-outline-ghost shrink-0 hidden md:block">
        <div className="p-4 border-b border-outline-ghost">
          <h2 className="text-serif text-sm font-bold text-primary">
            {t("admin.title", lang)}
          </h2>
          <p className="text-[10px] font-mono text-on-surface-dim mt-1">
            {user.address}
          </p>
        </div>
        <nav className="p-2 space-y-1">
          {ADMIN_NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-mono transition-colors ${
                  active
                    ? "text-primary bg-primary-dim"
                    : "text-on-surface-mid hover:text-on-surface hover:bg-surface-mid"
                }`}
              >
                <span>{item.icon}</span>
                {t(item.key, lang)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-low/95 backdrop-blur-xl border-t border-outline-ghost z-40 flex">
        {ADMIN_NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-3 text-center text-xs font-mono ${
                active ? "text-primary" : "text-on-surface-dim"
              }`}
            >
              <div className="text-lg">{item.icon}</div>
              <div className="mt-0.5 text-[10px]">{t(item.key, lang).split(" ")[0]}</div>
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 pb-20 md:pb-8">{children}</div>
    </div>
  );
}

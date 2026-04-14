"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useStore } from "@/stores/useStore";
import { useWalletSync } from "@/hooks/useWallet";

const NAV_LINKS = [
  { label: "Market", href: "/nft" },
  { label: "Exchange", href: "/dex" },
  { label: "Vault", href: "/rwa" },
  { label: "History", href: "/dashboard" },
] as const;

export function Navbar() {
  useWalletSync();

  const pathname = usePathname();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-50 glass-panel border-b border-[0.5px] border-outline-variant flex items-center px-6">
      {/* Left: Brand */}
      <Link
        href="/"
        className="font-headline text-primary font-bold text-lg tracking-wider shrink-0"
      >
        KKIKDAGEO
      </Link>

      {/* Center: Desktop nav links */}
      <nav className="hidden lg:flex items-center gap-8 mx-auto">
        {NAV_LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label text-[10px] tracking-[0.15em] uppercase transition-colors ${
                active
                  ? "text-primary border-b border-primary pb-0.5"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Controls */}
      <div className="flex items-center gap-4 ml-auto lg:ml-0 shrink-0">
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          className="font-label text-[10px] tracking-[0.15em] uppercase text-outline hover:text-on-surface transition-colors"
        >
          {lang === "ko" ? "EN" : "KO"}
        </button>

        {/* Bell icon */}
        <button className="text-outline hover:text-on-surface transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Wallet connect */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none" as const,
                    userSelect: "none" as const,
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="border border-primary text-primary font-label text-[10px] tracking-[0.15em] px-5 py-2.5 uppercase hover:bg-primary/10 transition-colors"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        className="border border-error text-error font-label text-[10px] tracking-[0.15em] px-5 py-2.5 uppercase"
                      >
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={openChainModal}
                        className="flex items-center gap-1.5"
                      >
                        {chain.hasIcon && (
                          <div
                            className="w-5 h-5 overflow-hidden"
                            style={{ background: chain.iconBackground }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain"}
                                src={chain.iconUrl}
                                className="w-5 h-5"
                              />
                            )}
                          </div>
                        )}
                      </button>

                      <button
                        onClick={openAccountModal}
                        className="font-label text-[10px] tracking-[0.15em] text-on-surface hover:text-primary transition-colors"
                      >
                        {account.displayBalance && (
                          <span className="text-outline mr-2">
                            {account.displayBalance}
                          </span>
                        )}
                        {account.displayName}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>

        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-outline hover:text-on-surface transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

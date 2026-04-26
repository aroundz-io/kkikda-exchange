"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Lock, ShieldOff, Loader2 } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useT } from "@/lib/i18n/useT";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps a route's content and only renders it for wallets that hold
 * DEFAULT_ADMIN_ROLE on the KKIKDA_NFT contract. Other states render
 * a friendly access-control screen.
 */
export function AdminGuard({ children }: Props) {
  const t = useT();
  const { isAdmin, isLoading, isConnected, address } = useIsAdmin();

  // 1. Not connected
  if (!isConnected) {
    return (
      <div className="page-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-surface-container-low border-[0.5px] border-outline-variant p-10 space-y-6 text-center"
        >
          <Lock className="w-12 h-12 text-primary mx-auto" strokeWidth={1.5} />
          <div className="space-y-2">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary">
              {t("guard.restricted")}
            </p>
            <h1 className="font-headline text-3xl text-on-surface">
              {t("guard.adminOnly")}
            </h1>
            <p className="font-body text-sm text-on-surface-variant max-w-sm mx-auto">
              {t("guard.adminPitch")}
            </p>
          </div>
          <div className="flex justify-center">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="btn-gradient"
                >
                  {t("common.connectWallet")}
                </button>
              )}
            </ConnectButton.Custom>
          </div>
          <Link
            href="/"
            className="inline-block font-label text-[10px] uppercase tracking-[0.2em] text-outline hover:text-primary transition-colors"
          >
            ← {t("common.back")}
          </Link>
        </motion.div>
      </div>
    );
  }

  // 2. Connected but role is being verified
  if (isLoading) {
    return (
      <div className="page-padding">
        <div className="max-w-xl mx-auto bg-surface-container-low border-[0.5px] border-outline-variant p-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
            {t("guard.verifying")}
          </p>
        </div>
      </div>
    );
  }

  // 3. Connected but not admin
  if (!isAdmin) {
    return (
      <div className="page-padding">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-surface-container-low border-[0.5px] border-error/40 p-10 space-y-6 text-center"
        >
          <ShieldOff className="w-12 h-12 text-error mx-auto" strokeWidth={1.5} />
          <div className="space-y-2">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-error">
              {t("guard.denied")}
            </p>
            <h1 className="font-headline text-3xl text-on-surface">
              {t("guard.insufficient")}
            </h1>
            <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
              {t("guard.notAdminMsg")}
            </p>
          </div>

          <div className="bg-surface-container-high border-[0.5px] border-outline-variant px-4 py-3 mx-auto max-w-md text-left space-y-1">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-outline">
              {t("guard.connected")}
            </p>
            <p className="font-label text-xs text-on-surface break-all">
              {address}
            </p>
          </div>

          <Link
            href="/"
            className="inline-block font-label text-[10px] uppercase tracking-[0.2em] text-primary hover:opacity-80 transition-opacity border-[0.5px] border-primary px-6 py-2.5"
          >
            ← {t("common.back")}
          </Link>
        </motion.div>
      </div>
    );
  }

  // 4. Admin — render children
  return <>{children}</>;
}

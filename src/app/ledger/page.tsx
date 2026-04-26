"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { useT } from "@/lib/i18n/useT";
import { ExternalLink, ShoppingCart, Sparkles, Boxes, Flame } from "lucide-react";
import { findPickupPoint } from "@/lib/pickupPoints";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

type Tab = "all" | "purchase" | "mint" | "redemption";

interface LedgerEntry {
  id: string;
  ts: number;
  kind: "purchase" | "mint" | "redemption";
  title: string;
  detail: string;
  valueLabel: string;
  actor: string;
  txHash?: string;
  statusLabel?: string;
  statusTone?: "primary" | "secondary" | "error" | "outline";
}

function fmtUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function shortAddr(a: string) {
  if (!a || a.length < 10) return a;
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function bscscanTxUrl(hash: string) {
  return `https://testnet.bscscan.com/tx/${hash}`;
}

export default function LedgerPage() {
  const t = useT();
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const mintRecords = useStore((s) => s.mintRecords);
  const redemptionRequests = useStore((s) => s.redemptionRequests);
  const teaCakes = useStore((s) => s.teaCakes);
  const [tab, setTab] = useState<Tab>("all");

  // Aggregate stats
  const totalSold = purchaseOrders.reduce((s, p) => s + p.totalUsdt, 0);
  const totalMinted = teaCakes.reduce(
    (s, c) => s + (c.mintedUnits ?? 0),
    0,
  );
  const activeRedemptions = redemptionRequests.filter(
    (r) => r.status !== "burned" && r.status !== "cancelled",
  ).length;
  const burnedNfts = redemptionRequests.filter((r) => r.status === "burned").length;

  // Build a unified, time-ordered ledger
  const entries = useMemo<LedgerEntry[]>(() => {
    const out: LedgerEntry[] = [];

    for (const p of purchaseOrders) {
      out.push({
        id: p.id,
        ts: p.timestamp,
        kind: "purchase",
        title: p.cakeName,
        detail: `${p.quantity} × ${p.pricePerUnit.toLocaleString()} USDT`,
        valueLabel: `${p.totalUsdt.toLocaleString()} USDT`,
        actor: p.buyer,
        txHash: p.txHash,
        statusLabel:
          p.status === "delivered"
            ? "Delivered"
            : p.status === "refunded"
              ? "Refunded"
              : "Paid",
        statusTone: p.status === "delivered" ? "secondary" : p.status === "refunded" ? "error" : "primary",
      });
    }

    for (const m of mintRecords) {
      out.push({
        id: m.id,
        ts: m.timestamp,
        kind: "mint",
        title: m.assetName,
        detail: `Token #${m.tokenId}`,
        valueLabel: `${m.value.toLocaleString()} USDT`,
        actor: "0xKKIKDAGEO_VAULT",
        txHash: m.txHash,
        statusLabel: m.status === "confirmed" ? "Confirmed" : m.status === "processing" ? "Processing" : "Failed",
        statusTone:
          m.status === "confirmed"
            ? "secondary"
            : m.status === "processing"
              ? "primary"
              : "error",
      });
    }

    for (const r of redemptionRequests) {
      const point = findPickupPoint(r.pickupPointId);
      out.push({
        id: r.id,
        ts: r.timestamp,
        kind: "redemption",
        title: r.cakeName,
        detail: `${r.tokenIds.length} unit${r.tokenIds.length > 1 ? "s" : ""} · ${point?.name ?? "—"}`,
        valueLabel: `#${r.tokenIds.join(", #")}`,
        actor: r.owner,
        txHash: r.burnTxHash || r.freezeTxHash,
        statusLabel:
          r.status === "submitted"
            ? "Submitted"
            : r.status === "frozen"
              ? "Frozen"
              : r.status === "ready_for_pickup"
                ? "Ready"
                : r.status === "picked_up"
                  ? "Picked Up"
                  : r.status === "burned"
                    ? "Burned"
                    : "Cancelled",
        statusTone:
          r.status === "burned"
            ? "secondary"
            : r.status === "cancelled"
              ? "error"
              : "primary",
      });
    }

    return out.sort((a, b) => b.ts - a.ts);
  }, [purchaseOrders, mintRecords, redemptionRequests]);

  const filtered = useMemo(
    () => (tab === "all" ? entries : entries.filter((e) => e.kind === tab)),
    [entries, tab],
  );

  const tabs: { value: Tab; labelKey: string; count: number; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { value: "all", labelKey: "ledger.tabAll", count: entries.length, icon: Boxes },
    { value: "purchase", labelKey: "ledger.tabPurchases", count: purchaseOrders.length, icon: ShoppingCart },
    { value: "mint", labelKey: "ledger.tabMints", count: mintRecords.length, icon: Sparkles },
    { value: "redemption", labelKey: "ledger.tabRedemptions", count: redemptionRequests.length, icon: Flame },
  ];

  return (
    <div className="page-padding space-y-10">
      {/* Header */}
      <motion.header
        className="space-y-3 border-b-[0.5px] border-outline-variant pb-6"
        {...fade}
      >
        <h1 className="font-headline text-4xl text-on-surface tracking-tight">
          {t("ledger.title")}
        </h1>
        <p className="font-body text-outline max-w-3xl leading-relaxed">
          {t("ledger.subtitle")}
        </p>
      </motion.header>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        {...fade}
        transition={{ delay: 0.05 }}
      >
        <Stat
          icon={<ShoppingCart className="w-5 h-5" />}
          label={t("ledger.totalRevenue")}
          value={fmtUsd(totalSold)}
          tone="primary"
        />
        <Stat
          icon={<Sparkles className="w-5 h-5" />}
          label={t("ledger.totalMinted")}
          value={totalMinted.toLocaleString()}
          tone="secondary"
        />
        <Stat
          icon={<Boxes className="w-5 h-5" />}
          label={t("ledger.totalRedeemed")}
          value={activeRedemptions.toString()}
          tone="primary"
        />
        <Stat
          icon={<Flame className="w-5 h-5" />}
          label={t("ledger.totalBurned")}
          value={burnedNfts.toString()}
          tone="secondary"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div className="flex flex-wrap gap-2" {...fade} transition={{ delay: 0.1 }}>
        {tabs.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.value;
          return (
            <button
              key={tb.value}
              onClick={() => setTab(tb.value)}
              className={`px-4 py-2 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] inline-flex items-center gap-2 transition-colors ${
                active
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-outline hover:text-on-surface hover:border-outline"
              }`}
            >
              <Icon size={12} className="opacity-80" />
              {t(tb.labelKey as Parameters<typeof t>[0])}
              <span className="opacity-70">({tb.count})</span>
            </button>
          );
        })}
      </motion.div>

      {/* Ledger Table */}
      <motion.section {...fade} transition={{ delay: 0.15 }}>
        {filtered.length === 0 ? (
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-12 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              {t("ledger.empty")}
            </p>
            <Link
              href="/nft"
              className="inline-block mt-4 font-label text-[10px] uppercase tracking-[0.15em] text-primary border-[0.5px] border-primary px-4 py-2 hover:bg-primary/10"
            >
              Browse marketplace →
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-outline-variant/30 font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  <th className="px-4 py-3 text-left">{t("ledger.col.time")}</th>
                  <th className="px-4 py-3 text-left">{t("ledger.col.type")}</th>
                  <th className="px-4 py-3 text-left">{t("ledger.col.detail")}</th>
                  <th className="px-4 py-3 text-right">{t("ledger.col.value")}</th>
                  <th className="px-4 py-3 text-left">{t("ledger.col.actor")}</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">{t("ledger.col.tx")}</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body divide-y divide-outline-variant/15">
                {filtered.map((e) => (
                  <tr
                    key={`${e.kind}-${e.id}`}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap font-label text-xs">
                      {new Date(e.ts).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <TypePill kind={e.kind} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-on-surface truncate max-w-xs">{e.title}</p>
                      <p className="font-label text-[10px] uppercase tracking-tighter text-outline">
                        {e.detail}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-primary font-label whitespace-nowrap">
                      {e.valueLabel}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://testnet.bscscan.com/address/${e.actor}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-xs text-on-surface hover:text-primary transition-colors"
                      >
                        {shortAddr(e.actor)}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {e.statusLabel && (
                        <span
                          className={`inline-block px-2 py-0.5 font-label text-[9px] uppercase tracking-[0.15em] border-[0.5px] ${
                            e.statusTone === "secondary"
                              ? "text-secondary border-secondary/40 bg-secondary/10"
                              : e.statusTone === "error"
                                ? "text-error border-error/40 bg-error/10"
                                : "text-primary border-primary/40 bg-primary/10"
                          }`}
                        >
                          {e.statusLabel}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {e.txHash ? (
                        <a
                          href={bscscanTxUrl(e.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-label text-[10px] uppercase tracking-[0.15em] text-outline hover:text-primary"
                        >
                          {e.txHash.slice(0, 8)}…
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="font-label text-[10px] text-outline">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </div>
  );
}

/* ───────────── Helpers ───────────── */
function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "secondary";
}) {
  return (
    <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-5 relative overflow-hidden">
      <div
        className={`absolute top-3 right-3 ${tone === "primary" ? "text-primary/20" : "text-secondary/20"}`}
      >
        {icon}
      </div>
      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-2">
        {label}
      </p>
      <p
        className={`font-headline text-2xl ${tone === "primary" ? "text-primary" : "text-secondary"}`}
      >
        {value}
      </p>
    </div>
  );
}

function TypePill({ kind }: { kind: "purchase" | "mint" | "redemption" }) {
  const t = useT();
  const map = {
    purchase: { label: t("ledger.type.purchase"), tone: "primary" },
    mint: { label: t("ledger.type.mint"), tone: "secondary" },
    redemption: { label: t("ledger.type.redemption"), tone: "outline" },
  } as const;
  const cfg = map[kind];
  return (
    <span
      className={`inline-block px-2 py-0.5 font-label text-[9px] uppercase tracking-[0.15em] border-[0.5px] whitespace-nowrap ${
        cfg.tone === "primary"
          ? "text-primary border-primary/40 bg-primary/10"
          : cfg.tone === "secondary"
            ? "text-secondary border-secondary/40 bg-secondary/10"
            : "text-outline border-outline/40 bg-outline/5"
      }`}
    >
      {cfg.label}
    </span>
  );
}

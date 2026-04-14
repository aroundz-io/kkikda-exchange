"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/stores/useStore";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function formatUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

/* SVG Icons */
function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M18 14l.7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14z" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" />
      <path d="M12 22c-2-2-4-3.5-4-6a4 4 0 018 0c0 2.5-2 4-4 6z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

export default function AdminPage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const mintRecords = useStore((s) => s.mintRecords);
  const tokens = useStore((s) => s.tokens);

  const totalMinted = teaCakes.length + mintRecords.length;
  const totalBurned = 2; // placeholder
  const totalAssetsValue = teaCakes.reduce((s, t) => s + t.priceUsd, 0);

  const metrics = [
    {
      icon: <SparklesIcon />,
      label: "Total Minted",
      value: totalMinted,
      color: "text-primary",
      progress: 68,
    },
    {
      icon: <FlameIcon />,
      label: "Total Burned",
      value: totalBurned,
      color: "text-error",
      progress: 12,
    },
    {
      icon: <BoxIcon />,
      label: "Total Assets",
      value: formatUsd(totalAssetsValue),
      color: "text-secondary",
      progress: 85,
    },
  ];

  const fees = [
    { label: "Platform Fee", value: "2.5%" },
    { label: "Royalty", value: "5.0%" },
    { label: "Min Trade", value: "0.01 BNB" },
  ];

  return (
    <div className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-10">
      {/* ── Header ── */}
      <motion.header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        {...fade}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="font-headline text-4xl text-on-surface">
            Executive Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-secondary animate-pulse" />
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-secondary">
            Network Status: Synchronized
          </span>
        </div>
      </motion.header>

      {/* ── Metric Cards ── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
            {...fade}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
          >
            <div className="flex items-center justify-between">
              <span className={`${m.color}`}>{m.icon}</span>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                {m.label}
              </p>
            </div>
            <p className={`font-headline text-3xl ${m.color}`}>
              {m.value}
            </p>
            <div className="h-1 bg-surface-container-high overflow-hidden">
              <motion.div
                className={`h-full ${
                  m.color === "text-primary"
                    ? "bg-primary"
                    : m.color === "text-error"
                      ? "bg-error"
                      : "bg-secondary"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${m.progress}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Protocol Fees + Mint History ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Protocol Fees */}
        <motion.div
          className="col-span-12 lg:col-span-4 bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
          {...fade}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            Protocol Fees
          </p>
          <div className="space-y-3">
            {fees.map((fee) => (
              <div key={fee.label} className="space-y-1">
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {fee.label}
                </p>
                <div className="bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2">
                  <span className="font-body text-sm text-on-surface">
                    {fee.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Mint History */}
        <motion.div
          className="col-span-12 lg:col-span-8 bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
          {...fade}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            Recent Mint History
          </p>

          {mintRecords.length === 0 ? (
            <p className="font-body text-xs text-outline py-8 text-center">
              No mint records yet. Mint your first asset from the NFT management page.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-[0.5px] border-outline-variant">
                    {["Asset", "Token ID", "Tx Hash", "Status", "Time", "Value"].map(
                      (col) => (
                        <th
                          key={col}
                          className="font-label text-[10px] uppercase tracking-[0.15em] text-outline pb-3 pr-4"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mintRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b-[0.5px] border-outline-variant/30"
                    >
                      <td className="font-body text-xs text-on-surface py-3 pr-4">
                        {record.assetName}
                      </td>
                      <td className="font-body text-xs text-on-surface-variant py-3 pr-4">
                        #{record.tokenId}
                      </td>
                      <td className="font-label text-[10px] text-outline py-3 pr-4">
                        {record.txHash.slice(0, 10)}...
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`font-label text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border-[0.5px] ${
                            record.status === "confirmed"
                              ? "text-secondary border-secondary/40"
                              : record.status === "processing"
                                ? "text-primary border-primary/40"
                                : "text-error border-error/40"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="font-body text-xs text-on-surface-variant py-3 pr-4">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </td>
                      <td className="font-headline text-xs text-on-surface py-3">
                        {formatUsd(record.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Navigation Links ── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        {...fade}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Link
          href="/admin/tokens"
          className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 flex items-center justify-between group hover:border-primary/50 transition-colors"
        >
          <div>
            <p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">
              Token Management
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Create, pause, and manage token supply
            </p>
          </div>
          <span className="text-outline group-hover:text-primary transition-colors">
            &rarr;
          </span>
        </Link>
        <Link
          href="/admin/nft-manage"
          className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 flex items-center justify-between group hover:border-primary/50 transition-colors"
        >
          <div>
            <p className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">
              NFT / Asset Management
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Manage tokenized tea cake inventory
            </p>
          </div>
          <span className="text-outline group-hover:text-primary transition-colors">
            &rarr;
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

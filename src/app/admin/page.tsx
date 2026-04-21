"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { Sparkles, Flame, Box, Grid, List } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ---------- Metric Card ---------- */
function MetricCard({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  progress,
  colorClass = "bg-primary",
}: {
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
  icon: LucideIcon;
  progress: number;
  colorClass?: string;
}) {
  const textColor = colorClass.replace("bg-", "text-");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-low p-8 relative overflow-hidden group border border-outline-variant/5"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={64} className={textColor} />
      </div>
      <div className="relative z-10">
        <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-2">
          {label}
        </p>
        <h3 className="text-4xl font-headline font-bold text-on-surface">
          {value}
          {subValue && (
            <span className="text-lg font-body font-normal text-outline ml-2">
              {subValue}
            </span>
          )}
        </h3>
        {trend ? (
          <p className="text-secondary text-xs mt-4 font-label">
            {trend} <span className="text-outline ml-1">THIS MONTH</span>
          </p>
        ) : (
          <p className="text-outline text-xs mt-4 font-label uppercase tracking-tighter">
            System Status: Optimal
          </p>
        )}
      </div>
      <div className="mt-8 h-1 w-full bg-surface-container-highest">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClass}`}
        />
      </div>
    </motion.div>
  );
}

/* ---------- Fee Config ---------- */
function FeeConfig() {
  const fees = [
    { label: "NFT Minting Fee", value: "2.50", unit: "%" },
    { label: "Liquidity Swap Fee", value: "0.05", unit: "%" },
    { label: "Redemption (Burn) Fee", value: "150.00", unit: "USD" },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-headline font-bold border-l-4 border-primary pl-4 uppercase tracking-widest">
        Protocol Fees
      </h2>
      <div className="bg-surface-container-high p-8 space-y-8 border border-outline-variant/5">
        {fees.map((fee) => (
          <div key={fee.label} className="space-y-4">
            <label className="block font-label text-xs text-outline uppercase">
              {fee.label}
            </label>
            <div className="flex items-end justify-between border-b-[0.5px] border-outline-variant pb-2">
              <input
                className="bg-transparent border-none p-0 focus:ring-0 text-2xl font-headline text-primary w-full outline-none"
                type="text"
                defaultValue={fee.value}
              />
              <span className="text-primary font-label text-lg ml-2">
                {fee.unit}
              </span>
            </div>
          </div>
        ))}
        <button className="w-full py-4 border-[0.5px] border-primary text-primary font-label text-xs uppercase tracking-[0.2em] hover:bg-primary/10 transition-colors">
          Update Configuration
        </button>
      </div>
    </section>
  );
}

/* ---------- Mint History ---------- */
function MintHistory() {
  const mintRecords = useStore((s) => s.mintRecords);

  const history = [
    {
      hash: "0x8a2...f3b1",
      name: "Da Hong Pao Special Reserve",
      vintage: "1992",
      quantity: "357g Cake",
      time: "14:02:45",
      status: "Confirmed",
    },
    {
      hash: "0x3c1...22e9",
      name: 'Menghai "7542" Raw Pu-erh',
      vintage: "2001",
      quantity: "7x Cakes",
      time: "12:30:11",
      status: "Confirmed",
    },
    {
      hash: "0xf55...910a",
      name: "Iron Monk Aged Oolong",
      vintage: "1985",
      quantity: "500g Loose",
      time: "09:15:00",
      status: "Processing",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-headline font-bold border-l-4 border-secondary pl-4 uppercase tracking-widest">
          Recent Mint History
        </h2>
        <button className="font-label text-[10px] text-outline uppercase hover:text-primary transition-colors">
          View Full Ledger &rarr;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low font-label text-[10px] text-outline uppercase tracking-widest">
              <th className="px-6 py-4 font-medium">Tx Hash</th>
              <th className="px-6 py-4 font-medium">Asset Name</th>
              <th className="px-6 py-4 font-medium">Token ID</th>
              <th className="px-6 py-4 font-medium">Value</th>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-body divide-y divide-outline-variant/10">
            {(mintRecords.length > 0
              ? mintRecords.map((r) => ({
                  hash: r.txHash.length > 12 ? `${r.txHash.slice(0, 5)}...${r.txHash.slice(-4)}` : r.txHash,
                  name: r.assetName,
                  tokenId: String(r.tokenId),
                  value: `$${r.value.toLocaleString()}`,
                  time: new Date(r.timestamp).toLocaleTimeString(),
                  status: r.status === "confirmed" ? "Confirmed" : r.status === "processing" ? "Processing" : "Failed",
                }))
              : history.map((h) => ({
                  hash: h.hash,
                  name: h.name,
                  tokenId: h.vintage,
                  value: h.quantity,
                  time: h.time,
                  status: h.status,
                }))
            ).map((item, i) => (
              <motion.tr
                key={item.hash + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:bg-surface-container-high transition-colors group"
              >
                <td className="px-6 py-6 font-label text-primary">
                  {item.hash}
                </td>
                <td className="px-6 py-6 font-semibold text-on-surface">
                  {item.name}
                </td>
                <td className="px-6 py-6 text-outline">{item.tokenId}</td>
                <td className="px-6 py-6 text-on-surface">{item.value}</td>
                <td className="px-6 py-6 text-outline">{item.time}</td>
                <td className="px-6 py-6">
                  <span
                    className={`px-2 py-1 text-[10px] font-label uppercase ${
                      item.status === "Confirmed"
                        ? "bg-secondary/10 text-secondary"
                        : item.status === "Processing"
                          ? "bg-tertiary/10 text-tertiary"
                          : "bg-error/10 text-error"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Inventory Grid ---------- */
function InventoryGrid() {
  const teaCakes = useStore((s) => s.teaCakes);

  return (
    <section className="space-y-8 pt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-headline font-bold text-on-surface">
          Tokenized Inventory
        </h2>
        <div className="flex space-x-2">
          <button className="p-2 border-[0.5px] border-outline-variant text-outline hover:text-primary transition-colors">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 border-[0.5px] border-outline-variant text-outline hover:text-primary transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {teaCakes.slice(0, 4).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest group relative border-b border-transparent hover:border-primary transition-all duration-500 cursor-pointer"
          >
            <div className="aspect-[4/5] bg-surface-container overflow-hidden flex items-center justify-center">
              <span className="text-outline/20 font-headline text-5xl">
                {item.vintage}
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-label text-[10px] text-primary uppercase tracking-[0.2em]">
                  Batch #HL-{item.vintage}-{String(item.tokenId).padStart(2, "0")}
                </span>
                <span className="font-label text-[10px] text-outline">
                  ID: {item.tokenId}
                </span>
              </div>
              <h4 className="text-lg font-headline font-bold leading-tight group-hover:text-primary transition-colors">
                {item.name}
              </h4>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <div className="space-y-1">
                  <p className="font-label text-[10px] text-outline uppercase">
                    Appraisal
                  </p>
                  <p className="font-headline font-bold text-secondary">
                    ${item.priceUsd.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="font-label text-[10px] text-outline uppercase">
                    Quality
                  </p>
                  <p className="font-headline font-bold text-on-surface">
                    {item.grade}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Main Admin Page ---------- */
export default function AdminPage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const tokens = useStore((s) => s.tokens);
  const mintRecords = useStore((s) => s.mintRecords);

  const totalMintedValue = teaCakes.reduce((s, t) => s + t.priceUsd, 0);
  const totalTokens = tokens.reduce((s, t) => s + t.supply, 0);

  return (
    <div className="page-padding space-y-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-[0.5px] border-outline-variant pb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-outline font-body mt-2">
            Overseeing the provenance and minting of vintage Pu&apos;er assets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 font-label text-xs"
        >
          <span className="text-outline">NETWORK STATUS:</span>
          <span className="flex items-center text-secondary">
            <span className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse" />
            SYNCHRONIZED
          </span>
        </motion.div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Minted Value"
          value={`$${totalMintedValue.toLocaleString()}`}
          trend="+12.4%"
          icon={Sparkles}
          progress={Math.min(100, Math.round((totalMintedValue / 10_000_000) * 100))}
          colorClass="bg-primary"
        />
        <MetricCard
          label="Assets Burned (Redeemed)"
          value={mintRecords.length > 0 ? mintRecords.length.toLocaleString() : "1,240"}
          subValue="Units"
          icon={Flame}
          progress={mintRecords.length > 0 ? Math.min(100, Math.round((mintRecords.length / 100) * 100)) : 22}
          colorClass="bg-error"
        />
        <MetricCard
          label="Active Ledger Tokens"
          value={totalTokens > 0 ? totalTokens.toLocaleString() : "3,581"}
          trend="STABLE"
          icon={Box}
          progress={100}
          colorClass="bg-secondary"
        />
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <FeeConfig />
        </div>
        <div className="lg:col-span-8">
          <MintHistory />
        </div>
      </div>

      {/* Inventory Section */}
      <InventoryGrid />

      {/* Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/tokens"
          className="bg-surface-container-low border border-outline-variant/5 p-6 flex items-center justify-between group hover:border-primary/50 transition-colors"
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
          className="bg-surface-container-low border border-outline-variant/5 p-6 flex items-center justify-between group hover:border-primary/50 transition-colors"
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
      </div>
    </div>
  );
}

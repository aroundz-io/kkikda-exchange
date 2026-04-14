"use client";

import { useStore } from "@/stores/useStore";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  Lock,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

type FilterTab = "all" | "tea" | "liquidity";

export default function HomePage() {
  const { user, teaCakes, tokens } = useStore();
  const [filter, setFilter] = useState<FilterTab>("all");

  const filteredAssets =
    filter === "tea"
      ? teaCakes
      : filter === "liquidity"
        ? []
        : teaCakes;

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <motion.div
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            Heritage Ledger
          </span>
          <h1 className="font-headline text-4xl lg:text-5xl text-on-surface mt-1">
            Portfolio Overview
          </h1>
        </div>

        <div className="bg-surface-low border-[0.5px] border-outline-variant p-5 min-w-[260px]">
          {user.address ? (
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                Wallet Balance
              </span>
              <p className="font-headline text-2xl text-on-surface mt-1">
                {user.balance.toFixed(4)}{" "}
                <span className="text-base text-outline">BNB</span>
              </p>
              <p className="text-sm text-on-surface-muted mt-0.5">
                ${user.balanceUsd.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-on-surface-muted font-body">
              Connect wallet to view portfolio
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* P&L */}
        <motion.div
          className="bg-surface-low border-[0.5px] border-outline-variant p-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-[10px] tracking-[0.15em] text-outline uppercase">
              Profit / Loss
            </span>
            <TrendingUp size={16} className="text-outline" />
          </div>
          <p className="font-headline text-2xl text-on-surface">
            ${user.pnl.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight
              size={14}
              className={
                user.pnlPercent >= 0 ? "text-secondary" : "text-error"
              }
            />
            <span
              className={`text-sm font-label ${
                user.pnlPercent >= 0 ? "text-secondary" : "text-error"
              }`}
            >
              {user.pnlPercent >= 0 ? "+" : ""}
              {user.pnlPercent}%
            </span>
          </div>
        </motion.div>

        {/* Staking */}
        <motion.div
          className="bg-surface-low border-[0.5px] border-outline-variant p-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-[10px] tracking-[0.15em] text-outline uppercase">
              Staked Value
            </span>
            <Lock size={16} className="text-outline" />
          </div>
          <p className="font-headline text-2xl text-on-surface">
            ${user.stakedValue.toLocaleString()}
          </p>
        </motion.div>

        {/* Security */}
        <motion.div
          className="bg-surface-low border-[0.5px] border-outline-variant p-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-[10px] tracking-[0.15em] text-outline uppercase">
              Security Score
            </span>
            <ShieldCheck size={16} className="text-outline" />
          </div>
          <p className="font-headline text-2xl text-on-surface">
            {user.securityScore}%
          </p>
          <div className="mt-3 h-1.5 w-full bg-surface-high">
            <motion.div
              className="h-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${user.securityScore}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Table (2/3) */}
        <motion.div
          className="lg:col-span-2"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary" />
              <h2 className="font-headline text-xl text-on-surface">
                Your Assets
              </h2>
            </div>

            <div className="flex gap-1">
              {(["all", "tea", "liquidity"] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`font-label text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 transition-colors ${
                    filter === tab
                      ? "text-primary border-[0.5px] border-primary"
                      : "text-outline hover:text-on-surface"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "tea"
                      ? "Tea Cakes"
                      : "Liquidity"}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-low border-[0.5px] border-outline-variant overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-ghost">
                  <th className="text-left font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4">
                    Asset Name
                  </th>
                  <th className="text-left font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4">
                    Vintage
                  </th>
                  <th className="text-left font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4">
                    Grade
                  </th>
                  <th className="text-right font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4">
                    Value (USD)
                  </th>
                  <th className="text-center font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((cake, i) => (
                  <motion.tr
                    key={cake.id}
                    className="border-b border-outline-ghost hover:bg-surface-mid transition-colors cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="p-4">
                      <p className="text-sm font-body text-on-surface">
                        {cake.name}
                      </p>
                      <p className="text-xs text-on-surface-muted mt-0.5 max-w-[260px] truncate">
                        {cake.subtitle}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-on-surface-dim font-label">
                      {cake.vintage}
                    </td>
                    <td className="p-4 text-sm text-on-surface-dim font-label">
                      {cake.grade}
                    </td>
                    <td className="p-4 text-sm text-on-surface text-right font-label">
                      ${cake.priceUsd.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block font-label text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 ${
                          cake.isListed
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-high text-outline"
                        }`}
                      >
                        {cake.isListed ? "Listed" : "Unlisted"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {filteredAssets.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-on-surface-muted text-sm"
                    >
                      No assets in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column: Provenance + Curator */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          {/* Provenance Timeline */}
          <div className="bg-surface-low border-[0.5px] border-outline-variant p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-primary" />
              <h3 className="font-headline text-lg text-on-surface">
                Recent Provenance
              </h3>
            </div>

            {teaCakes[0] && (
              <div className="relative pl-5">
                {/* Dashed vertical line */}
                <div className="absolute left-[3px] top-1 bottom-1 border-l border-dashed border-outline-variant" />

                <div className="space-y-5">
                  {teaCakes[0].provenance.map((p, i) => (
                    <motion.div
                      key={i}
                      className="relative"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {/* Square marker */}
                      <div className="absolute -left-5 top-1 w-2 h-2 bg-primary" />

                      <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                        {p.date}
                      </span>
                      <p className="text-sm text-on-surface mt-0.5 font-body">
                        {p.event}
                      </p>
                      <p className="text-xs text-on-surface-muted mt-0.5">
                        {p.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Curator's Insight */}
          <motion.div
            className="bg-surface-low border-[0.5px] border-outline-variant p-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={6}
          >
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              Curator&apos;s Insight
            </span>
            <p className="font-headline italic text-on-surface-dim mt-3 leading-relaxed">
              &ldquo;The 1988 Menghai Qing Bing represents the zenith of
              state-factory craftsmanship. Its dry-stored character has
              developed a camphor note that only deepens with each passing
              year &mdash; a living testament to patience as
              investment.&rdquo;
            </p>
            <p className="text-sm text-on-surface-muted mt-4 font-body">
              &mdash; Master Chen, Head Curator
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

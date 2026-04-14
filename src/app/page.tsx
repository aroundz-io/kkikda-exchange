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
          <h1 className="font-headline text-4xl text-on-surface mb-2">
            Portfolio Overview
          </h1>
          <p className="text-outline">
            Overview of your authenticated vintage assets
          </p>
        </div>

        <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-5 min-w-[260px]">
          {user.address ? (
            <div>
              <span className="font-label text-[10px] text-outline uppercase tracking-widest">
                Wallet Balance
              </span>
              <p className="font-label text-4xl text-primary font-bold mt-1">
                {user.balance.toFixed(4)}{" "}
                <span className="text-base text-outline">BNB</span>
              </p>
              <p className="text-sm text-outline mt-0.5">
                ${user.balanceUsd.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-outline font-body">
              Connect wallet to view portfolio
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* P&L */}
        <motion.div
          className="relative bg-surface-container-low border-[0.5px] border-outline-variant p-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <TrendingUp size={16} className="absolute top-8 right-8 text-outline/30" />
          <span className="font-label text-[10px] tracking-widest text-outline uppercase">
            Profit / Loss
          </span>
          <p className="font-label text-3xl font-bold text-secondary mt-3">
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
          <motion.div className="mt-4 h-1 bg-outline-variant/20">
            <motion.div className="h-full bg-secondary" initial={{ width: 0 }} animate={{ width: "65%" }} />
          </motion.div>
        </motion.div>

        {/* Staking */}
        <motion.div
          className="relative bg-surface-container-low border-[0.5px] border-outline-variant p-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <Lock size={16} className="absolute top-8 right-8 text-outline/30" />
          <span className="font-label text-[10px] tracking-widest text-outline uppercase">
            Staked Value
          </span>
          <p className="font-label text-3xl font-bold text-on-surface mt-3">
            ${user.stakedValue.toLocaleString()}
          </p>
          <motion.div className="mt-4 h-1 bg-outline-variant/20">
            <motion.div className="h-full bg-secondary" initial={{ width: 0 }} animate={{ width: "65%" }} />
          </motion.div>
        </motion.div>

        {/* Security */}
        <motion.div
          className="relative bg-surface-container-low border-[0.5px] border-outline-variant p-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <ShieldCheck size={16} className="absolute top-8 right-8 text-outline/30" />
          <span className="font-label text-[10px] tracking-widest text-outline uppercase">
            Security Score
          </span>
          <p className="font-label text-3xl font-bold text-on-surface mt-3">
            {user.securityScore}%
          </p>
          <motion.div className="mt-4 h-1 bg-outline-variant/20">
            <motion.div
              className="h-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${user.securityScore}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-12 gap-10">
        {/* Asset Table (8/12) */}
        <motion.div
          className="col-span-12 lg:col-span-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="font-headline text-xl text-on-surface">
                Your Assets
              </h2>
            </div>

            <div className="flex gap-1">
              {(["all", "tea", "liquidity"] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`font-label text-[10px] tracking-widest uppercase px-3 py-1.5 transition-colors ${
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
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="text-left font-label text-[10px] uppercase tracking-widest text-outline pb-4 p-4">
                    Asset Name
                  </th>
                  <th className="text-left font-label text-[10px] uppercase tracking-widest text-outline pb-4 p-4">
                    Vintage
                  </th>
                  <th className="text-left font-label text-[10px] uppercase tracking-widest text-outline pb-4 p-4">
                    Grade
                  </th>
                  <th className="text-right font-label text-[10px] uppercase tracking-widest text-outline pb-4 p-4">
                    Value (USD)
                  </th>
                  <th className="text-center font-label text-[10px] uppercase tracking-widest text-outline pb-4 p-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((cake, i) => (
                  <motion.tr
                    key={cake.id}
                    className="border-b-[0.5px] border-outline-variant hover:bg-surface-container-lowest transition-colors cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="p-4">
                      <p className="text-sm font-body text-on-surface">
                        {cake.name}
                      </p>
                      <p className="text-xs text-outline mt-0.5 max-w-[260px] truncate">
                        {cake.subtitle}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant font-label">
                      {cake.vintage}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant font-label">
                      {cake.grade}
                    </td>
                    <td className="p-4 text-sm text-on-surface text-right font-label">
                      ${cake.priceUsd.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block font-label text-[10px] uppercase tracking-widest px-2.5 py-1 ${
                          cake.isListed
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-container-high text-outline"
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
                      className="p-8 text-center text-outline text-sm"
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
          className="col-span-12 lg:col-span-4 space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          {/* Provenance Timeline */}
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-primary" />
              <h3 className="font-headline text-lg text-on-surface">
                Recent Provenance
              </h3>
            </div>

            {teaCakes[0] && (
              <div className="relative pl-8">
                {/* Dashed vertical line */}
                <div className="absolute left-[7px] top-1 bottom-1 border-l border-dashed border-outline-variant" />

                <div className="space-y-5">
                  {teaCakes[0].provenance.map((p, i) => (
                    <motion.div
                      key={i}
                      className="relative"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {/* Circle marker */}
                      <div
                        className={`absolute -left-8 top-1 w-4 h-4 rounded-full ${
                          i === 0
                            ? "bg-primary"
                            : "border-[0.5px] border-outline-variant bg-surface"
                        }`}
                      />

                      <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                        {p.date}
                      </span>
                      <p className="text-sm text-on-surface mt-0.5 font-body">
                        {p.event}
                      </p>
                      <p className="text-xs text-outline mt-0.5">
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
            className="relative bg-primary-container p-8 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={6}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
            <span className="font-headline text-xl text-primary">
              Curator&apos;s Insight
            </span>
            <p className="font-headline italic text-on-surface-variant mt-3 leading-relaxed">
              &ldquo;The 1988 Menghai Qing Bing represents the zenith of
              state-factory craftsmanship. Its dry-stored character has
              developed a camphor note that only deepens with each passing
              year &mdash; a living testament to patience as
              investment.&rdquo;
            </p>
            <div className="w-8 h-[0.5px] bg-primary mt-4 mb-2" />
            <p className="font-label text-[10px] text-primary uppercase tracking-widest">
              &mdash; Master Chen, Head Curator
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

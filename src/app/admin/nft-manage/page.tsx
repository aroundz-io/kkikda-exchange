"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/stores/useStore";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function gradeBadge(grade: string) {
  if (grade === "AAA")
    return "text-primary border-primary/40 bg-primary/10";
  if (grade === "AA+")
    return "text-secondary border-secondary/40 bg-secondary/10";
  return "text-outline border-outline/40 bg-outline/10";
}

function formatUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function NftManagePage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalAssets = teaCakes.length;
  const totalValue = teaCakes.reduce((s, t) => s + t.priceUsd, 0);
  const avgVintage =
    teaCakes.length > 0
      ? Math.round(
          teaCakes.reduce((s, t) => s + t.vintage, 0) / teaCakes.length
        )
      : 0;

  const stats = [
    { label: "Total Assets", value: totalAssets.toString() },
    { label: "Total Value", value: formatUsd(totalValue) },
    { label: "Avg Vintage", value: avgVintage.toString() },
  ];

  return (
    <div className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-10">
      {/* ── Header ── */}
      <motion.header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        {...fade}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-4xl text-on-surface">
          Tokenized Inventory
        </h1>
        <Link href="/nft" className="btn-gradient inline-block text-center">
          Mint New Asset
        </Link>
      </motion.header>

      {/* ── View Toggle ── */}
      <motion.div
        className="flex items-center gap-2"
        {...fade}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
            viewMode === "grid"
              ? "border-primary text-primary bg-primary/5"
              : "border-outline-variant text-outline hover:text-on-surface"
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
            viewMode === "list"
              ? "border-primary text-primary bg-primary/5"
              : "border-outline-variant text-outline hover:text-on-surface"
          }`}
        >
          List
        </button>
      </motion.div>

      {/* ── Inventory ── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teaCakes.map((cake, i) => (
            <motion.div
              key={cake.id}
              className="bg-surface-low border-[0.5px] border-outline-variant overflow-hidden group"
              {...fade}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            >
              {/* Image Placeholder */}
              <div className="aspect-[4/5] bg-surface-mid flex items-center justify-center relative">
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {cake.weight}
                </span>
                {/* Grade Badge */}
                <span
                  className={`absolute top-3 right-3 font-label text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border-[0.5px] ${gradeBadge(cake.grade)}`}
                >
                  {cake.grade}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-headline text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                  {cake.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {cake.vintage}
                  </p>
                  <p className="font-headline text-sm text-primary">
                    ${cake.priceUsd.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cake.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-muted border-[0.5px] border-outline-ghost px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {teaCakes.map((cake, i) => (
            <motion.div
              key={cake.id}
              className="bg-surface-low border-[0.5px] border-outline-variant p-4 flex items-center gap-4"
              {...fade}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
            >
              <div className="w-14 h-14 bg-surface-mid shrink-0 flex items-center justify-center">
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-outline">
                  {cake.weight}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-sm text-on-surface truncate">
                    {cake.name}
                  </h3>
                  <span
                    className={`font-label text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 border-[0.5px] shrink-0 ${gradeBadge(cake.grade)}`}
                  >
                    {cake.grade}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-dim mt-0.5">
                  {cake.factory} &middot; {cake.vintage} &middot;{" "}
                  {cake.category}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-headline text-sm text-primary">
                  ${cake.priceUsd.toLocaleString()}
                </p>
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {cake.price} BNB
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Stats Row ── */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        {...fade}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-low border-[0.5px] border-outline-variant p-5 text-center"
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-2">
              {stat.label}
            </p>
            <p className="font-headline text-2xl text-on-surface">
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

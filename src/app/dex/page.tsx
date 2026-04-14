"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";

const TIME_PERIODS = ["1D", "1W", "1M", "1Y", "ALL"] as const;
type Period = (typeof TIME_PERIODS)[number];

/* ---------- Simulated bar heights ---------- */
function useBarHeights(count: number) {
  return useMemo(() => {
    const heights: number[] = [];
    let base = 40;
    for (let i = 0; i < count; i++) {
      base += (Math.sin(i * 0.4) * 15 + (Math.random() - 0.5) * 20);
      heights.push(Math.max(15, Math.min(95, base)));
    }
    return heights;
  }, [count]);
}

/* ---------- Swap Arrow Icon ---------- */
function SwapArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4v12M6 12l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ---------- Verified Icon ---------- */
function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 7l2 2 3-4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ---------- Exchange Widget ---------- */
function ExchangeWidget() {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  const rate = 0.00234; // BNB per KKDA (mock)

  const handlePayChange = (val: string) => {
    setPayAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setReceiveAmount((num / rate).toFixed(2));
    } else {
      setReceiveAmount("");
    }
  };

  const handleReceiveChange = (val: string) => {
    setReceiveAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setPayAmount((num * rate).toFixed(6));
    } else {
      setPayAmount("");
    }
  };

  return (
    <div className="bg-surface-low border-[0.5px] border-outline-variant p-6">
      {/* Tab: Buy / Sell */}
      <div className="flex gap-0 mb-6">
        {(["buy", "sell"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 font-label text-[10px] uppercase tracking-[0.15em] py-2.5 transition-colors border-b border-[0.5px] ${
              tab === t
                ? "text-primary border-primary"
                : "text-outline border-outline-variant hover:text-on-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* You Pay */}
      <div className="mb-1">
        <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          You Pay
        </span>
        <div className="flex items-center gap-3 mt-2 border-b border-[0.5px] border-outline-variant pb-3">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={payAmount}
            onChange={(e) => handlePayChange(e.target.value)}
            className="flex-1 bg-transparent font-headline text-2xl text-on-surface outline-none placeholder:text-outline-variant"
          />
          <div className="flex items-center gap-2 shrink-0 bg-surface px-3 py-1.5 border-[0.5px] border-outline-variant">
            <div className="w-5 h-5 bg-[#F0B90B] flex items-center justify-center">
              <span className="text-[8px] font-bold text-black">B</span>
            </div>
            <span className="font-label text-[10px] tracking-[0.15em]">
              {tab === "buy" ? "BNB" : "KKDA"}
            </span>
          </div>
        </div>
      </div>

      {/* Swap arrow */}
      <div className="flex justify-center my-3">
        <button className="text-outline hover:text-primary transition-colors p-1">
          <SwapArrow />
        </button>
      </div>

      {/* You Receive */}
      <div className="mb-6">
        <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          You Receive
        </span>
        <div className="flex items-center gap-3 mt-2 border-b border-[0.5px] border-outline-variant pb-3">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={receiveAmount}
            onChange={(e) => handleReceiveChange(e.target.value)}
            className="flex-1 bg-transparent font-headline text-2xl text-on-surface outline-none placeholder:text-outline-variant"
          />
          <div className="flex items-center gap-2 shrink-0 bg-surface px-3 py-1.5 border-[0.5px] border-outline-variant">
            <div className="w-5 h-5 bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">K</span>
            </div>
            <span className="font-label text-[10px] tracking-[0.15em]">
              {tab === "buy" ? "KKDA" : "BNB"}
            </span>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-2.5 mb-6">
        {[
          { label: "Exchange Rate", value: `1 KKDA = ${rate} BNB` },
          { label: "Slippage", value: "0.5%" },
          { label: "Network Fee", value: "~0.0003 BNB" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center"
          >
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              {row.label}
            </span>
            <span className="text-xs text-on-surface-dim">{row.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="btn-gradient w-full mt-2">Execute Trade</button>

      {/* Settlement note */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        <VerifiedIcon className="text-secondary" />
        <span className="font-label text-[9px] tracking-[0.12em] text-outline">
          Settled on BNB Smart Chain
        </span>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function DexPage() {
  const tokens = useStore((s) => s.tokens);
  const stakingPools = useStore((s) => s.stakingPools);
  const [period, setPeriod] = useState<Period>("1M");

  const kkda = tokens.find((t) => t.symbol === "KKDA");
  const price = kkda?.price ?? 1248.5;
  const change = kkda?.change24h ?? 5.24;
  const isPositive = change >= 0;
  const barHeights = useBarHeights(28);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* ── Price Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            Vintage $KKDA / BNB
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h1 className="font-headline text-4xl text-shadow-gold">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h1>
            <span
              className={`font-label text-[11px] tracking-[0.1em] px-2 py-0.5 ${
                isPositive
                  ? "text-secondary bg-secondary/10"
                  : "text-error bg-error/10"
              }`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Provenance verified badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-secondary inline-block" />
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            Provenance Verified
          </span>
          <span className="text-[10px] text-outline-variant font-label">
            {kkda?.contractAddress ?? "0x1234...5678"}
          </span>
        </div>
      </motion.div>

      {/* ── Main Content: Chart + Widget ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-8"
        >
          {/* Time period selectors */}
          <div className="flex gap-1 mb-4">
            {TIME_PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`font-label text-[10px] tracking-[0.15em] px-3 py-1.5 transition-colors ${
                  period === p
                    ? "text-primary border-b border-primary"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="chart-gradient h-80 border-[0.5px] border-outline-variant relative flex items-end px-3 pb-3 gap-[3px]">
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
                className={`flex-1 ${
                  i === barHeights.length - 1
                    ? "bg-primary/60"
                    : "bg-primary/20 hover:bg-primary/35"
                } transition-colors`}
              />
            ))}

            {/* Current price line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-primary/30"
              style={{ bottom: `${barHeights[barHeights.length - 1]}%` }}
            />
          </div>

          {/* Volume info */}
          <div className="flex items-center justify-between mt-3">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              24h Volume
            </span>
            <span className="font-label text-[10px] tracking-[0.15em] text-on-surface-dim">
              ${(kkda?.volume24h ?? 2_840_000).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Exchange Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-4"
        >
          <ExchangeWidget />
        </motion.div>
      </div>

      {/* ── Liquidity Reservoirs ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12"
      >
        <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          Liquidity Reservoirs
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {stakingPools.map((pool) => (
            <div
              key={pool.id}
              className="bg-surface-low border-[0.5px] border-outline-variant p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-headline text-base text-on-surface">
                    {pool.name}
                  </h3>
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mt-1 inline-block">
                    {pool.pair}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-headline text-xl text-primary">
                    {pool.apy}%
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline block mt-0.5">
                    APY
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[0.5px] border-outline-variant">
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Total Value Locked
                </span>
                <span className="text-sm text-on-surface-dim">
                  ${pool.totalStakedUsd.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Lock Period
                </span>
                <span className="text-sm text-on-surface-dim">
                  {pool.lockDays} days
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Master's Note ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="mt-16 mb-8 border-[0.5px] border-outline-variant p-8 bg-surface-low"
      >
        <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          {"Master's Note"}
        </span>
        <blockquote className="font-headline italic text-lg text-on-surface-dim mt-4 leading-relaxed">
          {
            "\"The patient hand that stores the leaf also stores time itself. In this exchange, we do not merely trade tea \u2014 we trade the years held within each cake, the patience of those who waited, and the trust of those who preserved.\""
          }
        </blockquote>
        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mt-4">
          {"— Master Liang Weichen, Fifth-Generation Pu'er Curator"}
        </p>
      </motion.section>
    </div>
  );
}

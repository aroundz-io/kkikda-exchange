"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { t } from "@/lib/i18n";

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StakingPage() {
  const { lang, stakingPools, user, connectWallet, stakeTokens, unstakeTokens, claimRewards } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [tab, setTab] = useState<"stake" | "unstake">("stake");

  const pool = stakingPools.find((p) => p.id === selected);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fade}
        className="text-center mb-16"
      >
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-3">
          Earn Rewards
        </p>
        <h1 className="text-serif text-4xl sm:text-5xl font-bold mb-4">
          {t("nav.staking", lang)}
        </h1>
        <p className="text-on-surface-mid max-w-lg mx-auto text-sm">
          Stake your tokens to earn rewards. Support the network and earn passive
          income from RWA yield.
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { label: "Total Staked", value: "$8.59M", sub: "Across all pools" },
          { label: "Total Rewards Paid", value: "$1.23M", sub: "All time" },
          { label: "Active Stakers", value: "2,847", sub: "+12% this month" },
          { label: "Your Staked", value: user.address ? "$4,280" : "—", sub: user.address ? "3 pools" : "Connect wallet" },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fade}
            className="bg-surface-low p-5"
          >
            <div className="text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-2">
              {s.label}
            </div>
            <div className="text-2xl font-mono font-semibold text-on-surface">
              {s.value}
            </div>
            <div className="text-[11px] text-on-surface-dim mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pools Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {stakingPools.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            onClick={() => setSelected(p.id)}
            className={`bg-surface-low p-6 cursor-pointer transition-all ${
              selected === p.id
                ? "outline outline-1 outline-primary"
                : "hover:bg-surface-mid"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-semibold text-sm">{p.name}</h3>
              <span className="text-xs font-mono px-2 py-0.5 bg-primary-dim text-primary">
                {p.lockDays}d lock
              </span>
            </div>

            <div className="text-3xl font-mono font-bold text-primary mb-1">
              {p.apy}%
            </div>
            <div className="text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-6">
              APY
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-dim">Total Staked</span>
                <span className="font-mono">
                  ${(p.totalStaked / 1_000_000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-dim">Min Stake</span>
                <span className="font-mono">{p.minStake} KKD</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-dim">Reward Token</span>
                <span className="font-mono text-accent">{p.rewardToken}</span>
              </div>
            </div>

            {/* Utilization bar */}
            <div className="mt-4">
              <div className="h-1 bg-surface-high w-full">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-dark"
                  style={{
                    width: `${Math.min((p.totalStaked / 5_000_000) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-on-surface-dim mt-1 text-right font-mono">
                {((p.totalStaked / 5_000_000) * 100).toFixed(0)}% utilized
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Staking Panel */}
      {selected && pool && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-surface-low p-8"
        >
          <h3 className="text-serif text-xl font-bold mb-6">
            {pool.name}
          </h3>

          {/* Tabs */}
          <div className="flex mb-6">
            {(["stake", "unstake"] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  tab === tb
                    ? "text-primary border-b border-primary"
                    : "text-on-surface-dim border-b border-outline-ghost"
                }`}
              >
                {t(`staking.${tb}`, lang)}
              </button>
            ))}
          </div>

          {/* Amount input */}
          <div className="mb-4">
            <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-2">
              {t("trade.amount", lang)}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-scholar text-xl font-mono"
            />
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 mb-6">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setAmount(String((user.balance * pct) / 100))}
                className="flex-1 py-1.5 text-[10px] font-mono text-on-surface-dim bg-surface-mid hover:text-primary transition-colors"
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="space-y-2 mb-6 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-dim">APY</span>
              <span className="font-mono text-primary">{pool.apy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-dim">Lock Period</span>
              <span className="font-mono">{pool.lockDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-dim">Est. Daily Reward</span>
              <span className="font-mono text-accent">
                {amount
                  ? ((parseFloat(amount) * pool.apy) / 365 / 100).toFixed(4)
                  : "0.0000"}{" "}
                {pool.rewardToken}
              </span>
            </div>
          </div>

          {user.address ? (
            <button
              onClick={() => {
                const amt = parseFloat(amount);
                if (!amt || amt <= 0) return;
                if (tab === "stake") {
                  stakeTokens(pool.id, amt);
                } else {
                  unstakeTokens(pool.id);
                }
                setAmount("");
              }}
              className="btn-gold w-full py-3 text-sm"
            >
              {tab === "stake"
                ? t("staking.stake", lang)
                : t("staking.unstake", lang)}
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="btn-gold w-full py-3 text-sm"
            >
              {t("nav.connect", lang)}
            </button>
          )}
        </motion.div>
      )}

      {/* Rewards section */}
      {user.address && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mt-8 bg-surface-low p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-mono text-sm font-semibold">
              {t("staking.rewards", lang)}
            </h4>
            <span className="text-xs font-mono text-accent">12.45 KKD</span>
          </div>
          <button
            onClick={() => claimRewards(selected || "")}
            className="btn-ghost w-full py-2 text-xs"
          >
            {t("staking.claim", lang)}
          </button>
        </motion.div>
      )}
    </div>
  );
}

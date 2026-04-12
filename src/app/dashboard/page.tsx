"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { t, formatPercent } from "@/lib/i18n";

const MOCK_PORTFOLIO = [
  { symbol: "KKD", amount: 5200, value: 12740, change: 5.2 },
  { symbol: "PUER", amount: 15, value: 2374.5, change: 1.8 },
  { symbol: "AGED", amount: 3, value: 1260, change: -2.1 },
  { symbol: "CERA", amount: 42, value: 3171, change: 3.4 },
];

const MOCK_HISTORY = [
  { type: "Buy", token: "KKD", amount: "1,000", price: "$2.40", time: "2h ago", status: "Completed" },
  { type: "Stake", token: "KKD", amount: "2,000", price: "—", time: "1d ago", status: "Active" },
  { type: "Sell", token: "PUER", amount: "5", price: "$155.20", time: "3d ago", status: "Completed" },
  { type: "Buy", token: "AGED", amount: "3", price: "$418.50", time: "5d ago", status: "Completed" },
  { type: "Redeem", token: "PUER", amount: "2", price: "$310.40", time: "1w ago", status: "Shipped" },
];

const MOCK_NFTS = [
  { name: "Golden Yixing Teapot #7", collection: "Master Craftworks", value: "5.8 ETH" },
  { name: "Kura Membership: Jade", collection: "Kura Membership", value: "2.0 ETH" },
];

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { lang, user, connectWallet } = useStore();
  const [tab, setTab] = useState<"portfolio" | "history" | "nfts" | "staking">("portfolio");

  if (!user.address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-serif text-2xl font-bold mb-4">
          {t("nav.dashboard", lang)}
        </h2>
        <p className="text-on-surface-mid text-sm mb-6">
          Connect your wallet to view your dashboard.
        </p>
        <button onClick={connectWallet} className="btn-gold px-8 py-3 text-sm">
          {t("nav.connect", lang)}
        </button>
      </div>
    );
  }

  const totalValue = MOCK_PORTFOLIO.reduce((s, p) => s + p.value, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fade} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-serif text-3xl font-bold">
            {t("nav.dashboard", lang)}
          </h1>
          <span className="text-xs font-mono px-2 py-0.5 bg-secondary-fixed text-surface">
            KYC Tier {user.kycTier}
          </span>
        </div>
        <p className="text-xs font-mono text-on-surface-dim">{user.address}</p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {[
          { label: "Total Value", value: `$${totalValue.toLocaleString()}`, color: "" },
          { label: "ETH Balance", value: `${user.balance.toFixed(4)} ETH`, color: "" },
          { label: "Staked Value", value: "$4,280", color: "text-primary" },
          { label: "Pending Rewards", value: "12.45 KKD", color: "text-accent" },
        ].map((c) => (
          <motion.div key={c.label} variants={fade} className="bg-surface-low p-5">
            <div className="text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-2">
              {c.label}
            </div>
            <div className={`text-xl font-mono font-semibold ${c.color}`}>
              {c.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-outline-ghost mb-8">
        {(["portfolio", "history", "nfts", "staking"] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              tab === tb
                ? "text-primary border-b border-primary -mb-[1px]"
                : "text-on-surface-dim hover:text-on-surface"
            }`}
          >
            {tb}
          </button>
        ))}
      </div>

      {/* Portfolio Tab */}
      {tab === "portfolio" && (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
          <div className="bg-surface-low">
            <div className="grid grid-cols-5 gap-4 p-4 text-[10px] font-mono text-on-surface-dim tracking-widest uppercase">
              <span>Token</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Value</span>
              <span className="text-right">24h</span>
              <span className="text-right">Action</span>
            </div>
            {MOCK_PORTFOLIO.map((p) => (
              <motion.div
                key={p.symbol}
                variants={fade}
                className="grid grid-cols-5 gap-4 items-center p-4 border-t border-outline-ghost hover:bg-surface-mid transition-colors"
              >
                <span className="font-mono font-semibold text-sm">{p.symbol}</span>
                <span className="text-right font-mono text-sm">
                  {p.amount.toLocaleString()}
                </span>
                <span className="text-right font-mono text-sm">
                  ${p.value.toLocaleString()}
                </span>
                <span
                  className={`text-right font-mono text-sm ${
                    p.change >= 0 ? "text-secondary" : "text-error"
                  }`}
                >
                  {formatPercent(p.change)}
                </span>
                <div className="text-right">
                  <button className="btn-ghost px-3 py-1 text-[10px]">Trade</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
          <div className="bg-surface-low">
            <div className="grid grid-cols-6 gap-4 p-4 text-[10px] font-mono text-on-surface-dim tracking-widest uppercase">
              <span>Type</span>
              <span>Token</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Price</span>
              <span className="text-right">Time</span>
              <span className="text-right">Status</span>
            </div>
            {MOCK_HISTORY.map((h, i) => (
              <motion.div
                key={i}
                variants={fade}
                className="grid grid-cols-6 gap-4 items-center p-4 border-t border-outline-ghost text-sm"
              >
                <span
                  className={`font-mono text-xs ${
                    h.type === "Buy"
                      ? "text-secondary"
                      : h.type === "Sell"
                      ? "text-error"
                      : "text-accent"
                  }`}
                >
                  {h.type}
                </span>
                <span className="font-mono">{h.token}</span>
                <span className="text-right font-mono">{h.amount}</span>
                <span className="text-right font-mono">{h.price}</span>
                <span className="text-right text-on-surface-dim text-xs">{h.time}</span>
                <span className="text-right">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 ${
                      h.status === "Completed"
                        ? "bg-success-dim text-success"
                        : h.status === "Active"
                        ? "bg-primary-dim text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {h.status}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* NFTs Tab */}
      {tab === "nfts" && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {MOCK_NFTS.map((nft) => (
            <motion.div key={nft.name} variants={fade} className="bg-surface-low">
              <div className="aspect-square bg-gradient-to-br from-surface-mid to-surface-high flex items-center justify-center">
                <span className="text-4xl text-on-surface-dim/30 text-serif">NFT</span>
              </div>
              <div className="p-4">
                <div className="text-[10px] text-on-surface-dim font-mono mb-1">
                  {nft.collection}
                </div>
                <div className="text-sm font-semibold mb-2">{nft.name}</div>
                <div className="text-sm font-mono text-primary">{nft.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Staking Tab */}
      {tab === "staking" && (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { pool: "KKD Staking", staked: "2,000 KKD", apy: "14.5%", reward: "8.32 KKD", unlock: "18 days" },
              { pool: "RWA Yield Vault", staked: "500 KKD", apy: "8.2%", reward: "4.13 PUER", unlock: "142 days" },
            ].map((s) => (
              <motion.div key={s.pool} variants={fade} className="bg-surface-low p-6">
                <h4 className="font-mono text-sm font-semibold mb-4">{s.pool}</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-dim">Staked</span>
                    <span className="font-mono">{s.staked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-dim">APY</span>
                    <span className="font-mono text-primary">{s.apy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-dim">Pending Reward</span>
                    <span className="font-mono text-accent">{s.reward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-dim">Unlock In</span>
                    <span className="font-mono">{s.unlock}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="btn-ghost flex-1 py-2 text-[10px]">Unstake</button>
                  <button className="btn-gold flex-1 py-2 text-[10px]">Claim</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

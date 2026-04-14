"use client";

import { useStore } from "@/stores/useStore";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Activity,
  Target,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const { orders } = useStore();

  const sorted = [...orders].sort((a, b) => b.timestamp - a.timestamp);

  const totalTrades = orders.length;
  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);
  const avgTradeSize = totalTrades > 0 ? totalVolume / totalTrades : 0;
  const filledBuys = orders.filter(
    (o) => o.type === "buy" && o.status === "filled"
  );
  const filledSells = orders.filter(
    (o) => o.type === "sell" && o.status === "filled"
  );
  const winRate =
    filledBuys.length + filledSells.length > 0
      ? Math.round(
          (filledSells.length / (filledBuys.length + filledSells.length)) * 100
        )
      : 0;

  const summaryCards = [
    {
      label: "Total Trades",
      value: totalTrades.toString(),
      icon: BarChart3,
    },
    {
      label: "Total Volume",
      value: `$${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Activity,
    },
    {
      label: "Avg Trade Size",
      value: `$${avgTradeSize.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Target,
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: TrendingUp,
    },
  ];

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateHash = (hash: string) =>
    hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : hash;

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <motion.div
        className="mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          Ledger
        </span>
        <h1 className="font-headline text-4xl lg:text-5xl text-on-surface mt-1">
          Transaction History
        </h1>
      </motion.div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-surface-low border-[0.5px] border-outline-variant p-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 1}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-label text-[10px] tracking-[0.15em] text-outline uppercase">
                {card.label}
              </span>
              <card.icon size={16} className="text-outline" />
            </div>
            <p className="font-headline text-2xl text-on-surface">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table (2/3) */}
        <motion.div
          className="lg:col-span-2"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-primary" />
            <h2 className="font-headline text-xl text-on-surface">
              Order History
            </h2>
          </div>

          <div className="bg-surface-low border-[0.5px] border-outline-variant overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-ghost">
                  {[
                    "Time",
                    "Type",
                    "Asset",
                    "Amount",
                    "Price",
                    "Total",
                    "Status",
                    "Tx Hash",
                  ].map((col) => (
                    <th
                      key={col}
                      className={`font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4 ${
                        col === "Total" || col === "Price" || col === "Amount"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-on-surface-muted text-sm"
                    >
                      No transactions yet. Start trading to see your history.
                    </td>
                  </tr>
                ) : (
                  sorted.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      className="border-b border-outline-ghost hover:bg-surface-mid transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td className="p-4 text-sm text-on-surface-dim font-body whitespace-nowrap">
                        {formatTime(order.timestamp)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-label text-[10px] uppercase tracking-[0.15em] ${
                            order.type === "buy"
                              ? "text-secondary"
                              : "text-error"
                          }`}
                        >
                          {order.type === "buy" ? (
                            <ArrowDownLeft size={12} />
                          ) : (
                            <ArrowUpRight size={12} />
                          )}
                          {order.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-on-surface font-label">
                        {order.tokenSymbol}
                      </td>
                      <td className="p-4 text-sm text-on-surface text-right font-label">
                        {order.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-on-surface text-right font-label">
                        ${order.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-on-surface text-right font-label">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block font-label text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 ${
                            order.status === "filled"
                              ? "bg-secondary/10 text-secondary"
                              : order.status === "cancelled"
                                ? "bg-error/10 text-error"
                                : "bg-primary/10 text-primary"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-on-surface-muted font-label">
                        {truncateHash(order.txHash)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity Timeline (1/3) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <div className="bg-surface-low border-[0.5px] border-outline-variant p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-primary" />
              <h3 className="font-headline text-lg text-on-surface">
                Recent Activity
              </h3>
            </div>

            {sorted.length === 0 ? (
              <p className="text-sm text-on-surface-muted">
                No activity to display yet.
              </p>
            ) : (
              <div className="relative pl-5">
                {/* Dashed vertical line */}
                <div className="absolute left-[3px] top-1 bottom-1 border-l border-dashed border-outline-variant" />

                <div className="space-y-5">
                  {sorted.slice(0, 8).map((order, i) => (
                    <motion.div
                      key={order.id}
                      className="relative"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {/* Square marker */}
                      <div
                        className={`absolute -left-5 top-1 w-2 h-2 ${
                          order.type === "buy" ? "bg-secondary" : "bg-primary"
                        }`}
                      />

                      <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                        {formatTime(order.timestamp)}
                      </span>
                      <p className="text-sm text-on-surface mt-0.5 font-body">
                        <span
                          className={
                            order.type === "buy"
                              ? "text-secondary"
                              : "text-error"
                          }
                        >
                          {order.type === "buy" ? "Bought" : "Sold"}
                        </span>{" "}
                        {order.amount} {order.tokenSymbol}
                      </p>
                      <p className="text-xs text-on-surface-muted mt-0.5">
                        ${order.total.toLocaleString()} &middot;{" "}
                        {truncateHash(order.txHash)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

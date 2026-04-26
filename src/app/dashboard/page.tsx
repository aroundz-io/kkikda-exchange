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
import { useT } from "@/lib/i18n/useT";

export default function DashboardPage() {
  const { orders } = useStore();
  const t = useT();

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
    { label: t("dashboard.totalTrades"), value: totalTrades.toString(), icon: BarChart3 },
    {
      label: t("dashboard.totalVolume"),
      value: `$${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Activity,
    },
    {
      label: t("dashboard.avgTradeSize"),
      value: `$${avgTradeSize.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      icon: Target,
    },
    { label: t("dashboard.winRate"), value: `${winRate}%`, icon: TrendingUp },
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
    <div className="page-padding">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-4xl text-on-surface mb-2"
          >
            {t("dashboard.title")}
          </motion.h1>
          <p className="font-body text-outline max-w-lg">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-surface-container-low p-8 relative overflow-hidden group border border-outline-variant/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon size={48} />
            </div>
            <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-2">
              {card.label}
            </p>
            <p className="font-headline text-3xl text-on-surface font-bold">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table (2/3) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-primary" />
            <h2 className="font-headline text-xl text-on-surface">
              {t("dashboard.orderHistory")}
            </h2>
          </div>

          <div className="bg-surface-container-low border-[0.5px] border-outline-variant overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  {[
                    { key: "time", label: t("dashboard.col.time"), align: "left" },
                    { key: "type", label: t("dashboard.col.type"), align: "left" },
                    { key: "asset", label: t("dashboard.col.asset"), align: "left" },
                    { key: "amount", label: t("dashboard.col.amount"), align: "right" },
                    { key: "price", label: t("dashboard.col.price"), align: "right" },
                    { key: "total", label: t("dashboard.col.total"), align: "right" },
                    { key: "status", label: t("dashboard.col.status"), align: "left" },
                    { key: "txHash", label: t("dashboard.col.txHash"), align: "left" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={`font-label text-[10px] uppercase tracking-[0.15em] text-outline p-4 ${
                        col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-outline text-sm"
                    >
                      {t("dashboard.empty")}
                    </td>
                  </tr>
                ) : (
                  sorted.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      className="border-b border-outline-variant/30 hover:bg-surface-container transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td className="p-4 text-sm text-on-surface-variant font-body whitespace-nowrap">
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
                      <td className="p-4 text-xs text-outline font-label">
                        {truncateHash(order.txHash)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Timeline (1/3) */}
        <div>
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-primary" />
              <h3 className="font-headline text-lg text-on-surface">
                {t("dashboard.recentActivity")}
              </h3>
            </div>

            {sorted.length === 0 ? (
              <p className="text-sm text-outline">
                {t("dashboard.noActivity")}
              </p>
            ) : (
              <div className="relative pl-5">
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
                          {order.type === "buy" ? t("dashboard.bought") : t("dashboard.sold")}
                        </span>{" "}
                        {order.amount} {order.tokenSymbol}
                      </p>
                      <p className="text-xs text-outline mt-0.5">
                        ${order.total.toLocaleString()} &middot;{" "}
                        {truncateHash(order.txHash)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { useT } from "@/lib/i18n/useT";
import { useCakeName } from "@/lib/i18n/useCakeName";
import { ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { ADDRESSES } from "@/lib/web3/contracts";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function AdminOrdersPage() {
  const t = useT();
  const cakeName = useCakeName();
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const fulfillPurchaseOrder = useStore((s) => s.fulfillPurchaseOrder);
  const teaCakes = useStore((s) => s.teaCakes);

  const pending = purchaseOrders.filter((p) => p.status === "paid");
  const delivered = purchaseOrders.filter((p) => p.status === "delivered");

  const totalRevenueUsdt = purchaseOrders.reduce((s, o) => s + o.totalUsdt, 0);

  return (
    <div className="page-padding space-y-10">
      <motion.header
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-[0.5px] border-outline-variant pb-6"
        {...fade}
      >
        <div>
          <h1 className="font-headline text-4xl text-on-surface tracking-tight">
            {t("orders.title")}
          </h1>
          <p className="font-body text-outline mt-2 max-w-2xl">
            {t("orders.subtitle")}
          </p>
        </div>
        <div className="text-right">
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            {t("orders.totalRevenue")}
          </p>
          <p className="font-headline text-2xl text-primary mt-1">
            {totalRevenueUsdt.toLocaleString()} USDT
          </p>
        </div>
      </motion.header>

      <motion.div
        className="grid grid-cols-3 gap-4"
        {...fade}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-5">
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-2">
            {t("orders.totalOrders")}
          </p>
          <p className="font-headline text-2xl text-on-surface">
            {purchaseOrders.length}
          </p>
        </div>
        <div className="bg-surface-container-low border-[0.5px] border-error/40 p-5">
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-error mb-2">
            ● {t("orders.pending")}
          </p>
          <p className="font-headline text-2xl text-on-surface">
            {pending.length}
          </p>
        </div>
        <div className="bg-surface-container-low border-[0.5px] border-secondary/40 p-5">
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-secondary mb-2">
            ✓ {t("orders.delivered")}
          </p>
          <p className="font-headline text-2xl text-on-surface">
            {delivered.length}
          </p>
        </div>
      </motion.div>

      {/* Pending */}
      <motion.section className="space-y-4" {...fade} transition={{ delay: 0.15 }}>
        <h2 className="font-headline text-xl text-on-surface flex items-center gap-2">
          <Clock className="w-5 h-5 text-error" />
          {t("orders.pendingFulfillment")}
        </h2>
        {pending.length === 0 ? (
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-10 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              {t("orders.noPending")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((order) => {
              const cake = teaCakes.find((c) => c.id === order.cakeId);
              const startId =
                (cake?.tokenId ?? 1) +
                ((cake?.soldUnits ?? order.quantity) - order.quantity);
              const suggestedIds = Array.from(
                { length: order.quantity },
                (_, i) => startId + i,
              ).join(", ");
              return (
                <div
                  key={order.id}
                  className="bg-surface-container-low border-[0.5px] border-error/30 p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                      {cake?.image && (
                        <div className="w-16 h-16 bg-surface-container shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cake.image}
                            alt={cakeName(cake)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-headline text-base text-on-surface truncate">
                          {cake ? cakeName(cake) : order.cakeName}
                        </h4>
                        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mt-1">
                          {new Date(order.timestamp).toLocaleString()} ·{" "}
                          {order.id}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant mt-1">
                          {order.quantity} units ×{" "}
                          {order.pricePerUnit.toLocaleString()} USDT ={" "}
                          <span className="text-primary">
                            {order.totalUsdt.toLocaleString()} USDT
                          </span>
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://testnet.bscscan.com/tx/${order.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label text-[10px] uppercase tracking-[0.15em] text-outline hover:text-primary transition-colors flex items-center gap-1 shrink-0"
                    >
                      {t("orders.viewPayment")}
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-3 border-t border-outline-variant/15">
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                        {t("orders.buyer")}
                      </p>
                      <a
                        href={`https://testnet.bscscan.com/address/${order.buyer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-xs text-primary break-all hover:opacity-70"
                      >
                        {order.buyer}
                      </a>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                        {t("orders.suggestedTokenIds")}
                      </p>
                      <p className="font-label text-xs text-secondary">
                        #{suggestedIds}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/15">
                    <p className="font-body text-xs text-on-surface-variant max-w-md leading-relaxed">
                      {t("orders.deliveryHelp")}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`https://testnet.bscscan.com/address/${ADDRESSES.KKIKDA_NFT}#writeContract`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border-[0.5px] border-primary text-primary font-label text-[10px] uppercase tracking-[0.15em] hover:bg-primary/10 transition-colors flex items-center gap-1"
                      >
                        {t("orders.openContract")}
                        <ExternalLink size={11} />
                      </a>
                      <button
                        onClick={() =>
                          fulfillPurchaseOrder(order.id, suggestedIds)
                        }
                        className="px-4 py-2 bg-secondary/10 border-[0.5px] border-secondary/40 text-secondary font-label text-[10px] uppercase tracking-[0.15em] hover:bg-secondary/20 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        {t("orders.markDelivered")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Delivered ledger */}
      {delivered.length > 0 && (
        <motion.section className="space-y-4" {...fade} transition={{ delay: 0.2 }}>
          <h2 className="font-headline text-xl text-on-surface flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            {t("orders.deliveredLedger")}
          </h2>
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-outline-variant/30 font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  <th className="px-4 py-3 text-left">{t("orders.col.time")}</th>
                  <th className="px-4 py-3 text-left">{t("orders.col.product")}</th>
                  <th className="px-4 py-3 text-right">{t("orders.col.qty")}</th>
                  <th className="px-4 py-3 text-right">{t("orders.col.total")}</th>
                  <th className="px-4 py-3 text-left">{t("orders.col.buyer")}</th>
                  <th className="px-4 py-3 text-left">{t("orders.col.tokens")}</th>
                </tr>
              </thead>
              <tbody className="text-sm font-body">
                {delivered.map((o) => {
                  const cake = teaCakes.find((c) => c.id === o.cakeId);
                  return (
                  <tr key={o.id} className="border-b border-outline-variant/15">
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                      {new Date(o.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-on-surface">{cake ? cakeName(cake) : o.cakeName}</td>
                    <td className="px-4 py-3 text-right">{o.quantity}</td>
                    <td className="px-4 py-3 text-right text-primary">
                      {o.totalUsdt.toLocaleString()} USDT
                    </td>
                    <td className="px-4 py-3 text-outline font-label text-xs">
                      {o.buyer.slice(0, 6)}…{o.buyer.slice(-4)}
                    </td>
                    <td className="px-4 py-3 text-secondary font-label text-xs">
                      #{o.deliveredTokenIds ?? "—"}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}
    </div>
  );
}

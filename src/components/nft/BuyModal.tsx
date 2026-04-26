"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { X } from "lucide-react";
import { useStore, type TeaCake } from "@/stores/useStore";
import { useTokenBalance, useTokenTransfer } from "@/hooks/useTokenContract";
import { USDT_ADDRESS } from "@/hooks/useSwap";
import { TREASURY_ADDRESS } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";
import { useT } from "@/lib/i18n/useT";
import { useCakeName } from "@/lib/i18n/useCakeName";

interface Props {
  cake: TeaCake;
  onClose: () => void;
}

export function BuyModal({ cake, onClose }: Props) {
  const t = useT();
  const { address, isConnected } = useAccount();
  const addPurchaseOrder = useStore((s) => s.addPurchaseOrder);
  const addToast = useStore((s) => s.addToast);
  const cakeName = useCakeName();

  const { balance: usdtBalance } = useTokenBalance(USDT_ADDRESS, address);
  const usdt = usdtBalance ? Number(formatUnits(usdtBalance, 18)) : 0;

  const sold = cake.soldUnits ?? 0;
  const available = Math.max(0, (cake.totalUnits ?? 1) - sold);
  const [qty, setQty] = useState(1);

  const totalUsdt = qty * cake.priceUsd;
  const totalWei = useMemo(
    () => parseUnits(String(totalUsdt), 18),
    [totalUsdt],
  );

  const { transfer, hash, isPending, isConfirming, isSuccess, isError, error, reset } =
    useTokenTransfer(USDT_ADDRESS);

  // Record on success
  useEffect(() => {
    if (isSuccess && hash && address) {
      const genId = () => Math.random().toString(36).slice(2, 10);
      addPurchaseOrder({
        id: `po-${Date.now()}-${genId()}`,
        cakeId: cake.id,
        cakeName: cake.name,
        quantity: qty,
        pricePerUnit: cake.priceUsd,
        totalUsdt,
        buyer: address,
        txHash: hash,
        timestamp: Date.now(),
        status: "paid",
      });
      reset();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash]);

  function handleBuy() {
    if (!isConnected || !address) {
      addToast({
        type: "error",
        title: t("dex.walletNotConnected"),
        message: t("dex.walletNotConnectedMsg"),
      });
      return;
    }
    if (qty < 1 || qty > available) return;
    if (usdt < totalUsdt) {
      addToast({
        type: "error",
        title: "Insufficient USDT",
        message: `Need ${totalUsdt.toLocaleString()} USDT, have ${usdt.toLocaleString()}`,
      });
      return;
    }
    transfer(TREASURY_ADDRESS, totalWei);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-surface/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-surface-container-low border-[0.5px] border-outline-variant max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant/15 flex items-center justify-between">
            <h3 className="font-headline text-base text-on-surface">
              {t("nft.buyTitle")}
            </h3>
            <button
              onClick={onClose}
              className="text-outline hover:text-on-surface"
            >
              <X size={18} />
            </button>
          </div>

          {/* Product summary */}
          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-surface-container shrink-0 overflow-hidden">
                {cake.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cake.image}
                    alt={cakeName(cake)}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-headline text-lg text-on-surface truncate">
                  {cakeName(cake)}
                </h4>
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mt-1">
                  {cake.vintage} · {cake.weight} · {cake.grade}
                </p>
                <div className="flex gap-4 text-xs font-body text-on-surface-variant mt-2">
                  <span>
                    {t("nft.available")}:{" "}
                    <span className="text-secondary">
                      {available.toLocaleString()}
                    </span>
                  </span>
                  <span>
                    {t("nft.sold")}:{" "}
                    <span className="text-on-surface">{sold.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline flex justify-between">
                <span>{t("nft.quantity")}</span>
                <span className="normal-case tracking-normal">
                  max {available.toLocaleString()}
                </span>
              </label>
              <input
                type="number"
                min={1}
                max={available}
                step={1}
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.max(
                      1,
                      Math.min(available, Math.floor(Number(e.target.value) || 1)),
                    ),
                  )
                }
                className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2.5 font-body text-base text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Pricing breakdown */}
            <div className="bg-surface-container-high border-[0.5px] border-outline-variant px-4 py-3 space-y-1.5">
              <div className="flex justify-between font-label text-[11px] uppercase tracking-tighter text-outline">
                <span>{t("nft.unitPrice")}</span>
                <span className="text-on-surface">
                  {cake.priceUsd.toLocaleString()} USDT
                </span>
              </div>
              <div className="flex justify-between font-label text-[11px] uppercase tracking-tighter text-outline">
                <span>{t("nft.quantity")}</span>
                <span className="text-on-surface">× {qty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-headline text-base pt-2 border-t border-outline-variant/15 mt-2">
                <span className="text-outline">{t("nft.totalPrice")}</span>
                <span className="text-primary font-bold">
                  {totalUsdt.toLocaleString()} USDT
                </span>
              </div>
            </div>

            {/* Recipient (treasury) */}
            <div className="space-y-1">
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                {t("nft.payTo")}
              </p>
              <p className="font-label text-[10px] text-on-surface-variant break-all">
                {TREASURY_ADDRESS}
              </p>
            </div>

            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              {t("nft.deliveryNote")}
            </p>

            <TxStatus
              hash={hash}
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              isError={isError}
              error={error}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 border-[0.5px] border-outline-variant text-outline font-label text-[10px] uppercase tracking-[0.15em] hover:text-on-surface transition-colors"
              >
                {t("nft.cancel")}
              </button>
              <button
                onClick={handleBuy}
                disabled={
                  !isConnected ||
                  available === 0 ||
                  qty < 1 ||
                  isPending ||
                  isConfirming
                }
                className="flex-[2] btn-gradient disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {!isConnected
                  ? t("nft.connectToBuy")
                  : available === 0
                    ? t("nft.outOfStock")
                    : isPending
                      ? t("dex.awaitingSig")
                      : isConfirming
                        ? t("nft.processingPayment")
                        : t("nft.confirmPurchase")}
              </button>
            </div>

            {isConnected && (
              <p className="font-label text-[10px] text-outline text-right">
                {t("dex.balance")}:{" "}
                {usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                USDT
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { parseUnits, formatUnits, type Address } from "viem";
import { useStore } from "@/stores/useStore";
import {
  useAddLiquidity,
  usePairAddress,
  usePairReserves,
  KKDA_ADDRESS,
  USDT_ADDRESS,
} from "@/hooks/useSwap";
import { useTokenBalance, useTokenApprove } from "@/hooks/useTokenContract";
import { PANCAKE_ROUTER, KKD_TOKEN_ABI } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";
import { useT } from "@/lib/i18n/useT";
import { Droplets, ExternalLink } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const inputClass =
  "w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2.5 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors";

export default function AdminLiquidityPage() {
  const t = useT();
  const { address, isConnected } = useAccount();
  const addToast = useStore((s) => s.addToast);

  const [kkdaInput, setKkdaInput] = useState("");
  const [usdtInput, setUsdtInput] = useState("");
  const [pendingAdd, setPendingAdd] = useState(false);

  // Live balances
  const { balance: kkdaBalance } = useTokenBalance(KKDA_ADDRESS, address);
  const { balance: usdtBalance } = useTokenBalance(USDT_ADDRESS, address);

  // Pair status
  const { pair, exists, isLoading: pairLoading, refetch: refetchPair } =
    usePairAddress(KKDA_ADDRESS, USDT_ADDRESS);
  const { reserve0, reserve1, token0, refetch: refetchReserves } =
    usePairReserves(pair);

  // Reserve formatting
  const isKkdaToken0 =
    token0 && token0.toLowerCase() === KKDA_ADDRESS.toLowerCase();
  const kkdaReserve = isKkdaToken0 ? reserve0 : reserve1;
  const usdtReserve = isKkdaToken0 ? reserve1 : reserve0;
  const reserveRatio =
    kkdaReserve && usdtReserve && kkdaReserve > BigInt(0)
      ? Number(formatUnits(usdtReserve, 18)) /
        Number(formatUnits(kkdaReserve, 18))
      : null;

  // Allowances
  const kkdaAllowanceQuery = useReadContract({
    address: KKDA_ADDRESS,
    abi: KKD_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, PANCAKE_ROUTER as Address] : undefined,
    query: { enabled: !!address },
  });
  const usdtAllowanceQuery = useReadContract({
    address: USDT_ADDRESS,
    abi: KKD_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, PANCAKE_ROUTER as Address] : undefined,
    query: { enabled: !!address },
  });
  const kkdaAllowance = (kkdaAllowanceQuery.data as bigint | undefined) ?? BigInt(0);
  const usdtAllowance = (usdtAllowanceQuery.data as bigint | undefined) ?? BigInt(0);

  // Parse inputs
  const kkdaWei = useMemo(() => {
    if (!kkdaInput) return undefined;
    try { return parseUnits(kkdaInput, 18); } catch { return undefined; }
  }, [kkdaInput]);
  const usdtWei = useMemo(() => {
    if (!usdtInput) return undefined;
    try { return parseUnits(usdtInput, 18); } catch { return undefined; }
  }, [usdtInput]);

  const needsKkdaApproval =
    kkdaWei !== undefined && kkdaAllowance < kkdaWei;
  const needsUsdtApproval =
    usdtWei !== undefined && usdtAllowance < usdtWei;

  // Approval hooks
  const kkdaApprove = useTokenApprove(KKDA_ADDRESS);
  const usdtApprove = useTokenApprove(USDT_ADDRESS);

  // Refetch allowances after approval succeeds
  useEffect(() => {
    if (kkdaApprove.isSuccess) {
      kkdaAllowanceQuery.refetch();
      kkdaApprove.reset();
    }
  }, [kkdaApprove.isSuccess, kkdaAllowanceQuery, kkdaApprove]);
  useEffect(() => {
    if (usdtApprove.isSuccess) {
      usdtAllowanceQuery.refetch();
      usdtApprove.reset();
    }
  }, [usdtApprove.isSuccess, usdtAllowanceQuery, usdtApprove]);

  // Add liquidity hook
  const addLp = useAddLiquidity();
  useEffect(() => {
    if (addLp.isSuccess && pendingAdd) {
      addToast({
        type: "success",
        title: t("liq.addSuccess"),
        message: t("liq.addSuccessMsg"),
      });
      setKkdaInput("");
      setUsdtInput("");
      setPendingAdd(false);
      refetchPair();
      refetchReserves();
      addLp.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLp.isSuccess, pendingAdd]);

  function handleApproveKkda() {
    if (!kkdaWei) return;
    kkdaApprove.approve(PANCAKE_ROUTER as Address, kkdaWei);
  }
  function handleApproveUsdt() {
    if (!usdtWei) return;
    usdtApprove.approve(PANCAKE_ROUTER as Address, usdtWei);
  }
  function handleAddLiquidity() {
    if (!isConnected || !address) {
      addToast({
        type: "error",
        title: t("dex.walletNotConnected"),
        message: t("dex.walletNotConnectedMsg"),
      });
      return;
    }
    if (!kkdaWei || !usdtWei) {
      addToast({
        type: "error",
        title: t("dex.invalidAmount"),
        message: t("dex.invalidAmountMsg"),
      });
      return;
    }
    setPendingAdd(true);
    addLp.addLiquidity(
      KKDA_ADDRESS,
      USDT_ADDRESS,
      kkdaWei,
      usdtWei,
      address,
    );
  }

  const fmtBalance = (b: bigint | undefined) =>
    b ? Number(formatUnits(b, 18)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0";

  const implicitPrice =
    kkdaInput && usdtInput && Number(kkdaInput) > 0
      ? Number(usdtInput) / Number(kkdaInput)
      : null;

  const txState = pendingAdd
    ? addLp
    : kkdaApprove.isPending || kkdaApprove.isConfirming
      ? kkdaApprove
      : usdtApprove;

  return (
    <div className="page-padding space-y-10">
      {/* Header */}
      <motion.header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b-[0.5px] border-outline-variant pb-6"
        {...fade}
      >
        <div>
          <h1 className="font-headline text-4xl text-on-surface tracking-tight">
            {t("liq.title")}
          </h1>
          <p className="font-body text-outline mt-2 max-w-2xl">
            {t("liq.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.15em]">
          <span className="text-outline">{t("dex.network")}:</span>
          <span className="text-secondary">BSC · BEP-20</span>
        </div>
      </motion.header>

      {/* Pool status */}
      <motion.section
        className="bg-surface-container-low border-[0.5px] border-outline-variant p-6"
        {...fade}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary-container flex items-center justify-center shrink-0">
              <Droplets className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-headline text-base text-on-surface">
                {t("dex.poolKkdaUsdt")}
              </h3>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] mt-1">
                {pairLoading ? (
                  <span className="text-outline">…</span>
                ) : exists ? (
                  <span className="text-secondary">● {t("dex.poolStatusLive")}</span>
                ) : (
                  <span className="text-error">● {t("dex.poolStatusPending")}</span>
                )}
              </p>
            </div>
          </div>
          {pair && (
            <a
              href={`https://testnet.bscscan.com/address/${pair}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label text-[10px] uppercase tracking-[0.15em] text-outline hover:text-primary transition-colors flex items-center gap-1"
            >
              {t("liq.viewPair")}
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {exists && kkdaReserve !== undefined && usdtReserve !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-outline-variant/15">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                {t("liq.reserveKkda")}
              </p>
              <p className="font-headline text-lg text-on-surface">
                {fmtBalance(kkdaReserve)} <span className="text-sm text-outline">KKDA</span>
              </p>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                {t("liq.reserveUsdt")}
              </p>
              <p className="font-headline text-lg text-on-surface">
                {fmtBalance(usdtReserve)} <span className="text-sm text-outline">USDT</span>
              </p>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                {t("liq.priceImplied")}
              </p>
              <p className="font-headline text-lg text-primary">
                {reserveRatio
                  ? `$${reserveRatio.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                  : "—"}
                <span className="text-sm text-outline ml-1">/ KKDA</span>
              </p>
            </div>
          </div>
        )}
      </motion.section>

      {/* Add Liquidity Form */}
      <motion.section
        className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-6"
        {...fade}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-headline text-xl text-on-surface">
          {exists ? t("liq.addMore") : t("liq.seedInitial")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline flex justify-between">
              <span>KKDA {t("liq.amount")}</span>
              <span className="normal-case tracking-normal">
                {t("dex.balance")}: {fmtBalance(kkdaBalance)}
              </span>
            </label>
            <input
              value={kkdaInput}
              onChange={(e) => setKkdaInput(e.target.value)}
              placeholder="e.g. 1000000"
              type="number"
              step="any"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline flex justify-between">
              <span>USDT {t("liq.amount")}</span>
              <span className="normal-case tracking-normal">
                {t("dex.balance")}: {fmtBalance(usdtBalance)}
              </span>
            </label>
            <input
              value={usdtInput}
              onChange={(e) => setUsdtInput(e.target.value)}
              placeholder="e.g. 50000"
              type="number"
              step="any"
              className={inputClass}
            />
          </div>
        </div>

        {/* Implied price */}
        {implicitPrice !== null && (
          <div className="flex items-center justify-between bg-surface-container-high border-[0.5px] border-outline-variant px-4 py-3">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              {t("liq.priceWillBe")}
            </span>
            <span className="font-headline text-lg text-primary">
              ${implicitPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              <span className="text-xs text-outline ml-1">/ KKDA</span>
            </span>
          </div>
        )}

        {/* Tx status */}
        <TxStatus
          hash={
            addLp.hash ?? kkdaApprove.hash ?? usdtApprove.hash
          }
          isPending={txState.isPending}
          isConfirming={txState.isConfirming}
          isSuccess={addLp.isSuccess && pendingAdd}
          isError={addLp.isError || kkdaApprove.isError || usdtApprove.isError}
          error={addLp.error || kkdaApprove.error || usdtApprove.error}
        />

        {/* 3-step action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1: Approve KKDA */}
          <button
            onClick={handleApproveKkda}
            disabled={
              !isConnected ||
              !kkdaWei ||
              !needsKkdaApproval ||
              kkdaApprove.isPending ||
              kkdaApprove.isConfirming
            }
            className={`py-3 px-4 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
              !needsKkdaApproval && kkdaWei
                ? "bg-secondary/10 text-secondary border-secondary/40"
                : "bg-primary/10 text-primary border-primary/40 hover:bg-primary/20"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {kkdaApprove.isPending
              ? t("dex.approving")
              : kkdaApprove.isConfirming
                ? t("dex.confirmingApproval")
                : !needsKkdaApproval && kkdaWei
                  ? `✓ KKDA ${t("liq.approved")}`
                  : `1. ${t("liq.approveKkda")}`}
          </button>

          {/* Step 2: Approve USDT */}
          <button
            onClick={handleApproveUsdt}
            disabled={
              !isConnected ||
              !usdtWei ||
              !needsUsdtApproval ||
              usdtApprove.isPending ||
              usdtApprove.isConfirming
            }
            className={`py-3 px-4 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
              !needsUsdtApproval && usdtWei
                ? "bg-secondary/10 text-secondary border-secondary/40"
                : "bg-primary/10 text-primary border-primary/40 hover:bg-primary/20"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {usdtApprove.isPending
              ? t("dex.approving")
              : usdtApprove.isConfirming
                ? t("dex.confirmingApproval")
                : !needsUsdtApproval && usdtWei
                  ? `✓ USDT ${t("liq.approved")}`
                  : `2. ${t("liq.approveUsdt")}`}
          </button>

          {/* Step 3: Add Liquidity */}
          <button
            onClick={handleAddLiquidity}
            disabled={
              !isConnected ||
              !kkdaWei ||
              !usdtWei ||
              needsKkdaApproval ||
              needsUsdtApproval ||
              addLp.isPending ||
              addLp.isConfirming
            }
            className="btn-gradient disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {addLp.isPending
              ? t("dex.awaitingSig")
              : addLp.isConfirming
                ? t("dex.confirming")
                : `3. ${exists ? t("liq.addMoreShort") : t("liq.seedShort")}`}
          </button>
        </div>

        <p className="font-body text-xs text-on-surface-variant leading-relaxed">
          {t("liq.helpText")}
        </p>
      </motion.section>
    </div>
  );
}

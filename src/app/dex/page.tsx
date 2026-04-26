"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useStore } from "@/stores/useStore";
import {
  useSwapQuote,
  useSwapExactTokensForTokens,
  KKDA_ADDRESS,
  USDT_ADDRESS,
  WBNB_ADDRESS,
} from "@/hooks/useSwap";
import { useTokenBalance, useTokenApprove } from "@/hooks/useTokenContract";
import { PANCAKE_ROUTER } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";
import { useReadContract } from "wagmi";
import { KKD_TOKEN_ABI } from "@/lib/web3/contracts";
import { useT } from "@/lib/i18n/useT";
import {
  ArrowUpDown,
  ChevronDown,
  Settings,
  Droplets,
  Waves,
  ArrowRight,
} from "lucide-react";
import type { Address } from "viem";

const TIME_PERIODS = ["1D", "1W", "1M", "1Y", "ALL"] as const;
type Period = (typeof TIME_PERIODS)[number];

function useBarHeights(count: number) {
  return useMemo(() => {
    // Deterministic pseudo-random so the chart is stable across renders
    // (React 19 strict mode calls render twice; Math.random would diverge).
    const heights: number[] = [];
    let base = 40;
    for (let i = 0; i < count; i++) {
      const noise = Math.sin(i * 12.9898) * 43758.5453;
      const pseudo = noise - Math.floor(noise); // [0,1)
      base += Math.sin(i * 0.4) * 15 + (pseudo - 0.5) * 20;
      heights.push(Math.max(15, Math.min(95, base)));
    }
    return heights;
  }, [count]);
}

/* ---------- Exchange Widget (PancakeSwap V2 — USDT only DEX) ---------- */
function ExchangeWidget() {
  const { address, isConnected } = useAccount();
  const addToast = useStore((s) => s.addToast);
  const t = useT();

  // Swap direction: true = USDT → KKDA (buy), false = KKDA → USDT (sell)
  const [usdtToKkda, setUsdtToKkda] = useState(true);
  const [payAmount, setPayAmount] = useState("");
  const [slippage] = useState(0.005); // 0.5%

  // Live balances
  const { balance: usdtBalance } = useTokenBalance(USDT_ADDRESS, address);
  const { balance: kkdaBalance } = useTokenBalance(KKDA_ADDRESS, address);

  // Decimals (BSC USDT and KKDA both use 18)
  const decimalsQuery = useReadContract({
    address: KKDA_ADDRESS,
    abi: KKD_TOKEN_ABI,
    functionName: "decimals",
  });
  const decimals = (decimalsQuery.data as number | undefined) ?? 18;
  const USDT_DECIMALS = 18;

  const inDecimals = usdtToKkda ? USDT_DECIMALS : decimals;
  const outDecimals = usdtToKkda ? decimals : USDT_DECIMALS;

  // Parse user input → wei
  const amountIn = useMemo(() => {
    if (!payAmount) return undefined;
    try {
      return parseUnits(payAmount, inDecimals);
    } catch {
      return undefined;
    }
  }, [payAmount, inDecimals]);

  // Path: KKDA↔USDT via WBNB (multi-hop, since direct pair often missing on testnet)
  const path = useMemo(() => {
    return usdtToKkda
      ? ([USDT_ADDRESS, WBNB_ADDRESS, KKDA_ADDRESS] as Address[])
      : ([KKDA_ADDRESS, WBNB_ADDRESS, USDT_ADDRESS] as Address[]);
  }, [usdtToKkda]);

  const { amountOut, isLoading: quoting, isError: quoteFailed } = useSwapQuote(
    amountIn,
    path,
  );

  // Format quote for display
  const receiveDisplay = useMemo(() => {
    if (!amountOut) return "";
    return Number(formatUnits(amountOut, outDecimals)).toFixed(4);
  }, [amountOut, outDecimals]);

  // Min received with slippage
  const minOut = useMemo(() => {
    if (!amountOut) return BigInt(0);
    const slippageBps = BigInt(Math.floor((1 - slippage) * 10_000));
    return (amountOut * slippageBps) / BigInt(10_000);
  }, [amountOut, slippage]);

  // Approval — every direction needs it (ERC20→ERC20)
  const inputTokenAddress: Address = usdtToKkda ? USDT_ADDRESS : KKDA_ADDRESS;

  const {
    approve,
    hash: approveHash,
    isPending: approvePending,
    isConfirming: approveConfirming,
    isSuccess: approveSuccess,
    isError: approveIsError,
    error: approveError,
    reset: approveReset,
  } = useTokenApprove(inputTokenAddress);

  const allowanceQuery = useReadContract({
    address: inputTokenAddress,
    abi: KKD_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, PANCAKE_ROUTER as Address] : undefined,
    query: { enabled: !!address },
  });
  const allowance = (allowanceQuery.data as bigint | undefined) ?? BigInt(0);
  const needsApproval = amountIn !== undefined && allowance < amountIn;

  // Refetch allowance after approval succeeds
  useEffect(() => {
    if (approveSuccess) {
      allowanceQuery.refetch();
      approveReset();
    }
  }, [approveSuccess, allowanceQuery, approveReset]);

  // Swap hook
  const swapTx = useSwapExactTokensForTokens();

  // Reset on success — bridging wagmi tx state into local UI state.
  useEffect(() => {
    if (swapTx.isSuccess) {
      setPayAmount("");
      addToast({
        type: "success",
        title: t("dex.swapConfirmed"),
        message: t("dex.swapConfirmedMsg"),
      });
      swapTx.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapTx.isSuccess]);

  function handleSwap() {
    if (!isConnected || !address) {
      addToast({
        type: "error",
        title: t("dex.walletNotConnected"),
        message: t("dex.walletNotConnectedMsg"),
      });
      return;
    }
    if (!amountIn || !amountOut) {
      addToast({
        type: "error",
        title: t("dex.invalidAmount"),
        message: t("dex.invalidAmountMsg"),
      });
      return;
    }

    swapTx.swap(amountIn, minOut, path, address);
  }

  function handleApprove() {
    if (!amountIn) return;
    approve(PANCAKE_ROUTER as Address, amountIn);
  }

  const payBalance = usdtToKkda
    ? usdtBalance
      ? formatUnits(usdtBalance, USDT_DECIMALS).slice(0, 10)
      : "0"
    : kkdaBalance
      ? formatUnits(kkdaBalance, decimals).slice(0, 10)
      : "0";

  const inputSymbol = usdtToKkda ? "USDT" : "KKDA";
  const outputSymbol = usdtToKkda ? "KKDA" : "USDT";

  return (
    <div className="bg-surface-container p-8 shadow-2xl relative border border-outline-variant/10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline text-lg text-primary">{t("dex.instantExchange")}</h3>
        <Settings className="text-white/40 cursor-pointer hover:text-primary" size={18} />
      </div>

      {/* Pay Input */}
      <div className="mb-4">
        <label className="font-label text-[10px] text-secondary uppercase tracking-widest mb-2 block">
          {t("dex.youPay")}
        </label>
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 focus-within:border-primary transition-colors">
          <input
            className="bg-transparent border-none p-0 font-label text-2xl focus:ring-0 w-1/2 outline-none"
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <span className="font-body font-bold">{inputSymbol}</span>
            <ChevronDown size={16} />
          </div>
        </div>
        <p className="font-label text-[10px] text-white/20 mt-2">
          {t("dex.balance")}: {payBalance} {inputSymbol}
        </p>
      </div>

      {/* Swap Icon */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={() => {
            setUsdtToKkda((v) => !v);
            setPayAmount("");
          }}
          className="w-10 h-10 bg-surface-container border border-outline-variant/30 flex items-center justify-center hover:border-primary transition-colors cursor-pointer active:scale-90"
        >
          <ArrowUpDown className="text-primary" size={18} />
        </button>
      </div>

      {/* Receive Input */}
      <div className="mb-6">
        <label className="font-label text-[10px] text-secondary uppercase tracking-widest mb-2 block">
          {t("dex.youReceive")}
        </label>
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 focus-within:border-primary transition-colors">
          <input
            className="bg-transparent border-none p-0 font-label text-2xl focus:ring-0 w-1/2 outline-none"
            readOnly
            type="text"
            placeholder="0.0"
            value={quoting ? "..." : receiveDisplay}
          />
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <span className="font-body font-bold text-primary">${outputSymbol}</span>
            <ChevronDown size={16} className="text-primary" />
          </div>
        </div>
        {quoteFailed && payAmount && (
          <p className="font-label text-[10px] text-error mt-2 uppercase tracking-tighter">
            {t("dex.noLiquidity")}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-[11px] font-label uppercase tracking-tighter text-white/40">
          <span>{t("dex.minReceived")}</span>
          <span>
            {minOut ? Number(formatUnits(minOut, outDecimals)).toFixed(4) : "0"}{" "}
            {outputSymbol}
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-label uppercase tracking-tighter text-white/40">
          <span>{t("dex.slippage")}</span>
          <span>{(slippage * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-[11px] font-label uppercase tracking-tighter text-white/40">
          <span>{t("dex.router")}</span>
          <span>PancakeSwap V2</span>
        </div>
        <div className="flex justify-between text-[11px] font-label uppercase tracking-tighter text-white/40">
          <span>{t("dex.network")}</span>
          <span className="text-secondary">{t("dex.networkValue")}</span>
        </div>
      </div>

      <TxStatus
        hash={swapTx.hash ?? approveHash}
        isPending={swapTx.isPending || approvePending}
        isConfirming={swapTx.isConfirming || approveConfirming}
        isSuccess={swapTx.isSuccess}
        isError={swapTx.isError || approveIsError}
        error={swapTx.error || approveError}
      />

      {needsApproval ? (
        <button
          onClick={handleApprove}
          disabled={!isConnected || approvePending || approveConfirming}
          className="w-full bg-gradient-to-br from-secondary to-secondary/60 text-on-secondary py-4 font-label font-bold uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-4"
        >
          {approvePending
            ? t("dex.approving")
            : approveConfirming
              ? t("dex.confirmingApproval")
              : `${t("dex.approveBtn")} ${inputSymbol}`}
        </button>
      ) : (
        <button
          onClick={handleSwap}
          disabled={
            !isConnected ||
            !amountOut ||
            quoting ||
            quoteFailed ||
            swapTx.isPending ||
            swapTx.isConfirming
          }
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 font-label font-bold uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-4"
        >
          {!isConnected
            ? t("common.connectWallet")
            : swapTx.isPending
              ? t("dex.awaitingSig")
              : swapTx.isConfirming
                ? t("dex.confirming")
                : t("dex.executeTrade")}
        </button>
      )}
    </div>
  );
}

/* ---------- Liquidity Pool Card ---------- */
function LiquidityPoolCard({
  title,
  apy,
  icon,
}: {
  title: string;
  apy: string;
  icon: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="bg-surface-container-highest p-6 flex justify-between items-center group cursor-pointer hover:bg-outline-variant/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-tertiary-container flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-body font-bold text-white">{title}</h4>
          <p className="font-label text-[10px] text-white/40 uppercase tracking-widest">
            {t("dex.apy")}: {apy}
          </p>
        </div>
      </div>
      <ArrowRight
        className="text-primary group-hover:translate-x-1 transition-transform"
        size={20}
      />
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function DexPage() {
  const tokens = useStore((s) => s.tokens);
  const [period, setPeriod] = useState<Period>("1D");
  const barHeights = useBarHeights(10);
  const t = useT();

  const kkda = tokens.find((t) => t.symbol === "KKDA");
  const price = kkda?.price ?? 4281.9;
  const change = kkda?.change24h ?? 5.24;

  return (
    <div className="page-padding">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Chart & Market Data */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-headline text-4xl text-primary mb-2"
              >
                {t("dex.pair")}
              </motion.h1>
              <p className="font-label text-secondary text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                {t("dex.provenanceVerified")} &bull; 0x4f2...3a92
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="font-label text-3xl font-bold text-white tracking-tighter">
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <p className="font-label text-secondary text-sm">
                +{change.toFixed(2)}% (24H)
              </p>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-surface-container-low p-8 border-l border-primary/20 aspect-[16/8] relative overflow-hidden">
            <div className="absolute inset-0 chart-gradient" />
            <div className="relative h-full w-full flex flex-col">
              <div className="flex justify-between text-[10px] font-label text-white/20 uppercase tracking-widest mb-4">
                <span>{t("dex.performanceIndex")}</span>
                <div className="flex gap-4">
                  {TIME_PERIODS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`cursor-pointer ${
                        period === p
                          ? "text-primary underline underline-offset-4"
                          : "hover:text-white/40"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex items-end gap-1">
                {barHeights.map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`w-full ${
                      i === barHeights.length - 1
                        ? "bg-primary border-t-2 border-primary"
                        : "bg-primary/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Liquidity Pools */}
          <section>
            <h2 className="font-headline text-xl text-primary mb-6">
              {t("dex.liquidityReservoirs")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LiquidityPoolCard
                title="KKDA-USDT"
                apy="12.1%"
                icon={<Droplets className="text-primary" />}
              />
              <LiquidityPoolCard
                title="USDT-WBNB"
                apy="6.8%"
                icon={<Waves className="text-primary" />}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Exchange Interface */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <ExchangeWidget />

          {/* Provenance Info */}
          <div className="bg-surface-container-low p-8 opacity-60">
            <h5 className="font-headline text-sm text-primary mb-4 italic">
              {t("dex.mastersNote")}
            </h5>
            <p className="font-body text-xs leading-relaxed text-white/60">
              {t("dex.mastersNoteText")}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-primary" />
              <span className="font-label text-[10px] uppercase tracking-widest text-primary">
                {t("dex.chiefCurator")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

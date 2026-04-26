"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { parseUnits, formatUnits, type Address } from "viem";
import { useStore } from "@/stores/useStore";
import { useT } from "@/lib/i18n/useT";
import {
  useStake,
  useUnstake,
  useClaimRewards,
  useStakedBalance,
  usePendingRewards,
  useStakingInfo,
} from "@/hooks/useStaking";
import { useTokenBalance, useTokenApprove } from "@/hooks/useTokenContract";
import { KKDA_ADDRESS } from "@/hooks/useSwap";
import { ADDRESSES, KKD_TOKEN_ABI } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";
import { ExternalLink } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function formatUsd(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

const STAKING_ADDRESS = ADDRESSES.STAKING as Address;

export default function StakingPage() {
  const t = useT();
  const stakingPools = useStore((s) => s.stakingPools);
  const tokens = useStore((s) => s.tokens);
  const addToast = useStore((s) => s.addToast);

  const { address, isConnected } = useAccount();
  const kkda = tokens.find((tk) => tk.symbol === "KKDA");
  const kkdaPrice = kkda?.price ?? 0.05;

  // ── Live data from STAKING contract (pool-1) ─────────────────────
  const live = useStakingInfo();
  const liveTotalStakedKkda =
    live.totalStaked !== undefined
      ? Number(formatUnits(live.totalStaked, 18))
      : undefined;
  const liveApy =
    live.apyRate !== undefined ? Number(live.apyRate) / 100 : undefined; // assume basis points
  const liveLockDays =
    live.lockPeriodSeconds !== undefined
      ? Math.round(live.lockPeriodSeconds / 86400)
      : undefined;
  const liveMinStakeKkda =
    live.minStake !== undefined ? Number(formatUnits(live.minStake, 18)) : undefined;

  // ── User-side reads (only when connected) ────────────────────────
  const { staked: userStakedRaw } = useStakedBalance(address as Address | undefined);
  const { rewards: userRewardsRaw } = usePendingRewards(address as Address | undefined);
  const userStakedKkda = userStakedRaw ? Number(formatUnits(userStakedRaw, 18)) : 0;
  const userRewardsKkda = userRewardsRaw ? Number(formatUnits(userRewardsRaw, 18)) : 0;
  const userStakedUsd = userStakedKkda * kkdaPrice;
  const userRewardsUsd = userRewardsKkda * kkdaPrice;

  // ── Pool-1 effective values (live overlay or fallback) ───────────
  const pool1 = stakingPools[0];
  const pool1Tvl = liveTotalStakedKkda
    ? liveTotalStakedKkda * kkdaPrice
    : (pool1?.totalStakedUsd ?? 0);
  const pool1Apy = liveApy ?? pool1?.apy ?? 0;
  const pool1LockDays = liveLockDays ?? pool1?.lockDays ?? 0;
  const pool1MinStake = liveMinStakeKkda ?? pool1?.minStake ?? 0;

  // Aggregated TVL = pool1 (live or fallback) + pool2 + pool3 demos
  const totalStaked =
    pool1Tvl +
    (stakingPools[1]?.totalStakedUsd ?? 0) +
    (stakingPools[2]?.totalStakedUsd ?? 0);
  const avgApy =
    stakingPools.length > 0
      ? (pool1Apy +
          (stakingPools[1]?.apy ?? 0) +
          (stakingPools[2]?.apy ?? 0)) /
        stakingPools.length
      : 0;

  // ── Stake form state (pool-1 only) ───────────────────────────────
  const [stakeInput, setStakeInput] = useState("");
  const stakeWei = useMemo(() => {
    if (!stakeInput) return undefined;
    try { return parseUnits(stakeInput, 18); } catch { return undefined; }
  }, [stakeInput]);

  const { balance: kkdaBalance } = useTokenBalance(KKDA_ADDRESS, address);

  // Allowance for STAKING contract
  const allowanceQuery = useReadContract({
    address: KKDA_ADDRESS,
    abi: KKD_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, STAKING_ADDRESS] : undefined,
    query: { enabled: !!address },
  });
  const allowance = (allowanceQuery.data as bigint | undefined) ?? BigInt(0);
  const needsApproval = stakeWei !== undefined && allowance < stakeWei;

  const approve = useTokenApprove(KKDA_ADDRESS);
  const stake = useStake();
  const unstake = useUnstake();
  const claim = useClaimRewards();

  useEffect(() => {
    if (approve.isSuccess) {
      allowanceQuery.refetch();
      approve.reset();
    }
  }, [approve.isSuccess, allowanceQuery, approve]);

  useEffect(() => {
    if (stake.isSuccess) {
      addToast({
        type: "success",
        title: t("staking.successTitle"),
        message: t("staking.successMsg"),
      });
      setStakeInput("");
      stake.reset();
      live.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stake.isSuccess]);

  function handleApprove() {
    if (!stakeWei) return;
    approve.approve(STAKING_ADDRESS, stakeWei);
  }
  function handleStake() {
    if (!isConnected || !address) return;
    if (!stakeWei) return;
    stake.stake(stakeWei);
  }
  function handleUnstake() {
    if (!userStakedRaw) return;
    unstake.unstake(userStakedRaw);
  }
  function handleClaim() {
    claim.claimRewards();
  }

  const fmtKkda = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 4 });

  const summaryCards = [
    { label: t("staking.totalStaked"), value: formatUsd(totalStaked) },
    { label: t("staking.avgApy"), value: `${avgApy.toFixed(1)}%` },
    {
      label: t("staking.yourStaked"),
      value: isConnected ? formatUsd(userStakedUsd) : t("staking.notConnected"),
    },
    {
      label: t("staking.rewardsEarned"),
      value: isConnected ? formatUsd(userRewardsUsd) : t("staking.notConnected"),
    },
  ];

  const HOW_IT_WORKS = [
    { step: "01", title: t("staking.step1Title"), description: t("staking.step1Desc") },
    { step: "02", title: t("staking.step2Title"), description: t("staking.step2Desc") },
    { step: "03", title: t("staking.step3Title"), description: t("staking.step3Desc") },
  ];

  return (
    <div className="page-padding space-y-10">
      {/* ── Header ── */}
      <motion.header {...fade} transition={{ duration: 0.5 }}>
        <p className="label mb-3">{t("staking.kicker")}</p>
        <h1 className="font-headline text-4xl text-on-surface">
          {t("staking.title")}
        </h1>
      </motion.header>

      {/* ── Summary Row ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-5"
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-2">
              {card.label}
            </p>
            <p className="font-headline text-2xl text-on-surface">
              {card.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Tokenomics / APY Policy ── */}
      <motion.section
        className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-3"
        {...fade}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline text-base text-on-surface">
            {t("staking.tokenomicsTitle")}
          </h3>
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-secondary">
            {t("staking.formula")}
          </span>
        </div>
        <ul className="space-y-1.5 font-body text-xs text-on-surface-variant leading-relaxed">
          <li>· {t("staking.tokenomicsLine1")}</li>
          <li>· {t("staking.tokenomicsLine2")}</li>
          <li>· {t("staking.tokenomicsLine3")}</li>
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-outline-variant/15">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              KKDA Single · 30d
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              base 12% · no IL
            </p>
          </div>
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              KKDA-USDT LP · 90d
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              base × 2.0 = 24%
            </p>
          </div>
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              PUER-USDT LP · 180d
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              base × 1.5 = 18%
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── Pools List ── */}
      <div className="space-y-4">
        {stakingPools.map((pool, i) => {
          const isPool1 = i === 0;
          const effectiveTvl = isPool1 ? pool1Tvl : pool.totalStakedUsd;
          const effectiveApy = isPool1 ? pool1Apy : pool.apy;
          const effectiveLockDays = isPool1 ? pool1LockDays : pool.lockDays;
          const effectiveMinStake = isPool1 ? pool1MinStake : pool.minStake;

          const utilization = Math.min(
            (effectiveTvl / (effectiveTvl + 1_000_000)) * 100,
            95,
          );

          return (
            <motion.div
              key={pool.id}
              className="bg-surface-container-low border-[0.5px] border-outline-variant p-6"
              {...fade}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Pool Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-headline text-lg text-on-surface">
                      {pool.name}
                    </h3>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-secondary border-[0.5px] border-secondary/40 px-2 py-0.5">
                      {pool.pair}
                    </span>
                    {isPool1 ? (
                      <span className="font-label text-[10px] uppercase tracking-[0.15em] text-secondary px-2 py-0.5 bg-secondary/10 border-[0.5px] border-secondary/40">
                        ● {t("staking.live")}
                      </span>
                    ) : (
                      <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline px-2 py-0.5 bg-outline/10 border-[0.5px] border-outline/40">
                        {t("staking.comingSoon")}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-on-surface-variant font-body">
                    <span>
                      {t("staking.tvl")}:{" "}
                      <span className="text-on-surface">
                        {formatUsd(effectiveTvl)}
                      </span>
                    </span>
                    <span>
                      {t("staking.minStake")}:{" "}
                      <span className="text-on-surface">
                        {effectiveMinStake.toLocaleString()}
                      </span>
                    </span>
                    <span>
                      {t("staking.lock")}:{" "}
                      <span className="text-on-surface">
                        {effectiveLockDays} {t("staking.lockDays")}
                      </span>
                    </span>
                    <span>
                      {t("staking.reward")}:{" "}
                      <span className="text-on-surface">
                        {pool.rewardToken}
                      </span>
                    </span>
                    {isPool1 && (
                      <a
                        href={`https://testnet.bscscan.com/address/${STAKING_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                      >
                        {t("staking.viewContract")}
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                {/* APY */}
                <div className="text-center lg:text-right shrink-0">
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                    {t("dex.apy")}
                  </p>
                  <p className="font-headline text-3xl text-primary">
                    {effectiveApy.toFixed(1)}%
                  </p>
                </div>

                {/* Action — pool-1 only is interactive */}
                <div className="shrink-0 w-full lg:w-auto">
                  {isPool1 ? (
                    isConnected ? (
                      <div className="space-y-2 w-full lg:w-64">
                        <input
                          type="number"
                          step="any"
                          value={stakeInput}
                          onChange={(e) => setStakeInput(e.target.value)}
                          placeholder={t("staking.stakeAmount")}
                          className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
                        />
                        <p className="font-label text-[9px] uppercase tracking-[0.15em] text-outline">
                          {t("dex.balance")}: {fmtKkda(kkdaBalance ? Number(formatUnits(kkdaBalance, 18)) : 0)} KKDA
                        </p>
                        {needsApproval ? (
                          <button
                            onClick={handleApprove}
                            disabled={!stakeWei || approve.isPending || approve.isConfirming}
                            className="btn-gradient w-full disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {approve.isPending
                              ? t("staking.signing")
                              : approve.isConfirming
                                ? t("staking.confirmingApprove")
                                : t("staking.approve")}
                          </button>
                        ) : (
                          <button
                            onClick={handleStake}
                            disabled={!stakeWei || stake.isPending || stake.isConfirming}
                            className="btn-gradient w-full disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {stake.isPending
                              ? t("staking.signing")
                              : stake.isConfirming
                                ? t("staking.confirmingStake")
                                : t("staking.stakeNow")}
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        disabled
                        className="btn-gradient w-full lg:w-auto opacity-50 cursor-not-allowed"
                      >
                        {t("staking.connect")}
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      title={t("staking.contractPending")}
                      className="btn-gradient w-full lg:w-auto opacity-30 cursor-not-allowed"
                    >
                      {t("staking.comingSoon")}
                    </button>
                  )}
                </div>
              </div>

              {/* User position (pool-1 only when staked) */}
              {isPool1 && isConnected && userStakedKkda > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant/15 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-6 text-xs text-on-surface-variant font-body">
                    <span>
                      {t("staking.yourStaked")}:{" "}
                      <span className="text-primary font-headline text-base">
                        {fmtKkda(userStakedKkda)} KKDA
                      </span>{" "}
                      ({formatUsd(userStakedUsd)})
                    </span>
                    <span>
                      {t("staking.rewardsEarned")}:{" "}
                      <span className="text-secondary font-headline text-base">
                        {fmtKkda(userRewardsKkda)} KKDA
                      </span>{" "}
                      ({formatUsd(userRewardsUsd)})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClaim}
                      disabled={
                        userRewardsKkda === 0 || claim.isPending || claim.isConfirming
                      }
                      className="px-4 py-2 bg-secondary/10 text-secondary border-[0.5px] border-secondary/40 font-label text-[10px] uppercase tracking-[0.15em] hover:bg-secondary/20 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {claim.isPending || claim.isConfirming
                        ? t("staking.signing")
                        : t("staking.claim")}
                    </button>
                    <button
                      onClick={handleUnstake}
                      disabled={
                        userStakedKkda === 0 || unstake.isPending || unstake.isConfirming
                      }
                      className="px-4 py-2 bg-error/10 text-error border-[0.5px] border-error/40 font-label text-[10px] uppercase tracking-[0.15em] hover:bg-error/20 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {unstake.isPending || unstake.isConfirming
                        ? t("staking.signing")
                        : t("staking.unstake")}
                    </button>
                  </div>
                </div>
              )}

              {/* Tx status (pool-1 only) */}
              {isPool1 && (
                <TxStatus
                  hash={
                    stake.hash ?? approve.hash ?? unstake.hash ?? claim.hash
                  }
                  isPending={
                    stake.isPending || approve.isPending || unstake.isPending || claim.isPending
                  }
                  isConfirming={
                    stake.isConfirming ||
                    approve.isConfirming ||
                    unstake.isConfirming ||
                    claim.isConfirming
                  }
                  isSuccess={false}
                  isError={
                    stake.isError || approve.isError || unstake.isError || claim.isError
                  }
                  error={stake.error || approve.error || unstake.error || claim.error}
                />
              )}

              {/* Utilization Bar */}
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {t("staking.poolUtilization")}
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
                    {utilization.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-surface-container-high overflow-hidden">
                  <motion.div
                    className="h-full bg-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${utilization}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── How Staking Works ── */}
      <motion.section
        className="space-y-6"
        {...fade}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          {t("staking.howItWorks")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-3"
            >
              <span className="font-headline text-3xl text-outline-variant">
                {item.step}
              </span>
              <h4 className="font-headline text-base text-on-surface">
                {item.title}
              </h4>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

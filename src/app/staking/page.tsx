"use client";

import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { useT } from "@/lib/i18n/useT";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function formatUsd(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function StakingPage() {
  const t = useT();
  const stakingPools = useStore((s) => s.stakingPools);
  const user = useStore((s) => s.user);

  const HOW_IT_WORKS = [
    {
      step: "01",
      title: t("staking.step1Title"),
      description: t("staking.step1Desc"),
    },
    {
      step: "02",
      title: t("staking.step2Title"),
      description: t("staking.step2Desc"),
    },
    {
      step: "03",
      title: t("staking.step3Title"),
      description: t("staking.step3Desc"),
    },
  ];

  const totalStaked = stakingPools.reduce((s, p) => s + p.totalStakedUsd, 0);
  const avgApy =
    stakingPools.length > 0
      ? stakingPools.reduce((s, p) => s + p.apy, 0) / stakingPools.length
      : 0;

  const summaryCards = [
    { label: t("staking.totalStaked"), value: formatUsd(totalStaked) },
    { label: t("staking.avgApy"), value: `${avgApy.toFixed(1)}%` },
    { label: t("staking.yourStaked"), value: formatUsd(user.stakedValue) },
    { label: t("staking.rewardsEarned"), value: "$1,248" },
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

      {/* ── Pools List ── */}
      <div className="space-y-4">
        {stakingPools.map((pool, i) => {
          const utilization = Math.min(
            (pool.totalStaked / (pool.totalStaked + 1_000_000)) * 100,
            95
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
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-headline text-lg text-on-surface">
                      {pool.name}
                    </h3>
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-secondary border-[0.5px] border-secondary/40 px-2 py-0.5">
                      {pool.pair}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-xs text-on-surface-variant font-body">
                    <span>
                      {t("staking.tvl")}:{" "}
                      <span className="text-on-surface">
                        {formatUsd(pool.totalStakedUsd)}
                      </span>
                    </span>
                    <span>
                      {t("staking.minStake")}:{" "}
                      <span className="text-on-surface">
                        {pool.minStake.toLocaleString()}
                      </span>
                    </span>
                    <span>
                      {t("staking.lock")}:{" "}
                      <span className="text-on-surface">
                        {pool.lockDays} {t("staking.lockDays")}
                      </span>
                    </span>
                    <span>
                      {t("staking.reward")}:{" "}
                      <span className="text-on-surface">
                        {pool.rewardToken}
                      </span>
                    </span>
                  </div>
                </div>

                {/* APY */}
                <div className="text-center lg:text-right shrink-0">
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                    {t("dex.apy")}
                  </p>
                  <p className="font-headline text-3xl text-primary">
                    {pool.apy}%
                  </p>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  <button className="btn-gradient w-full lg:w-auto">
                    {t("staking.stakeNow")}
                  </button>
                </div>
              </div>

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

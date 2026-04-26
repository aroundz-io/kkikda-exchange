"use client";

import { useStore } from "@/stores/useStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, MoreVertical, Waves } from "lucide-react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { useTokenBalance } from "@/hooks/useTokenContract";
import { USDT_ADDRESS } from "@/hooks/useSwap";
import { useT } from "@/lib/i18n/useT";

type FilterTab = "all" | "tea" | "liquidity";

export default function HomePage() {
  const { user, teaCakes } = useStore();
  const [filter, setFilter] = useState<FilterTab>("all");
  const t = useT();

  const { address, isConnected } = useAccount();
  const { balance: usdtBalance } = useTokenBalance(USDT_ADDRESS, address);
  const usdtDisplay = usdtBalance
    ? Number(formatUnits(usdtBalance, 18)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  return (
    <div className="page-padding">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-4xl text-on-surface mb-2">
            {t("home.title")}
          </h1>
          <p className="font-body text-outline max-w-lg">
            {t("home.subtitle")}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="font-label text-[10px] text-outline uppercase tracking-[0.2em] mb-1">
            {t("home.globalBalance")}
          </p>
          {isConnected ? (
            <p className="font-label text-4xl text-primary font-bold">
              {usdtDisplay}{" "}
              <span className="text-xl font-light text-on-primary-container">
                USDT
              </span>
            </p>
          ) : (
            <p className="font-label text-4xl text-primary font-bold">
              142,850.42{" "}
              <span className="text-xl font-light text-on-primary-container">
                USDT
              </span>
            </p>
          )}
        </div>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        {/* P&L Card */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div>
            <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
              {t("home.totalPnl")}
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-label text-secondary font-bold">
                +{user.pnl.toLocaleString()}
              </h2>
              <span className="text-secondary text-sm font-label">
                (+{user.pnlPercent}%)
              </span>
            </div>
          </div>
          <div className="mt-8">
            <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-secondary"
              />
            </div>
            <p className="text-[10px] font-label text-outline mt-2 uppercase tracking-widest">
              {t("home.monthlyTarget")}
            </p>
          </div>
        </div>

        {/* Staking Accrual */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-highest p-8">
          <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
            {t("home.stakingAccrual")}
          </p>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-label text-primary font-bold">
              4.20 <span className="text-lg font-light">$KKDA</span>
            </h2>
            <p className="text-outline text-xs font-body">
              {t("home.annualYield")}: 8.42%
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="text-[10px] font-label uppercase tracking-widest text-primary border-b-[0.5px] border-primary pb-1 hover:opacity-70 transition-opacity">
              {t("home.claimRewards")}
            </button>
            <button className="text-[10px] font-label uppercase tracking-widest text-on-surface border-b-[0.5px] border-outline-variant pb-1 hover:opacity-70 transition-opacity">
              {t("home.compound")}
            </button>
          </div>
        </div>

        {/* Security Status */}
        <div className="col-span-12 lg:col-span-4 relative overflow-hidden bg-surface-container-low p-8 flex flex-col justify-between">
          <div className="relative z-10">
            <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
              {t("home.securityStatus")}
            </p>
            <h2 className="text-xl font-headline text-on-surface mb-2">
              {t("home.tier2Verification")}
            </h2>
            <p className="text-xs text-outline font-body mb-6">
              {t("home.tier3Pitch")}
            </p>
          </div>
          <button className="relative z-10 w-fit font-label text-[10px] font-bold uppercase tracking-widest px-6 py-2 border-[0.5px] border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all">
            {t("home.startUpgrade")}
          </button>
        </div>
      </div>

      {/* Asset Categories Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h3 className="font-headline text-2xl text-on-surface">
            {t("home.digitalAssets")}
          </h3>
          <div className="flex gap-4">
            {(["all", "tea", "liquidity"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1 text-[10px] font-label uppercase tracking-widest transition-colors ${
                  filter === tab
                    ? "bg-primary text-on-primary"
                    : "border-[0.5px] border-outline-variant text-outline hover:text-on-surface"
                }`}
              >
                {tab === "all"
                  ? t("home.allAssets")
                  : tab === "tea"
                    ? t("home.teaCakes")
                    : t("home.liquidity")}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-[0.5px] border-outline-variant">
                <th className="pb-4 font-label text-[10px] uppercase tracking-widest text-outline">
                  {t("home.assetClass")}
                </th>
                <th className="pb-4 font-label text-[10px] uppercase tracking-widest text-outline">
                  {t("home.allocation")}
                </th>
                <th className="pb-4 font-label text-[10px] uppercase tracking-widest text-outline">
                  {t("home.marketValue")}
                </th>
                <th className="pb-4 font-label text-[10px] uppercase tracking-widest text-outline">
                  {t("home.pnl24h")}
                </th>
                <th className="pb-4 font-label text-[10px] uppercase tracking-widest text-outline text-right">
                  {t("home.action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-[0.5px] divide-outline-variant/10">
              {/* KKDA Heritage Token */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-container flex items-center justify-center">
                      <span className="text-primary font-bold font-label">
                        K
                      </span>
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold">
                        {t("home.heritageToken")}
                      </p>
                      <p className="text-[10px] font-label text-outline">
                        {t("home.utilityToken")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-6 font-label text-sm">45,000.00</td>
                <td className="py-6 font-label text-sm">$82,350.00</td>
                <td className="py-6 font-label text-sm text-secondary">
                  +2.4%
                </td>
                <td className="py-6 text-right">
                  <button className="text-outline group-hover:text-primary transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>

              {/* Tea Cake NFT */}
              {teaCakes.slice(0, 1).map((cake) => (
                <tr
                  key={cake.id}
                  className="hover:bg-surface-container-lowest transition-colors group"
                >
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-container overflow-hidden">
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[10px] text-primary font-label">
                            TEA
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-headline text-sm font-bold">
                          {cake.name}
                        </p>
                        <p className="text-[10px] font-label text-outline">
                          {t("home.vintageNftCake")} #{cake.tokenId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 font-label text-sm">1 Cake</td>
                  <td className="py-6 font-label text-sm">
                    ${cake.priceUsd.toLocaleString()}
                  </td>
                  <td className="py-6 font-label text-sm text-on-surface-variant">
                    --
                  </td>
                  <td className="py-6 text-right">
                    <button className="text-outline group-hover:text-primary transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* LP Position */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary-container flex items-center justify-center">
                      <Waves className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold">
                        LP-KKDA/USDT
                      </p>
                      <p className="text-[10px] font-label text-outline">
                        {t("home.lpProvision")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-6 font-label text-sm">1,240.40 LP</td>
                <td className="py-6 font-label text-sm">$15,500.42</td>
                <td className="py-6 font-label text-sm text-error">-1.2%</td>
                <td className="py-6 text-right">
                  <button className="text-outline group-hover:text-primary transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Provenance and Activity */}
      <div className="grid grid-cols-12 gap-10">
        {/* Provenance Timeline */}
        <div className="col-span-12 lg:col-span-8">
          <h3 className="font-headline text-2xl text-on-surface mb-8">
            {t("home.provenanceTimeline")}
          </h3>
          <div className="space-y-0 border-l-[0.5px] border-outline-variant border-dashed ml-2 pl-8">
            {[
              {
                date: "Dec 14, 2023",
                title: t("home.timeline.acquisitionTitle"),
                desc: t("home.timeline.acquisitionDesc"),
                active: true,
              },
              {
                date: "Nov 22, 2023",
                title: t("home.timeline.kycTitle"),
                desc: t("home.timeline.kycDesc"),
                active: false,
              },
              {
                date: "Oct 05, 2023",
                title: t("home.timeline.ledgerTitle"),
                desc: t("home.timeline.ledgerDesc"),
                active: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative pb-10 ${!item.active ? "opacity-60" : ""}`}
              >
                <div
                  className={`absolute -left-[37px] top-0 w-4 h-4 ${
                    item.active
                      ? "bg-primary"
                      : "border-[0.5px] border-outline-variant bg-surface"
                  }`}
                />
                <p
                  className={`font-label text-[10px] uppercase tracking-[0.2em] mb-1 ${
                    item.active ? "text-primary" : "text-outline"
                  }`}
                >
                  {item.date}
                </p>
                <h4 className="font-headline text-lg text-on-surface">
                  {item.title}
                </h4>
                <p className="text-sm text-outline font-body mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Curator's Insight */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-primary-container p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
            <h4 className="font-headline text-xl text-primary mb-4">
              {t("home.curatorInsight")}
            </h4>
            <p className="text-sm text-on-primary-container font-body leading-relaxed mb-6">
              {t("home.curatorQuote")}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[0.5px] bg-primary" />
              <span className="font-label text-[10px] text-primary uppercase tracking-widest">
                {t("home.heritageAdvisory")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

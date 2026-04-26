"use client";

import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TrendingUp, MoreVertical, Wallet, ShieldCheck, Coins, Boxes } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { useTokenBalance } from "@/hooks/useTokenContract";
import { USDT_ADDRESS, KKDA_ADDRESS } from "@/hooks/useSwap";
import { ADDRESSES } from "@/lib/web3/contracts";
import { useNFTBalance } from "@/hooks/useNFTContract";
import { useT } from "@/lib/i18n/useT";
import type { Address } from "viem";

type FilterTab = "all" | "tea" | "liquidity";

function fmtUsd(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export default function HomePage() {
  const { teaCakes, tokens, stakingPools, orders } = useStore();
  const [filter, setFilter] = useState<FilterTab>("all");
  const t = useT();

  const { address, isConnected } = useAccount();
  const { data: bnbBalance } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { balance: usdtBalance } = useTokenBalance(USDT_ADDRESS, address);
  const { balance: kkdaBalance } = useTokenBalance(KKDA_ADDRESS, address);
  const { balance: nftBalance } = useNFTBalance(address as Address | undefined);

  const kkda = tokens.find((t) => t.symbol === "KKDA");
  const kkdaPrice = kkda?.price ?? 0.05;

  // Live USD-equivalent values (connected only)
  const usdt = usdtBalance ? Number(formatUnits(usdtBalance, 18)) : 0;
  const kkdaQty = kkdaBalance ? Number(formatUnits(kkdaBalance, 18)) : 0;
  const bnb = bnbBalance ? Number(formatUnits(bnbBalance.value, 18)) : 0;
  const kkdaValueUsd = kkdaQty * kkdaPrice;
  const totalUsdValue = usdt + kkdaValueUsd; // BNB value not priced live; treat as gas only
  const nftCount = nftBalance ? Number(nftBalance) : 0;

  // Protocol-level stats (always available, used in disconnected state)
  const totalRwaUsd = teaCakes.reduce(
    (s, c) => s + c.priceUsd * (c.mintedUnits ?? 1),
    0,
  );
  const totalRwaUnits = teaCakes.reduce(
    (s, c) => s + (c.mintedUnits ?? 1),
    0,
  );
  const productCount = teaCakes.length;
  const avgApy =
    stakingPools.length > 0
      ? stakingPools.reduce((s, p) => s + p.apy, 0) / stakingPools.length
      : 0;

  // P&L from real orders (connected only)
  const pnl = useMemo(() => {
    const filled = orders.filter((o) => o.status === "filled");
    const buys = filled.filter((o) => o.type === "buy").reduce((s, o) => s + o.total, 0);
    const sells = filled.filter((o) => o.type === "sell").reduce((s, o) => s + o.total, 0);
    return sells - buys;
  }, [orders]);

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
            {isConnected ? t("home.globalBalance") : "Total Vault Value"}
          </p>
          {isConnected ? (
            <p className="font-label text-4xl text-primary font-bold">
              {totalUsdValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-xl font-light text-on-primary-container">
                USDT
              </span>
            </p>
          ) : (
            <p className="font-label text-4xl text-primary font-bold">
              {totalRwaUsd.toLocaleString()}{" "}
              <span className="text-xl font-light text-on-primary-container">
                USDT
              </span>
            </p>
          )}
        </div>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        {/* Card 1: P&L (connected) / Total RWA (disconnected) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {isConnected ? <TrendingUp className="w-24 h-24" /> : <Boxes className="w-24 h-24" />}
          </div>
          {isConnected ? (
            <>
              <div>
                <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
                  {t("home.totalPnl")}
                </p>
                <div className="flex items-baseline gap-2">
                  <h2
                    className={`text-3xl font-label font-bold ${
                      pnl >= 0 ? "text-secondary" : "text-error"
                    }`}
                  >
                    {pnl >= 0 ? "+" : ""}
                    {pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </h2>
                  <span
                    className={`text-sm font-label ${
                      pnl >= 0 ? "text-secondary" : "text-error"
                    }`}
                  >
                    USDT
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-label text-outline mt-8 uppercase tracking-widest">
                {orders.filter((o) => o.status === "filled").length} filled trades
              </p>
            </>
          ) : (
            <>
              <div>
                <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
                  Tokenized RWA
                </p>
                <h2 className="text-3xl font-label text-primary font-bold">
                  {fmtUsd(totalRwaUsd)}
                </h2>
                <p className="text-outline text-xs font-body mt-1">
                  {totalRwaUnits.toLocaleString()} NFTs · {productCount} products
                </p>
              </div>
              <p className="text-[10px] font-label text-outline mt-8 uppercase tracking-widest">
                BSC · BEP-20 · 1:1 minted
              </p>
            </>
          )}
        </div>

        {/* Card 2: Staking Accrual (connected) / Average APY (disconnected) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-highest p-8 flex flex-col justify-between">
          <div>
            <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
              {isConnected ? t("home.stakingAccrual") : "Staking Pools"}
            </p>
            {isConnected ? (
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-label text-primary font-bold">
                  0.00 <span className="text-lg font-light">$KKDA</span>
                </h2>
                <p className="text-outline text-xs font-body">
                  {t("home.annualYield")}: {avgApy.toFixed(2)}%
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-label text-primary font-bold">
                  {avgApy.toFixed(1)}
                  <span className="text-lg font-light">%</span>
                </h2>
                <p className="text-outline text-xs font-body">
                  Average APY across {stakingPools.length} pools
                </p>
              </div>
            )}
          </div>
          <Link
            href="/staking"
            className="text-[10px] font-label uppercase tracking-widest text-primary border-b-[0.5px] border-primary pb-1 hover:opacity-70 transition-opacity self-start mt-8"
          >
            View Staking
          </Link>
        </div>

        {/* Card 3: KKDA Token info (always real protocol data) */}
        <div className="col-span-12 lg:col-span-4 relative overflow-hidden bg-surface-container-low p-8 flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="font-label text-[10px] text-outline uppercase tracking-widest mb-4">
              KKDA Token
            </p>
            <h2 className="text-3xl font-label text-primary font-bold">
              ${kkdaPrice.toFixed(4)}
            </h2>
            <p className="text-xs text-outline font-body mt-1">
              Supply: {(kkda?.supply ?? 0).toLocaleString()} /{" "}
              {(kkda?.maxSupply ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-outline font-body mt-1">
              FDV: {fmtUsd((kkda?.maxSupply ?? 0) * kkdaPrice)}
            </p>
          </div>
          <Link
            href="/dex"
            className="relative z-10 w-fit font-label text-[10px] font-bold uppercase tracking-widest px-6 py-2 border-[0.5px] border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all mt-8"
          >
            Trade KKDA
          </Link>
        </div>
      </div>

      {/* Asset Categories Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h3 className="font-headline text-2xl text-on-surface">
            {t("home.digitalAssets")}
          </h3>
          {isConnected && (
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
          )}
        </div>

        {!isConnected ? (
          // Disconnected state — empty state CTA
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-12 flex flex-col items-center text-center gap-4">
            <Wallet className="w-10 h-10 text-primary" strokeWidth={1.5} />
            <h4 className="font-headline text-xl text-on-surface">
              Connect your wallet to view your holdings
            </h4>
            <p className="font-body text-sm text-on-surface-variant max-w-md">
              KKDA, USDT and Vintage Pu&apos;er NFTs in your BSC wallet will
              appear here once connected.
            </p>
          </div>
        ) : totalUsdValue === 0 && nftCount === 0 ? (
          <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-12 flex flex-col items-center text-center gap-4">
            <p className="font-body text-sm text-on-surface-variant">
              No assets in this wallet yet. Buy KKDA on the DEX or acquire
              Vintage Pu&apos;er NFTs to populate your portfolio.
            </p>
            <div className="flex gap-3">
              <Link
                href="/dex"
                className="px-4 py-2 border-[0.5px] border-primary text-primary text-[10px] font-label uppercase tracking-widest hover:bg-primary/10"
              >
                Open DEX
              </Link>
              <Link
                href="/nft"
                className="px-4 py-2 border-[0.5px] border-outline-variant text-outline text-[10px] font-label uppercase tracking-widest hover:text-on-surface"
              >
                Browse NFTs
              </Link>
            </div>
          </div>
        ) : (
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
                  <th className="pb-4 font-label text-[10px] uppercase tracking-widest text-outline text-right">
                    {t("home.action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-[0.5px] divide-outline-variant/10">
                {/* USDT row */}
                {usdt > 0 && (filter === "all" || filter === "liquidity") && (
                  <tr className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary-container flex items-center justify-center">
                          <span className="text-secondary font-bold font-label">
                            ₮
                          </span>
                        </div>
                        <div>
                          <p className="font-headline text-sm font-bold">
                            USDT
                          </p>
                          <p className="text-[10px] font-label text-outline">
                            BSC · BEP-20
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 font-label text-sm">
                      {usdt.toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}
                    </td>
                    <td className="py-6 font-label text-sm">
                      ${usdt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-6 text-right">
                      <Link
                        href="/dex"
                        className="text-outline group-hover:text-primary transition-colors inline-block"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                )}

                {/* KKDA row */}
                {kkdaQty > 0 && (filter === "all" || filter === "liquidity") && (
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
                            Governance · BEP-20
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 font-label text-sm">
                      {kkdaQty.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-6 font-label text-sm">
                      ${kkdaValueUsd.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-6 text-right">
                      <Link
                        href="/dex"
                        className="text-outline group-hover:text-primary transition-colors inline-block"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                )}

                {/* BNB row (gas only — informational) */}
                {bnb > 0 && filter === "all" && (
                  <tr className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-tertiary-container flex items-center justify-center">
                          <span className="text-tertiary font-bold font-label">
                            B
                          </span>
                        </div>
                        <div>
                          <p className="font-headline text-sm font-bold">BNB</p>
                          <p className="text-[10px] font-label text-outline">
                            Native gas token
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 font-label text-sm">
                      {bnb.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </td>
                    <td className="py-6 font-label text-sm text-on-surface-variant">
                      —
                    </td>
                    <td className="py-6 text-right">—</td>
                  </tr>
                )}

                {/* NFT row */}
                {nftCount > 0 && (filter === "all" || filter === "tea") && (
                  <tr className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-surface-container flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-headline text-sm font-bold">
                            Vintage Pu&apos;er NFTs
                          </p>
                          <p className="text-[10px] font-label text-outline">
                            KKIKDA_NFT · ERC-721
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 font-label text-sm">
                      {nftCount.toLocaleString()} units
                    </td>
                    <td className="py-6 font-label text-sm text-on-surface-variant">
                      —
                    </td>
                    <td className="py-6 text-right">
                      <Link
                        href="/rwa"
                        className="text-outline group-hover:text-primary transition-colors inline-block"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Activity & Curator Insight */}
      <div className="grid grid-cols-12 gap-10">
        {/* Activity Timeline (real orders only) */}
        <div className="col-span-12 lg:col-span-8">
          <h3 className="font-headline text-2xl text-on-surface mb-8">
            {t("home.provenanceTimeline")}
          </h3>
          {orders.length > 0 ? (
            <div className="space-y-0 border-l-[0.5px] border-outline-variant border-dashed ml-2 pl-8">
              {orders.slice(0, 5).map((order, i) => {
                const date = new Date(order.timestamp);
                const isLatest = i === 0;
                return (
                  <div
                    key={order.id}
                    className={`relative pb-10 ${!isLatest ? "opacity-60" : ""}`}
                  >
                    <div
                      className={`absolute -left-[37px] top-0 w-4 h-4 ${
                        isLatest
                          ? "bg-primary"
                          : "border-[0.5px] border-outline-variant bg-surface"
                      }`}
                    />
                    <p
                      className={`font-label text-[10px] uppercase tracking-[0.2em] mb-1 ${
                        isLatest ? "text-primary" : "text-outline"
                      }`}
                    >
                      {date.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <h4 className="font-headline text-lg text-on-surface">
                      {order.type === "buy" ? "Acquired" : "Sold"} {order.amount}{" "}
                      {order.tokenSymbol}
                    </h4>
                    <p className="text-sm text-outline font-body mt-2">
                      Total ${order.total.toLocaleString()} · status{" "}
                      {order.status} · {order.txHash.slice(0, 10)}…
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-10 text-center">
              <p className="font-body text-sm text-on-surface-variant">
                No on-chain activity recorded yet.
              </p>
              <p className="font-label text-[10px] uppercase tracking-widest text-outline mt-2">
                Trades, mints, and stakes will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Curator's Insight (static branded content) */}
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

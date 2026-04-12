"use client";

import { useStore } from "@/stores/useStore";
import { t, formatNumber, formatPercent } from "@/lib/i18n";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const STEPS = [
  {
    num: "01",
    title: "Authenticate",
    desc: "Expert appraisers verify provenance, grade, and condition of each physical asset through rigorous certification.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Tokenize",
    desc: "Assets are tokenized as ERC-3643 compliant security tokens with on-chain provenance records and fractional ownership.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Trade",
    desc: "Buy, sell, and trade tokenized assets on the KKIKDA DEX with full liquidity, transparent pricing, and instant settlement.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Redeem",
    desc: "Token holders can redeem for the underlying physical asset at any time, with insured shipping and chain-of-custody tracking.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21" />
      </svg>
    ),
  },
];

const CERTIFICATIONS = [
  "ISO 22000 Food Safety",
  "China Tea Authentication Board",
  "Hong Kong Vintage Tea Society",
  "Jingdezhen Ceramics Authority",
];

export default function RWAPage() {
  const { tokens, lang } = useStore();
  const rwaTokens = tokens.filter((tk) => tk.category === "rwa");

  const totalValue = rwaTokens.reduce((s, tk) => s + tk.marketCap, 0);
  const totalVolume = rwaTokens.reduce((s, tk) => s + tk.volume24h, 0);
  const avgYield = 8.2;
  const verifiedCount = rwaTokens.length;

  const stats = [
    { label: "Total RWA Value", value: formatNumber(totalValue) },
    { label: "Active Assets", value: String(verifiedCount) },
    { label: "Average Yield", value: `${avgYield}% APY` },
    { label: "24h Volume", value: formatNumber(totalVolume) },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-outline-ghost">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(243,187,144,0.08),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-dim border border-primary/20 text-primary font-mono text-xs tracking-widest uppercase">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                ERC-3643 Compliant
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-on-surface leading-[1.1] tracking-tight mb-8"
            >
              RWA Token{" "}
              <span className="text-primary">Marketplace</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-on-surface-mid text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
            >
              Trade tokenized real-world assets -- vintage Pu&apos;er tea, rare ceramics,
              and curated collectibles -- with blockchain-verified provenance,
              fractional ownership, and instant settlement.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                href="/dex"
                className="btn-gold px-8 py-3.5 text-sm inline-flex items-center gap-2"
              >
                Start Trading
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <a
                href="#assets"
                className="btn-ghost px-8 py-3.5 text-sm inline-flex items-center gap-2"
              >
                Browse Assets
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="border-b border-outline-ghost">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-outline-ghost"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={i}
                className="py-10 px-6 first:pl-0 last:pr-0"
              >
                <p className="text-on-surface-dim text-xs font-mono uppercase tracking-widest mb-2">
                  {s.label}
                </p>
                <p className="text-on-surface text-2xl md:text-3xl font-mono font-semibold">
                  {s.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Asset List */}
      <section id="assets" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-16">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-4">
                Tokenized Assets
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-4">
                Available RWA Tokens
              </h2>
              <p className="text-on-surface-mid text-base max-w-xl">
                Each token is backed 1:1 by an authenticated physical asset held in
                insured, climate-controlled vaults.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rwaTokens.map((token, i) => {
                const isUp = token.change24h >= 0;
                return (
                  <motion.div
                    key={token.id}
                    variants={fadeUp}
                    custom={i + 1}
                    className="group bg-surface-low border border-outline-ghost hover:border-outline transition-all duration-300"
                  >
                    {/* Image placeholder */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-surface-mid to-surface-high">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(243,187,144,0.06),transparent)]" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed/15 text-secondary-fixed font-mono text-[10px] tracking-widest uppercase border border-secondary-fixed/20">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M8 1.75a.75.75 0 01.692.462l1.41 3.393 3.664.293a.75.75 0 01.428 1.317l-2.791 2.39.853 3.561a.75.75 0 01-1.12.814L8 11.86l-3.136 1.62a.75.75 0 01-1.12-.814l.853-3.561-2.791-2.39a.75.75 0 01.428-1.317l3.664-.293 1.41-3.393A.75.75 0 018 1.75z" clipRule="evenodd" />
                          </svg>
                          Verified Asset
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 text-on-surface-dim font-mono text-[10px] tracking-widest">
                        {token.contractAddress}
                      </div>
                      {/* Large token symbol watermark */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-7xl text-on-surface/[0.04] font-bold select-none group-hover:text-on-surface/[0.06] transition-colors duration-500">
                          {token.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-xl text-on-surface mb-1">
                            {token.name}
                          </h3>
                          <p className="font-mono text-xs text-on-surface-dim tracking-wider">
                            {token.symbol}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-lg text-on-surface font-semibold">
                            ${token.price.toFixed(2)}
                          </p>
                          <p
                            className={`font-mono text-xs ${
                              isUp ? "text-success" : "text-error"
                            }`}
                          >
                            {formatPercent(token.change24h)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t border-b border-outline-ghost">
                        <div>
                          <p className="text-on-surface-dim text-[10px] font-mono uppercase tracking-widest mb-1">
                            Mkt Cap
                          </p>
                          <p className="font-mono text-sm text-on-surface">
                            {formatNumber(token.marketCap)}
                          </p>
                        </div>
                        <div>
                          <p className="text-on-surface-dim text-[10px] font-mono uppercase tracking-widest mb-1">
                            Volume
                          </p>
                          <p className="font-mono text-sm text-on-surface">
                            {formatNumber(token.volume24h)}
                          </p>
                        </div>
                        <div>
                          <p className="text-on-surface-dim text-[10px] font-mono uppercase tracking-widest mb-1">
                            Supply
                          </p>
                          <p className="font-mono text-sm text-on-surface">
                            {token.supply.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Provenance info */}
                      <div className="flex items-center gap-2 mb-6 text-on-surface-dim text-xs">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-dark shrink-0">
                          <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        <span>
                          Authenticated &amp; vault-stored | Max supply:{" "}
                          {token.maxSupply.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href="/dex"
                          className="btn-gold flex-1 py-2.5 text-xs text-center"
                        >
                          Trade
                        </Link>
                        <button className="btn-ghost flex-1 py-2.5 text-xs">
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32 bg-surface-low border-t border-b border-outline-ghost">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-20">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-4">
                Process
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-4">
                How It Works
              </h2>
              <p className="text-on-surface-mid max-w-lg mx-auto">
                From physical authentication to on-chain trading, every step is
                transparent, auditable, and secure.
              </p>
            </motion.div>

            <div className="relative grid md:grid-cols-4 gap-8">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-outline-ghost">
                <div
                  className="absolute inset-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--color-primary-dark), var(--color-primary), var(--color-primary-dark), transparent)",
                    opacity: 0.3,
                  }}
                />
              </div>

              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  custom={i + 1}
                  className="relative text-center group"
                >
                  <div className="relative z-10 w-24 h-24 mx-auto mb-6 bg-surface border border-outline-ghost flex items-center justify-center text-primary group-hover:border-primary/30 group-hover:bg-primary-dim transition-all duration-300">
                    {step.icon}
                  </div>
                  <p className="font-mono text-xs text-primary-dark tracking-widest mb-2">
                    {step.num}
                  </p>
                  <h3 className="font-serif text-xl text-on-surface mb-3">
                    {step.title}
                  </h3>
                  <p className="text-on-surface-dim text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-start"
          >
            <motion.div variants={fadeUp} custom={0}>
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-4">
                Regulatory Compliance
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-6">
                ERC-3643 Security Token Standard
              </h2>
              <p className="text-on-surface-mid leading-relaxed mb-8">
                All RWA tokens on KKIKDA are issued under the ERC-3643 standard,
                the institutional-grade framework for compliant security tokens.
                This ensures identity verification, transfer restrictions, and
                regulatory compliance are enforced at the smart contract level.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  {
                    title: "KYC / AML Verification",
                    desc: "All participants must complete identity verification (KYC Tier 2+) before trading RWA tokens.",
                  },
                  {
                    title: "On-Chain Transfer Rules",
                    desc: "Smart contracts enforce jurisdictional restrictions, holding periods, and investor accreditation.",
                  },
                  {
                    title: "Independent Audit",
                    desc: "All smart contracts are audited by CertiK with continuous monitoring and bug bounty programs.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 bg-surface-low border border-outline-ghost"
                  >
                    <div className="shrink-0 w-8 h-8 bg-primary-dim flex items-center justify-center text-primary">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-on-surface font-medium text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-on-surface-dim text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard"
                className="btn-gold px-6 py-3 text-xs inline-flex items-center gap-2"
              >
                Complete KYC Verification
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              {/* Certification badges */}
              <div className="bg-surface-low border border-outline-ghost p-8 mb-6">
                <p className="font-mono text-xs text-on-surface-dim uppercase tracking-widest mb-6">
                  Certifications &amp; Partners
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {CERTIFICATIONS.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-surface border border-outline-ghost"
                    >
                      <div className="shrink-0 w-8 h-8 bg-accent/10 flex items-center justify-center text-accent">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-on-surface-mid text-xs font-medium">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit info card */}
              <div className="bg-surface-low border border-outline-ghost p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-success-dim flex items-center justify-center text-success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-on-surface font-medium text-sm">
                      CertiK Audited
                    </p>
                    <p className="text-on-surface-dim text-xs">
                      Last audit: March 2026
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Security Score", value: "96 / 100" },
                    { label: "Code Review", value: "Passed" },
                    { label: "On-Chain Monitoring", value: "Active" },
                    { label: "Bug Bounty", value: "$250,000" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2 border-b border-outline-ghost last:border-0"
                    >
                      <span className="text-on-surface-dim text-xs font-mono">
                        {row.label}
                      </span>
                      <span className="text-on-surface text-xs font-mono font-semibold">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

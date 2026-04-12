"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { t } from "@/lib/i18n";

/* ── FadeIn wrapper ── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── SVG: Tea Cup Illustration ── */
function TeaCupSVG() {
  return (
    <svg viewBox="0 0 400 420" fill="none" className="w-full h-full">
      {/* Steam */}
      <motion.path
        d="M160 80 Q165 50 155 20"
        stroke="#f3bb90"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M195 70 Q200 35 190 5"
        stroke="#f3bb90"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.path
        d="M230 75 Q228 40 235 10"
        stroke="#f3bb90"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
        animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      {/* Cup body */}
      <path
        d="M100 130 Q100 100 130 95 L260 95 Q290 100 290 130 L280 280 Q275 310 200 315 Q125 310 115 280 Z"
        fill="#1a1510"
        stroke="#f3bb90"
        strokeWidth="1"
      />
      {/* Tea liquid surface */}
      <ellipse cx="195" cy="130" rx="90" ry="18" fill="#3d2a1a" stroke="#f3bb90" strokeWidth="0.5" />
      <ellipse cx="195" cy="130" rx="70" ry="12" fill="#5a3d28" opacity="0.6" />
      {/* Decorative pattern on cup */}
      <path
        d="M130 170 Q160 185 195 170 Q230 155 260 170"
        stroke="#f3bb90"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M125 200 Q160 215 195 200 Q230 185 265 200"
        stroke="#f3bb90"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
      {/* Chinese character on cup */}
      <text x="175" y="240" fill="#f3bb90" opacity="0.25" fontSize="50" fontFamily="serif">
        茶
      </text>
      {/* Cup handle */}
      <path
        d="M290 150 Q340 155 345 200 Q345 250 290 255"
        stroke="#f3bb90"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Saucer */}
      <ellipse cx="195" cy="325" rx="140" ry="22" fill="#1a1510" stroke="#f3bb90" strokeWidth="1" />
      <ellipse cx="195" cy="320" rx="110" ry="14" fill="none" stroke="#f3bb90" strokeWidth="0.5" opacity="0.3" />
      {/* Saucer rim highlight */}
      <ellipse cx="195" cy="330" rx="130" ry="18" fill="none" stroke="#f3bb90" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

/* ── SVG: Tea Cake 1 (layered warm brown) ── */
function TeaCake1SVG() {
  return (
    <svg viewBox="0 0 300 220" fill="none" className="w-full h-full">
      <rect width="300" height="220" fill="#2a1f18" />
      {/* Tea cake - circular layered disc */}
      <ellipse cx="150" cy="120" rx="90" ry="30" fill="#3d2a1a" />
      <ellipse cx="150" cy="115" rx="90" ry="30" fill="#4a3525" />
      <ellipse cx="150" cy="110" rx="85" ry="28" fill="#5a3d28" />
      {/* Texture lines */}
      <path d="M75 110 Q110 95 150 110 Q190 125 225 110" stroke="#6b4a30" strokeWidth="0.8" fill="none" />
      <path d="M80 105 Q115 90 150 105 Q185 120 220 105" stroke="#7a5838" strokeWidth="0.5" fill="none" />
      {/* Wrapper folds */}
      <path d="M60 120 L90 85 L150 75 L210 85 L240 120" stroke="#f3bb90" strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Stamp */}
      <rect x="120" y="145" width="60" height="25" fill="none" stroke="#f3bb90" strokeWidth="0.5" opacity="0.4" />
      <text x="128" y="162" fill="#f3bb90" opacity="0.4" fontSize="10" fontFamily="serif">1988</text>
      {/* Subtle glow */}
      <circle cx="150" cy="110" r="60" fill="#f3bb90" opacity="0.04" />
    </svg>
  );
}

/* ── SVG: Tea Leaves (green) ── */
function TeaCake2SVG() {
  return (
    <svg viewBox="0 0 300 220" fill="none" className="w-full h-full">
      <rect width="300" height="220" fill="#1a1815" />
      {/* Tea leaves arrangement */}
      <path d="M100 140 Q130 80 150 100 Q170 80 200 140" fill="#2d4a2a" opacity="0.6" />
      <path d="M80 150 Q120 90 145 110 Q170 90 210 150" fill="#3a5a35" opacity="0.5" />
      {/* Individual leaves */}
      <path d="M120 100 Q135 70 150 100 Q135 95 120 100" fill="#4a6a42" stroke="#5a7a50" strokeWidth="0.5" />
      <path d="M155 90 Q175 60 185 95 Q170 85 155 90" fill="#3d5a38" stroke="#4d6a48" strokeWidth="0.5" />
      <path d="M135 125 Q155 95 165 130 Q150 120 135 125" fill="#4a6a42" stroke="#5a7a50" strokeWidth="0.5" />
      <path d="M170 115 Q185 85 195 120 Q183 110 170 115" fill="#3d5a38" stroke="#4d6a48" strokeWidth="0.5" />
      {/* Leaf veins */}
      <path d="M135 95 L145 80" stroke="#5a7a50" strokeWidth="0.3" opacity="0.5" />
      <path d="M165 87 L177 72" stroke="#4d6a48" strokeWidth="0.3" opacity="0.5" />
      {/* Purple tint for Purple Peacock variety */}
      <circle cx="150" cy="110" r="45" fill="#6a3a6a" opacity="0.08" />
      <path d="M140 135 Q150 120 160 135" fill="#5a3a5a" opacity="0.15" />
      {/* Subtle glow */}
      <circle cx="150" cy="110" r="70" fill="#5a7a50" opacity="0.05" />
    </svg>
  );
}

/* ── SVG: Golden Teapot ── */
function TeaCake3SVG() {
  return (
    <svg viewBox="0 0 300 220" fill="none" className="w-full h-full">
      <rect width="300" height="220" fill="#1f1a15" />
      {/* Teapot body */}
      <ellipse cx="150" cy="130" rx="55" ry="45" fill="#2a2015" stroke="#f3bb90" strokeWidth="1" />
      {/* Teapot lid */}
      <ellipse cx="150" cy="88" rx="30" ry="8" fill="#2a2015" stroke="#f3bb90" strokeWidth="0.8" />
      <ellipse cx="150" cy="82" rx="8" ry="5" fill="#2a2015" stroke="#f3bb90" strokeWidth="0.8" />
      {/* Spout */}
      <path d="M205 120 Q235 110 245 100 Q248 95 243 93" stroke="#f3bb90" strokeWidth="1" fill="none" />
      {/* Handle */}
      <path d="M95 110 Q65 115 60 135 Q58 155 95 155" stroke="#f3bb90" strokeWidth="1.2" fill="none" />
      {/* Decorative band */}
      <path d="M100 125 Q125 120 150 125 Q175 130 200 125" stroke="#f3bb90" strokeWidth="0.5" opacity="0.5" />
      <path d="M100 135 Q125 130 150 135 Q175 140 200 135" stroke="#f3bb90" strokeWidth="0.5" opacity="0.4" />
      {/* Steam from spout */}
      <motion.path
        d="M243 93 Q248 80 242 70"
        stroke="#f3bb90"
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* Gold reflection */}
      <ellipse cx="140" cy="120" rx="15" ry="20" fill="#f3bb90" opacity="0.06" />
      {/* Base text */}
      <text x="130" y="185" fill="#f3bb90" opacity="0.3" fontSize="9" fontFamily="monospace">JINGMAI</text>
    </svg>
  );
}

/* ── Sidebar ── */
function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-[56px] bottom-0 w-[220px] bg-surface-low border-r border-outline-ghost flex-col z-30">
      {/* User avatar area */}
      <div className="px-6 pt-8 pb-6 border-b border-outline-ghost">
        <div className="w-14 h-14 rounded-full bg-surface-mid border border-outline-ghost flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-on-surface-dim">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <h2 className="text-serif text-lg text-on-surface leading-tight">Digital Sommelier</h2>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/15 border border-primary/30">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#f3bb90" className="shrink-0">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-primary">Verified Collector</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {/* Collections - active */}
          <li>
            <Link
              href="/nft"
              className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 border-l-2 border-primary text-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              <span className="font-mono text-[12px] tracking-wider">Collections</span>
            </Link>
          </li>
          {/* My Kura */}
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-on-surface-dim hover:text-on-surface hover:bg-surface-mid transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="font-mono text-[12px] tracking-wider">My Kura</span>
            </Link>
          </li>
          {/* Governance */}
          <li>
            <Link
              href="/staking"
              className="flex items-center gap-3 px-3 py-2.5 text-on-surface-dim hover:text-on-surface hover:bg-surface-mid transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-mono text-[12px] tracking-wider">Governance</span>
            </Link>
          </li>
          {/* Settings */}
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 text-on-surface-dim hover:text-on-surface hover:bg-surface-mid transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              <span className="font-mono text-[12px] tracking-wider">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

/* ── Hero ── */
function Hero() {
  const lang = useStore((s) => s.lang);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-[#1a1510]" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/[0.04] to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <FadeIn>
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-primary/80 mb-8">
                PROVENANCE SECURED BY BLOCKCHAIN
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-serif text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.08] tracking-[-0.01em] mb-2">
                <span className="text-on-surface">{t("hero.title1", lang)}</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-serif text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.08] tracking-[-0.01em] text-primary italic mb-8">
                {t("hero.title2", lang)}
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-on-surface-mid text-[15px] sm:text-base leading-relaxed max-w-lg mb-10">
                Access the world&apos;s most prestigious tea vault. Authenticated by masters, secured on-chain, and aged to perfection in our temperature-controlled digital Kura.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/nft" className="btn-gold px-8 py-3.5 text-[12px] tracking-[0.15em]">
                  EXPLORE THE VAULT
                </Link>
                <Link href="/rwa" className="btn-ghost px-8 py-3.5 text-[12px] tracking-[0.15em]">
                  VIEW PROTOCOL
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right illustration */}
          <FadeIn delay={0.3} className="hidden md:block">
            <div className="w-full max-w-[400px] mx-auto aspect-square">
              <TeaCupSVG />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── Stats Row ── */
function StatsRow() {
  const stats = [
    { label: "TOTAL VALUE LOCKED", value: "$42,890,200", sub: "+2.6% THIS QUARTER" },
    { label: "TOKEN PRICE (BKGD)", value: "$1,248.50", sub: "REAL-TIME APY: 8.2%" },
    { label: "PLATFORM YIELD", value: "14.5% APY", sub: "KKIKDA VINTAGE APPRECIATION" },
  ];

  return (
    <section className="bg-surface-low border-y border-outline-ghost">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          {/* Trade Now button */}
          <FadeIn className="shrink-0 flex items-center">
            <Link href="/dex" className="btn-gold px-6 py-3 text-[11px] tracking-[0.15em] whitespace-nowrap">
              TRADE NOW
            </Link>
          </FadeIn>

          {/* Stat cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="bg-surface p-4 border border-outline-ghost">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-on-surface-dim mb-1.5">
                    {stat.label}
                  </p>
                  <p className="font-mono text-xl sm:text-2xl font-semibold text-on-surface mb-1">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-primary/70">
                    {stat.sub}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Trust Badges ── */
function TrustBadges() {
  return (
    <section className="bg-surface py-10">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14">
            {/* Bank Trust Custody */}
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3bb90" strokeWidth="1.3" className="shrink-0">
                <path d="M3 21h18" />
                <path d="M3 10h18" />
                <path d="M12 3l9 7H3l9-7z" />
                <path d="M5 10v11" />
                <path d="M19 10v11" />
                <path d="M9 10v11" />
                <path d="M15 10v11" />
              </svg>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-on-surface-dim">
                Bank Trust Custody
              </span>
            </div>

            {/* ERC-3643 Standard */}
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3bb90" strokeWidth="1.3" className="shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-on-surface-dim">
                ERC-3643 Standard
              </span>
            </div>

            {/* Fully Audited */}
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3bb90" strokeWidth="1.3" className="shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="0" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
                <path d="M10 16l2 2 4-4" />
              </svg>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-on-surface-dim">
                Fully Audited Smart Contracts
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Featured Vintage Cakes ── */
function FeaturedCakes() {
  const lang = useStore((s) => s.lang);

  const cakes = [
    {
      badge: "1988 VINTAGE",
      title: "Menghai '88 Qing Bing",
      description: "Original raw Pu'er stored in dry Hong Kong warehouse since 1992.",
      value: "$12,450.00",
      Illustration: TeaCake1SVG,
    },
    {
      badge: "1996 PRIVATE RESERVE",
      title: "Purple Peacock Gong Bing",
      description: "Rare purple leaf variety from Bulang Mountains, aged in ceramic vessels.",
      value: "$8,900.00",
      Illustration: TeaCake2SVG,
    },
    {
      badge: "2003 SPECIAL EDITION",
      title: "Jingmai Mountain Ancient Tree",
      description: "Harvested from 500-year-old trees. Characterized by honey fragrance.",
      value: "$5,820.00",
      Illustration: TeaCake3SVG,
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-3">
                EXCLUSIVE ACQUISITION
              </p>
              <h2 className="text-serif text-3xl sm:text-4xl lg:text-[42px] font-light text-on-surface">
                {t("featured.title", lang)}
              </h2>
            </div>
            <Link
              href="/nft"
              className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-primary hover:text-on-surface transition-colors"
            >
              VIEW ALL COLLECTION
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cakes.map((cake, i) => (
            <FadeIn key={cake.title} delay={i * 0.12}>
              <Link href="/nft" className="group block">
                <div className="bg-surface-low hover:bg-surface-mid transition-all duration-300 overflow-hidden">
                  {/* Image area */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <cake.Illustration />
                    {/* Badge */}
                    <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 bg-primary/15 text-primary border border-primary/30">
                      {cake.badge}
                    </span>
                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Card info */}
                  <div className="p-5">
                    <h3 className="text-[16px] font-medium text-on-surface group-hover:text-primary transition-colors mb-2">
                      {cake.title}
                    </h3>
                    <p className="text-[13px] text-on-surface-dim leading-relaxed mb-5">
                      {cake.description}
                    </p>

                    {/* Appraisal value + arrow */}
                    <div className="flex items-center justify-between pt-4 border-t border-outline-ghost">
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-on-surface-dim mb-1">
                          APPRAISAL VALUE
                        </p>
                        <p className="font-mono text-lg font-semibold text-on-surface">
                          {cake.value}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3bb90" strokeWidth="1.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/nft" className="font-mono text-xs text-primary tracking-wider uppercase">
            VIEW ALL COLLECTION →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ── */
function CTASection() {
  const lang = useStore((s) => s.lang);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-[#141210] to-surface-low" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.03] blur-[100px]" />

      {/* Decorative frame corners */}
      <div className="absolute top-10 left-10 w-14 h-14 border-t border-l border-primary/20" />
      <div className="absolute bottom-10 right-10 w-14 h-14 border-b border-r border-primary/20" />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="text-serif text-4xl sm:text-5xl lg:text-6xl font-light text-on-surface mb-6 leading-[1.1]">
            {t("cta.enter", lang)}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-on-surface-mid text-[15px] sm:text-base leading-relaxed mb-10">
            Receive exclusive access to private reserve auctions and quarterly market reports for vintage Pu&apos;er assets.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex items-center max-w-md mx-auto border border-outline-ghost bg-surface-low">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent px-5 py-3.5 text-[13px] text-on-surface placeholder:text-on-surface-dim/50 outline-none font-mono"
            />
            <button className="shrink-0 w-12 h-12 bg-primary/15 border-l border-outline-ghost flex items-center justify-center hover:bg-primary/25 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f3bb90" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <>
      <Sidebar />
      <div className="lg:ml-[220px]">
        <Hero />
        <StatsRow />
        <TrustBadges />
        <FeaturedCakes />
        <CTASection />
      </div>
    </>
  );
}

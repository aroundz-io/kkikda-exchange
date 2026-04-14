"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function Step({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 shrink-0 ${active ? "" : "opacity-30"}`}>
      <span
        className={`w-8 h-8 flex items-center justify-center border font-label text-xs ${
          active ? "border-primary text-primary" : "border-on-surface text-on-surface"
        }`}
      >
        {number}
      </span>
      <span
        className={`font-label text-[10px] uppercase tracking-widest ${
          active ? "text-primary" : ""
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function SpecRow({
  label,
  value,
  isHash = false,
}: {
  label: string;
  value: string;
  isHash?: boolean;
}) {
  return (
    <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
      <span className="font-label text-xs text-white/40 uppercase">{label}</span>
      <span className={isHash ? "font-label text-[10px] text-primary" : "font-body text-sm text-white"}>
        {value}
      </span>
    </div>
  );
}

function StatusItem({
  icon,
  text,
  subtext,
}: {
  icon: ReactNode;
  text: string;
  subtext: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-secondary">{icon}</span>
      <div className="space-y-1">
        <p className="font-body text-xs text-white">{text}</p>
        <p className="font-label text-[9px] text-white/30 uppercase tracking-tighter">
          {subtext}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  text,
  time,
  active = false,
  opacity = "",
}: {
  text: string;
  time: string;
  active?: boolean;
  opacity?: string;
}) {
  return (
    <div className={`relative ${opacity}`}>
      <div
        className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-4 border-background ${
          active ? "bg-secondary" : "bg-outline"
        }`}
      />
      <p className="font-body text-xs text-white">{text}</p>
      <p className="font-label text-[9px] text-white/30 uppercase tracking-tighter">
        {time}
      </p>
    </div>
  );
}

export default function RwaPage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const selectedCake = teaCakes[0];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <span className="font-label text-primary text-xs uppercase tracking-[0.3em]">
          Redemption Protocol
        </span>
        <h1 className="font-headline text-4xl lg:text-5xl text-white leading-tight">
          The Physical Release.
        </h1>
      </motion.div>

      {/* Step Progress */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
        <Step number="01" label="Select" active />
        <div className="w-12 h-[0.5px] bg-outline-variant/30 shrink-0" />
        <Step number="02" label="Confirm" />
        <div className="w-12 h-[0.5px] bg-outline-variant/30 shrink-0" />
        <Step number="03" label="Release" />
        <div className="w-12 h-[0.5px] bg-outline-variant/30 shrink-0" />
        <Step number="04" label="Done" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Asset View */}
        <div className="lg:col-span-8 space-y-8">
          {/* Asset Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-surface-container-low border border-outline-variant/10"
          >
            <div className="aspect-[16/10] bg-surface-container flex items-center justify-center">
              <span className="text-outline/20 font-headline text-[120px]">
                {selectedCake?.vintage}
              </span>
            </div>
            <div className="p-6 lg:p-8 bg-surface-container-low space-y-4">
              <h2 className="font-headline text-2xl lg:text-3xl text-white">
                {selectedCake?.name ?? "1998 Chen Yuan Hao"}
              </h2>
              <p className="font-label text-xs text-primary tracking-widest uppercase">
                Ancient Tree Raw Pu&apos;er &bull; Yiwu Mountain
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="font-label text-[10px] text-white/40 uppercase tracking-widest">
                  NFT ID #{selectedCake?.tokenId ?? "0882"}
                </span>
                <div className="px-4 py-1 bg-primary/10 border border-primary/30">
                  <span className="font-label text-xs text-primary">
                    {selectedCake?.price ?? 0.452} BNB / $
                    {selectedCake?.priceUsd.toLocaleString() ?? "1,240"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-surface-container-high border border-outline-variant/10">
              <h3 className="font-headline text-lg text-white mb-6">
                Vault Specifications
              </h3>
              <div className="space-y-4">
                <SpecRow label="Weight" value="357g ± 5g" />
                <SpecRow label="Storage Conditions" value="65% RH / 24°C" />
                <SpecRow label="Last Inspection" value="Oct 14, 2023" />
                <SpecRow label="Blockchain Hash" value="0x4a12...93f2" isHash />
              </div>
            </div>

            <div className="p-8 bg-surface-container-highest border border-outline-variant/15 flex flex-col justify-center items-center text-center">
              <Flame className="text-primary mb-4" size={40} fill="currentColor" />
              <h3 className="font-headline text-xl text-white mb-2">
                Burn to Redeem
              </h3>
              <p className="font-body text-sm text-white/60 mb-6">
                Burning this NFT permanently destroys the digital token and
                triggers the physical release from our vault.
              </p>
              <button className="w-full py-4 bg-primary text-on-primary font-label font-bold text-sm uppercase tracking-[0.2em] hover:bg-on-primary-container transition-all">
                Initiate Redemption
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-surface-container border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <ShieldCheck className="text-secondary/30" size={40} />
            </div>
            <h3 className="font-headline text-lg text-white mb-2">
              Vault Status
            </h3>
            <p className="font-label text-[10px] text-secondary uppercase tracking-[0.2em] mb-6">
              Verified in Vault
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label text-[10px] text-white/40 uppercase tracking-widest">
                    Collateralization
                  </span>
                  <span className="font-label text-sm text-white">100%</span>
                </div>
                <div className="w-full h-1 bg-surface-variant">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-secondary"
                  />
                </div>
              </div>

              <StatusItem
                icon={<CheckCircle2 size={16} />}
                text="Third-party audited reserves"
                subtext="Report #VLT-29402-23"
              />
              <StatusItem
                icon={<CheckCircle2 size={16} />}
                text="Climate-controlled preservation"
                subtext="Status: Optimal Aging"
              />
            </div>
          </div>

          {/* Delivery Tracker */}
          <div className="bg-surface-container-low border border-outline-variant/10 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10">
              <h3 className="font-headline text-sm text-white">
                Active Deliveries
              </h3>
            </div>
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-body text-sm text-white">
                      2003 &ldquo;Purple Dayi&rdquo;
                    </p>
                    <p className="font-label text-[10px] text-white/40 uppercase tracking-widest">
                      Carrier: FedEx Priority
                    </p>
                  </div>
                  <span className="font-label text-[10px] text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-1 shrink-0">
                    In Transit
                  </span>
                </div>

                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] border-l border-dashed border-outline-variant" />
                  <TimelineItem
                    active
                    text="Out for delivery"
                    time="Today, 09:42 AM • Seoul, KR"
                  />
                  <TimelineItem
                    text="Customs clearance completed"
                    time="Oct 24 • Incheon Int'l"
                    opacity="opacity-50"
                  />
                  <TimelineItem
                    text="Vault exit & dispatch"
                    time="Oct 22 • Hong Kong Hub"
                    opacity="opacity-30"
                  />
                </div>

                <button className="w-full py-3 mt-4 border border-outline-variant/30 text-white font-label text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                  View Full Tracking
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 border border-outline-variant/10">
            <p className="font-body text-xs text-white/40 mb-4 italic">
              &ldquo;True tea is only realized when it transitions from the
              vault of memory to the vessel of presence.&rdquo;
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-primary font-label text-[10px] uppercase tracking-widest group"
            >
              Redemption Guide
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

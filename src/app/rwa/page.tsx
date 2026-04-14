"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/stores/useStore";

const STEPS = ["Select", "Confirm", "Release", "Done"] as const;
type Step = (typeof STEPS)[number];

const VAULT_SPECS = [
  { label: "Temperature", value: "18-22\u00b0C" },
  { label: "Humidity", value: "55-65%" },
  { label: "Security", value: "24/7 Monitored" },
  { label: "Insurance", value: "Full Coverage" },
];

const DELIVERIES = [
  { id: "DLV-0041", status: "In Transit", date: "2026-04-12" },
  { id: "DLV-0039", status: "Customs", date: "2026-04-08" },
  { id: "DLV-0035", status: "Delivered", date: "2026-03-28" },
];

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function RwaPage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedCake, setSelectedCake] = useState(teaCakes[0] ?? null);
  const [burnConfirmed, setBurnConfirmed] = useState(false);

  const stepColor = (i: number) => {
    if (i < activeStep) return "bg-secondary text-on-secondary";
    if (i === activeStep) return "bg-primary text-on-primary";
    return "bg-surface-container-high text-outline";
  };

  return (
    <div className="px-6 lg:px-12 py-10 max-w-7xl mx-auto space-y-10">
      {/* ── Header ── */}
      <motion.header {...fade} transition={{ duration: 0.5 }}>
        <p className="label mb-3">PHYSICAL RELEASE PROTOCOL</p>
        <h1 className="font-headline text-5xl text-on-surface">
          The Physical{" "}
          <span className="italic text-primary">Release</span>.
        </h1>
      </motion.header>

      {/* ── Step Wizard ── */}
      <motion.div
        className="flex items-center gap-0"
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => setActiveStep(i)}
              className={`w-9 h-9 flex items-center justify-center font-label text-[10px] uppercase tracking-[0.15em] ${stepColor(i)} border-[0.5px] border-outline-variant transition-colors`}
            >
              {i + 1}
            </button>
            <span className="ml-2 font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 lg:w-20 h-[0.5px] mx-3 ${
                  i < activeStep ? "bg-secondary" : "bg-outline-variant"
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Tea Cake Display */}
          <motion.div
            className="relative bg-surface-container-low border-[0.5px] border-outline-variant overflow-hidden"
            {...fade}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="h-96 bg-surface-container flex items-center justify-center">
              <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                {selectedCake ? selectedCake.name : "No asset selected"}
              </span>
            </div>

            {selectedCake && (
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-surface via-surface/80 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1">
                      NFT #{selectedCake.tokenId}
                    </p>
                    <h2 className="font-headline text-2xl text-on-surface">
                      {selectedCake.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="font-headline text-xl text-primary">
                      {selectedCake.price} BNB
                    </p>
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                      ${selectedCake.priceUsd.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Select a cake (Step 0) */}
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="select"
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                {...fade}
                transition={{ duration: 0.3 }}
              >
                {teaCakes.map((cake) => (
                  <button
                    key={cake.id}
                    onClick={() => setSelectedCake(cake)}
                    className={`p-4 border-[0.5px] text-left transition-colors ${
                      selectedCake?.id === cake.id
                        ? "border-primary bg-primary/5"
                        : "border-outline-variant bg-surface-container-low hover:bg-surface-container-high"
                    }`}
                  >
                    <p className="font-headline text-sm text-on-surface truncate">
                      {cake.name}
                    </p>
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mt-1">
                      #{cake.tokenId} &middot; {cake.price} BNB
                    </p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vault Specifications */}
          <motion.div
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6"
            {...fade}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-4">
              Vault Specifications
            </p>
            <div className="grid grid-cols-2 gap-4">
              {VAULT_SPECS.map((spec) => (
                <div key={spec.label} className="space-y-1">
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {spec.label}
                  </p>
                  <p className="font-body text-sm text-on-surface">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Burn to Redeem */}
          <motion.div
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
            {...fade}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-error">
              Burn to Redeem
            </p>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Burning your NFT is irreversible. The on-chain token will be
              permanently destroyed and the physical tea cake will be released
              from the vault for delivery to your registered address.
            </p>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={burnConfirmed}
                onChange={(e) => setBurnConfirmed(e.target.checked)}
                className="mt-0.5 accent-error"
              />
              <span className="font-body text-xs text-outline group-hover:text-on-surface transition-colors">
                I understand that this action is permanent and cannot be undone.
              </span>
            </label>

            <button
              disabled={!burnConfirmed || !selectedCake}
              onClick={() => setActiveStep(Math.min(activeStep + 1, 3))}
              className="w-full py-3 font-label text-[10px] uppercase tracking-[0.15em] bg-error/20 text-error border border-error disabled:opacity-30 disabled:cursor-not-allowed hover:bg-error/30 transition-colors"
            >
              Initiate Burn Sequence
            </button>
          </motion.div>

          {/* Vault Status */}
          <motion.div
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
            {...fade}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              Vault Status
            </p>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-body text-xs text-on-surface-variant">
                  Collateralization Ratio
                </span>
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-primary">
                  92%
                </span>
              </div>
              <div className="h-1.5 bg-surface-container-high overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-xs text-on-surface-variant">
                Total Vault Value
              </span>
              <span className="font-headline text-sm text-on-surface">
                $80,220
              </span>
            </div>
          </motion.div>

          {/* Active Deliveries */}
          <motion.div
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
            {...fade}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              Active Deliveries
            </p>
            <div className="space-y-3">
              {DELIVERIES.map((d, i) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 border-l-[0.5px] border-outline-variant pl-3"
                >
                  <div
                    className={`w-2 h-2 ${
                      d.status === "Delivered"
                        ? "bg-secondary"
                        : d.status === "In Transit"
                          ? "bg-primary"
                          : "bg-outline"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-on-surface">
                      {d.id}
                    </p>
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                      {d.status} &middot; {d.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

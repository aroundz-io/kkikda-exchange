"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { t } from "@/lib/i18n";

const STEPS = [
  {
    num: "01",
    title: "Select Token",
    desc: "Choose the RWA token you want to redeem for its physical counterpart.",
  },
  {
    num: "02",
    title: "KYC Verification",
    desc: "Complete Tier 3 KYC to verify identity and shipping address.",
  },
  {
    num: "03",
    title: "Burn Token",
    desc: "Token is burned on-chain. Irreversible. Provenance recorded permanently.",
  },
  {
    num: "04",
    title: "Receive Asset",
    desc: "Physical asset shipped via insured courier. Tracked from vault to door.",
  },
];

export default function RedeemPage() {
  const { lang, tokens, user, connectWallet } = useStore();
  const rwaTokens = tokens.filter((tk) => tk.category === "rwa");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState("1");
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", country: "", zip: "" });

  const selected = rwaTokens.find((tk) => tk.id === selectedToken);

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-xs font-mono text-primary tracking-[0.2em] uppercase mb-3">
          Physical Redemption
        </p>
        <h1 className="text-serif text-4xl sm:text-5xl font-bold mb-4">
          {t("nav.redeem", lang)}
        </h1>
        <p className="text-on-surface-mid max-w-lg mx-auto text-sm">
          Convert your RWA tokens back into physical assets. Each token represents
          a verified, vault-stored item ready for delivery.
        </p>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      >
        {STEPS.map((s, i) => (
          <div key={s.num} className="relative">
            <div className="text-3xl font-serif font-bold text-primary-dim mb-3">
              {s.num}
            </div>
            <h3 className="text-sm font-mono font-semibold mb-2">{s.title}</h3>
            <p className="text-xs text-on-surface-dim leading-relaxed">
              {s.desc}
            </p>
            {i < 3 && (
              <div className="hidden md:block absolute top-5 -right-3 w-6 text-on-surface-dim">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Redemption Form */}
      <div className="max-w-lg mx-auto">
        {/* Step indicator */}
        <div className="flex mb-8">
          {["Select", "Verify", "Confirm"].map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center text-xs font-mono ${
                  step >= i
                    ? "bg-primary text-surface"
                    : "bg-surface-mid text-on-surface-dim"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`ml-2 text-xs font-mono ${
                  step >= i ? "text-primary" : "text-on-surface-dim"
                }`}
              >
                {label}
              </span>
              {i < 2 && (
                <div
                  className={`flex-1 h-[1px] mx-3 ${
                    step > i ? "bg-primary" : "bg-outline-ghost"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Select Token */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-low p-8"
          >
            <h3 className="font-mono text-sm font-semibold mb-6">
              Select RWA Token to Redeem
            </h3>
            <div className="space-y-3 mb-6">
              {rwaTokens.map((tk) => (
                <div
                  key={tk.id}
                  onClick={() => setSelectedToken(tk.id)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                    selectedToken === tk.id
                      ? "bg-primary-dim outline outline-1 outline-primary"
                      : "bg-surface-mid hover:bg-surface-high"
                  }`}
                >
                  <div>
                    <div className="text-sm font-mono font-semibold">
                      {tk.symbol}
                    </div>
                    <div className="text-xs text-on-surface-dim">{tk.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">${tk.price}</div>
                    <div className="text-[10px] text-on-surface-dim">per token</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                className="input-scholar text-lg font-mono"
              />
            </div>
            {selected && (
              <div className="flex justify-between text-xs mb-6 p-3 bg-surface-mid">
                <span className="text-on-surface-dim">Total Value</span>
                <span className="font-mono text-accent">
                  ${(selected.price * parseInt(amount || "0")).toLocaleString()}
                </span>
              </div>
            )}
            <button
              onClick={() => selectedToken && setStep(1)}
              disabled={!selectedToken}
              className={`w-full py-3 text-sm ${
                selectedToken ? "btn-gold" : "bg-surface-mid text-on-surface-dim cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* Step 1: Shipping Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-low p-8"
          >
            <h3 className="font-mono text-sm font-semibold mb-2">
              Shipping Information
            </h3>
            <p className="text-xs text-on-surface-dim mb-6">
              KYC Tier 3 required. Your identity will be verified before shipment.
            </p>
            {user.kycTier < 3 && (
              <div className="p-3 bg-error-dim text-error text-xs font-mono mb-6">
                Current KYC: Tier {user.kycTier}. Tier 3 required for redemption.
              </div>
            )}
            <div className="space-y-4 mb-6">
              {[
                { key: "name", label: "Full Name", ph: "John Doe" },
                { key: "address", label: "Address", ph: "123 Tea Lane" },
                { key: "city", label: "City", ph: "Seoul" },
                { key: "country", label: "Country", ph: "South Korea" },
                { key: "zip", label: "Postal Code", ph: "06000" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                    {f.label}
                  </label>
                  <input
                    value={shipping[f.key as keyof typeof shipping]}
                    onChange={(e) =>
                      setShipping({ ...shipping, [f.key]: e.target.value })
                    }
                    placeholder={f.ph}
                    className="input-scholar text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="btn-ghost flex-1 py-3 text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="btn-gold flex-1 py-3 text-sm"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-low p-8"
          >
            <h3 className="font-mono text-sm font-semibold mb-6">
              Confirm Redemption
            </h3>
            <div className="space-y-3 mb-6 text-xs">
              <div className="flex justify-between p-3 bg-surface-mid">
                <span className="text-on-surface-dim">Token</span>
                <span className="font-mono">{selected.symbol}</span>
              </div>
              <div className="flex justify-between p-3 bg-surface-mid">
                <span className="text-on-surface-dim">Quantity</span>
                <span className="font-mono">{amount}</span>
              </div>
              <div className="flex justify-between p-3 bg-surface-mid">
                <span className="text-on-surface-dim">Value</span>
                <span className="font-mono text-accent">
                  ${(selected.price * parseInt(amount || "0")).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-surface-mid">
                <span className="text-on-surface-dim">Ship To</span>
                <span className="font-mono text-right">
                  {shipping.name}
                  <br />
                  {shipping.city}, {shipping.country}
                </span>
              </div>
            </div>
            <div className="p-3 bg-error-dim text-error text-[10px] font-mono mb-6 leading-relaxed">
              WARNING: Token burn is irreversible. {amount} {selected.symbol} will
              be permanently destroyed. The physical asset will be shipped within
              14 business days.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-ghost flex-1 py-3 text-sm"
              >
                Back
              </button>
              {user.address ? (
                <button className="btn-gold flex-1 py-3 text-sm">
                  BURN &amp; REDEEM
                </button>
              ) : (
                <button onClick={connectWallet} className="btn-gold flex-1 py-3 text-sm">
                  {t("nav.connect", lang)}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import {
  ArrowUpDown,
  ChevronDown,
  Settings,
  Droplets,
  Waves,
  ArrowRight,
  CreditCard,
} from "lucide-react";

const TIME_PERIODS = ["1D", "1W", "1M", "1Y", "ALL"] as const;
type Period = (typeof TIME_PERIODS)[number];

function useBarHeights(count: number) {
  return useMemo(() => {
    const heights: number[] = [];
    let base = 40;
    for (let i = 0; i < count; i++) {
      base += Math.sin(i * 0.4) * 15 + (Math.random() - 0.5) * 20;
      heights.push(Math.max(15, Math.min(95, base)));
    }
    return heights;
  }, [count]);
}

/* ---------- Exchange Widget ---------- */
function ExchangeWidget() {
  const [payAmount, setPayAmount] = useState("1.0");
  const [receiveAmount, setReceiveAmount] = useState("0.45");

  return (
    <div className="bg-surface-container p-8 shadow-2xl relative border border-outline-variant/10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline text-lg text-primary">Instant Exchange</h3>
        <Settings className="text-white/40 cursor-pointer hover:text-primary" size={18} />
      </div>

      {/* Pay Input */}
      <div className="mb-4">
        <label className="font-label text-[10px] text-secondary uppercase tracking-widest mb-2 block">
          You Pay
        </label>
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 focus-within:border-primary transition-colors">
          <input
            className="bg-transparent border-none p-0 font-label text-2xl focus:ring-0 w-1/2 outline-none"
            type="text"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <span className="font-body font-bold">BNB</span>
            <ChevronDown size={16} />
          </div>
        </div>
        <p className="font-label text-[10px] text-white/20 mt-2">
          Balance: 4.821 BNB
        </p>
      </div>

      {/* Swap Icon */}
      <div className="flex justify-center -my-3 relative z-10">
        <button className="w-10 h-10 bg-surface-container border border-outline-variant/30 flex items-center justify-center hover:border-primary transition-colors cursor-pointer active:scale-90">
          <ArrowUpDown className="text-primary" size={18} />
        </button>
      </div>

      {/* Receive Input */}
      <div className="mb-10">
        <label className="font-label text-[10px] text-secondary uppercase tracking-widest mb-2 block">
          You Receive
        </label>
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 focus-within:border-primary transition-colors">
          <input
            className="bg-transparent border-none p-0 font-label text-2xl focus:ring-0 w-1/2 outline-none"
            readOnly
            type="text"
            value={receiveAmount}
          />
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <span className="font-body font-bold text-primary">$KKDA</span>
            <ChevronDown size={16} className="text-primary" />
          </div>
        </div>
        <p className="font-label text-[10px] text-white/20 mt-2">
          1 $KKDA = 2.22 BNB
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-2 mb-8">
        {[
          { label: "Minimum Received", value: "0.448 $KKDA" },
          { label: "Network Fee (Gas)", value: "~ $1.42" },
          { label: "Slippage Tolerance", value: "0.5%" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between text-[11px] font-label uppercase tracking-tighter text-white/40"
          >
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 font-label font-bold uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all hover:opacity-90">
        Execute Trade
      </button>
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
  return (
    <div className="bg-surface-container-highest p-6 flex justify-between items-center group cursor-pointer hover:bg-outline-variant/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-tertiary-container flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-body font-bold text-white">{title}</h4>
          <p className="font-label text-[10px] text-white/40 uppercase tracking-widest">
            APY: {apy}
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
                Vintage $KKDA / BNB
              </motion.h1>
              <p className="font-label text-secondary text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                PROVENANCE VERIFIED &bull; 0x4f2...3a92
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
                <span>Performance Index</span>
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
              Liquidity Reservoirs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LiquidityPoolCard
                title="KKDA-BNB"
                apy="18.4%"
                icon={<Droplets className="text-primary" />}
              />
              <LiquidityPoolCard
                title="KKDA-USDT"
                apy="12.1%"
                icon={<Waves className="text-primary" />}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Exchange Interface */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <ExchangeWidget />

          {/* Fiat Ramp */}
          <div className="bg-tertiary-container p-6 flex flex-col gap-4 border border-outline-variant/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-surface flex items-center justify-center">
                <CreditCard className="text-secondary" size={20} />
              </div>
              <div>
                <h4 className="font-body font-bold text-sm text-white">
                  Buy with Fiat
                </h4>
                <p className="font-body text-xs text-white/40">
                  Direct bank transfer or Credit Card via MoonPay.
                </p>
              </div>
            </div>
            <a
              className="text-primary font-label text-[10px] uppercase tracking-widest gold-underline self-start"
              href="#"
            >
              Launch Fiat Ramp
            </a>
          </div>

          {/* Provenance Info */}
          <div className="bg-surface-container-low p-8 opacity-60">
            <h5 className="font-headline text-sm text-primary mb-4 italic">
              The Master&apos;s Note
            </h5>
            <p className="font-body text-xs leading-relaxed text-white/60">
              &ldquo;Like a fine 1990s Menghai cake, $KKDA liquidity matures
              through patient holding. Each transaction is recorded on the
              perpetual scroll of the blockchain, ensuring your vintage remains
              untarnished.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-primary" />
              <span className="font-label text-[10px] uppercase tracking-widest text-primary">
                Chief Curator
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

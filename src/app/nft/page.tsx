"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type TeaCake } from "@/stores/useStore";
import { ArrowRight, X } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

/* ---------- Provenance Sidebar Panel ---------- */
function ProvenanceSidebar({
  cake,
  onClose,
}: {
  cake: TeaCake;
  onClose: () => void;
}) {
  const t = useT();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-surface/60 backdrop-blur-sm z-40 xl:hidden"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-96 bg-surface-container-low border-l border-outline-variant/15 p-10 z-50 overflow-y-auto no-scrollbar"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-on-surface"
        >
          <X size={20} />
        </button>

        <h4 className="text-[10px] font-label uppercase tracking-[0.4em] text-primary mb-8">
          {t("nft.selectedProvenance")}
        </h4>

        <div className="mb-12">
          <div className="aspect-square w-full bg-surface-container mb-6 border border-outline-variant/10 overflow-hidden flex items-center justify-center">
            {cake.image ? (
              <img
                src={cake.image}
                alt={cake.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-outline text-xs font-label uppercase">
                {cake.name}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-headline mb-2">{cake.name}</h2>
          <p className="text-xs font-body text-on-surface-variant leading-relaxed opacity-70">
            {cake.subtitle}
          </p>
        </div>

        <div className="space-y-8 relative">
          <div className="absolute left-[3.5px] top-2 w-[1px] h-full border-l border-outline-variant/30 border-dashed" />
          {cake.provenance.map((entry, idx) => (
            <div key={idx} className="relative pl-8 mb-10">
              <div
                className={`absolute -left-[8px] top-1.5 w-4 h-4 border-2 border-surface-container-low rounded-full ${
                  idx === 0 ? "bg-secondary" : idx === 1 ? "bg-primary" : "bg-white/20"
                }`}
              />
              <div
                className={`text-[10px] font-label uppercase mb-1 ${
                  idx === 1 ? "text-primary" : "text-white/40"
                }`}
              >
                {entry.date} | {entry.event}
              </div>
              <p className="text-xs font-body opacity-60 leading-relaxed">
                {entry.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button className="w-full bg-primary text-on-primary py-4 font-label font-bold uppercase text-xs tracking-widest hover:bg-primary/90 transition-all">
            {t("nft.inquireSale")}
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ---------- Tea Card (uniform size for all products) ---------- */
function TeaCard({
  cake,
  onSelect,
}: {
  cake: TeaCake;
  onSelect: (cake: TeaCake) => void;
}) {
  const t = useT();

  return (
    <div
      className="group relative bg-surface-container-low border border-outline-variant/5 hover:border-primary/20 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col"
      onClick={() => onSelect(cake)}
    >
      {/* Square product image — uniform aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        {cake.image ? (
          <img
            src={cake.image}
            alt={cake.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-outline/20 font-headline text-6xl">
              {cake.vintage}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/40 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[80%]">
          {cake.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-surface-container-highest/80 text-on-surface px-2.5 py-1 text-[9px] font-label uppercase tracking-widest backdrop-blur-md border border-outline-variant/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-headline truncate">{cake.name}</h3>
            <p className="text-[10px] font-label uppercase tracking-widest text-white/40 line-clamp-2 mt-1">
              {cake.subtitle}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-base font-label text-primary font-bold whitespace-nowrap">
              {cake.priceUsd.toLocaleString()} USDT
            </div>
            <div className="text-[10px] font-label text-white/20 whitespace-nowrap">
              {cake.totalUnits.toLocaleString()} units
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="border-l border-outline-variant/30 pl-3">
            <div className="text-[10px] font-label uppercase text-white/40">
              {t("nft.vintage")}
            </div>
            <div className="text-sm font-label">{cake.vintage}</div>
          </div>
          <div className="border-l border-outline-variant/30 pl-3">
            <div className="text-[10px] font-label uppercase text-white/40">
              {t("nft.weight")}
            </div>
            <div className="text-sm font-label">{cake.weight}</div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/15 pt-5 mt-auto">
          <button className="text-[10px] font-label uppercase tracking-widest text-primary flex items-center gap-2 group/btn">
            {t("nft.viewProvenance")}
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </button>
          <button className="bg-primary-container text-primary border border-primary/20 px-4 py-2 text-[10px] font-label uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
            {t("nft.placeBid")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function NftMarketplacePage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const [selectedCake, setSelectedCake] = useState<TeaCake | null>(null);
  const t = useT();

  const listedCakes = teaCakes.filter((c) => c.isListed);

  return (
    <div className="page-padding">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-headline text-on-surface mb-4 tracking-tight leading-tight">
            {t("nft.titlePrefix")}{" "}
            <span className="text-primary">{t("nft.titleAccent")}</span>
          </h1>
          <p className="text-on-surface-variant font-body leading-relaxed opacity-80">
            {t("nft.subtitle")}
          </p>
        </div>

        <div className="flex gap-4 border-b border-outline-variant/15 pb-2">
          <div className="flex flex-col">
            <label className="text-[10px] font-label uppercase text-white/40 mb-1 tracking-tighter">
              {t("nft.sortVintage")}
            </label>
            <select className="bg-transparent border-none text-primary font-label text-xs focus:ring-0 p-0 pr-8 cursor-pointer uppercase tracking-widest outline-none">
              <option>{t("nft.oldestFirst")}</option>
              <option>{t("nft.newestFirst")}</option>
            </select>
          </div>
          <div className="w-px h-8 bg-outline-variant/15 self-end mb-1" />
          <div className="flex flex-col">
            <label className="text-[10px] font-label uppercase text-white/40 mb-1 tracking-tighter">
              {t("nft.sortPrice")}
            </label>
            <select className="bg-transparent border-none text-primary font-label text-xs focus:ring-0 p-0 pr-8 cursor-pointer uppercase tracking-widest outline-none">
              <option>{t("nft.highToLow")}</option>
              <option>{t("nft.lowToHigh")}</option>
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listedCakes.map((cake) => (
          <TeaCard
            key={cake.id}
            cake={cake}
            onSelect={setSelectedCake}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedCake && (
          <ProvenanceSidebar
            cake={selectedCake}
            onClose={() => setSelectedCake(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

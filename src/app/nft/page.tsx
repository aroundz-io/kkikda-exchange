"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type TeaCake } from "@/stores/useStore";

const CATEGORIES = ["all", "raw", "ripe", "aged"] as const;
type Category = (typeof CATEGORIES)[number];

const SORT_OPTIONS = [
  { label: "Vintage: Oldest", value: "vintage-asc" },
  { label: "Vintage: Newest", value: "vintage-desc" },
  { label: "Price: High", value: "price-desc" },
  { label: "Price: Low", value: "price-asc" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/* ---------- Tea Leaf SVG Icon ---------- */
function TeaLeafIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32 8C20 8 12 20 12 32c0 14 10 24 20 24s20-10 20-24C52 20 44 8 32 8z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <path
        d="M32 12c0 20-8 32-8 32M32 12c0 20 8 32 8 32"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.2"
      />
      <path
        d="M22 24c4 2 8 2 10 0M32 24c2 2 6 2 10 0"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
      />
    </svg>
  );
}

/* ---------- Provenance Detail Panel ---------- */
function ProvenancePanel({
  cake,
  onClose,
}: {
  cake: TeaCake;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-surface/60 backdrop-blur-sm z-40 xl:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed right-0 top-20 bottom-0 w-full sm:w-96 bg-surface-container-low border-l border-[0.5px] border-outline-variant z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          {/* Image placeholder */}
          <div className="h-72 bg-surface-container border-[0.5px] border-outline-variant flex items-center justify-center mb-6">
            <TeaLeafIcon className="w-24 h-24 text-primary/30" />
          </div>

          {/* Name */}
          <h2 className="font-headline text-2xl text-on-surface">
            {cake.name}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">{cake.subtitle}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {cake.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary text-[9px] font-label tracking-[0.15em] uppercase px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metadata */}
          <div className="mt-6 space-y-3">
            {[
              { label: "Vintage", value: String(cake.vintage) },
              { label: "Weight", value: cake.weight },
              { label: "Factory", value: cake.factory },
              { label: "Grade", value: cake.grade },
              { label: "Category", value: cake.category.toUpperCase() },
              { label: "Token ID", value: `#${cake.tokenId}` },
              { label: "Contract", value: cake.contractAddress },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center border-b border-[0.5px] border-outline-variant pb-2"
              >
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {row.label}
                </span>
                <span className="text-sm text-on-surface">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="mt-6 p-4 bg-surface border-[0.5px] border-outline-variant">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              Current Price
            </span>
            <div className="mt-1">
              <span className="font-headline text-xl text-primary">
                {cake.price} BNB
              </span>
              <span className="text-sm text-on-surface-variant ml-2">
                ${cake.priceUsd.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Provenance Timeline */}
          <div className="mt-8">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              Provenance Timeline
            </span>
            <div className="mt-4 space-y-0">
              {cake.provenance.map((entry, i) => (
                <div key={i} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-primary shrink-0 mt-1.5" />
                    {i < cake.provenance.length - 1 && (
                      <div className="w-[0.5px] flex-1 bg-outline-variant" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6">
                    <span className="font-label text-[10px] text-primary tracking-[0.15em]">
                      {entry.date}
                    </span>
                    <p className="text-sm text-on-surface font-medium mt-0.5">
                      {entry.event}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {entry.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="btn-gradient w-full mt-6">
            Inquire for Private Sale
          </button>
        </div>
      </motion.aside>
    </>
  );
}

/* ---------- Tea Cake Card ---------- */
function TeaCakeCard({
  cake,
  onSelect,
  index,
}: {
  cake: TeaCake;
  onSelect: (cake: TeaCake) => void;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-surface-container-low border-[0.5px] border-outline-variant overflow-hidden cursor-pointer group"
      onClick={() => onSelect(cake)}
    >
      {/* Image area */}
      <div className="h-64 bg-surface-container relative flex items-center justify-center">
        <TeaLeafIcon className="w-20 h-20 text-primary/20 group-hover:text-primary/30 transition-colors" />

        {/* Vintage badge */}
        <div className="absolute top-3 left-3 bg-surface/80 backdrop-blur px-2.5 py-1">
          <span className="font-label text-[10px] text-primary tracking-[0.15em]">
            {cake.vintage}
          </span>
        </div>

        {/* Grade badge */}
        {cake.grade === "AAA" && (
          <div className="absolute top-3 right-3 bg-primary/15 backdrop-blur px-2 py-0.5">
            <span className="font-label text-[9px] text-primary tracking-[0.15em]">
              {cake.grade}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            {cake.grade}
          </span>
          <span className="text-outline-variant">|</span>
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            {cake.weight}
          </span>
          <span className="text-outline-variant">|</span>
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
            {cake.factory}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-headline text-lg text-on-surface">{cake.name}</h3>
        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
          {cake.subtitle}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {cake.tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary text-[9px] font-label tracking-[0.15em] uppercase px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-[0.5px] border-outline-variant">
          <div>
            <span className="font-headline text-lg text-primary">
              {cake.price} BNB
            </span>
            <span className="text-xs text-on-surface-variant ml-2">
              ${cake.priceUsd.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(cake);
              }}
              className="text-primary text-xs font-label tracking-[0.1em] hover:underline"
            >
              View Provenance
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="btn-gradient text-[9px] px-4 py-2"
            >
              Place Bid
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Main Page ---------- */
export default function NftMarketplacePage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortValue>("vintage-asc");
  const [selectedCake, setSelectedCake] = useState<TeaCake | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let result =
      category === "all"
        ? teaCakes.filter((c) => c.isListed)
        : teaCakes.filter((c) => c.isListed && c.category === category);

    switch (sort) {
      case "vintage-asc":
        result = [...result].sort((a, b) => a.vintage - b.vintage);
        break;
      case "vintage-desc":
        result = [...result].sort((a, b) => b.vintage - a.vintage);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
    }

    return result;
  }, [teaCakes, category, sort]);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

  return (
    <div className="p-6 lg:p-10">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
          Curated Collection
        </span>
        <h1 className="font-headline text-4xl mt-2 text-shadow-gold">
          The Marketplace of{" "}
          <em className="text-primary not-italic italic">Provenance</em>
        </h1>
      </motion.div>

      {/* ── Controls ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 gap-4"
      >
        {/* Category tabs */}
        <div className="flex gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 transition-colors border-[0.5px] ${
                category === cat
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-outline border-transparent hover:text-on-surface hover:border-outline-variant"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="font-label text-[10px] uppercase tracking-[0.15em] text-outline hover:text-on-surface px-4 py-2 border-[0.5px] border-outline-variant flex items-center gap-2 transition-colors"
          >
            {currentSortLabel}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 4l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 bg-surface-container-low border-[0.5px] border-outline-variant z-30 min-w-[180px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setSortOpen(false);
                    }}
                    className={`block w-full text-left font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 transition-colors ${
                      sort === opt.value
                        ? "text-primary bg-primary/5"
                        : "text-outline hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Grid ── */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <TeaLeafIcon className="w-16 h-16 text-outline-variant mx-auto mb-4" />
            <p className="font-headline text-lg text-on-surface-variant">
              No tea cakes found
            </p>
            <p className="text-sm text-outline mt-1">
              Try adjusting your filters
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((cake, i) => (
              <TeaCakeCard
                key={cake.id}
                cake={cake}
                onSelect={setSelectedCake}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Provenance Panel ── */}
      <AnimatePresence>
        {selectedCake && (
          <ProvenancePanel
            cake={selectedCake}
            onClose={() => setSelectedCake(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, NFTItem } from "@/stores/useStore";
import { t, formatNumber } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["all", "tea", "art", "membership", "rwa"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  tea: "Tea",
  art: "Art",
  membership: "Membership",
  rwa: "RWA",
};

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low \u2192 High" },
  { value: "price-desc", label: "Price: High \u2192 Low" },
  { value: "recent", label: "Recently Listed" },
  { value: "rarity", label: "Rarity" },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const RARITY_ORDER: Record<string, number> = {
  mythic: 4,
  legendary: 3,
  rare: 2,
  common: 1,
};

const RARITY_STYLES: Record<string, string> = {
  common: "bg-surface-mid text-on-surface-dim",
  rare: "bg-blue-900/40 text-blue-300",
  legendary: "bg-accent/20 text-accent",
  mythic: "bg-primary/20 text-primary",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  tea: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-on-surface-dim/30">
      <path d="M12 28c0 6 5.4 10 12 10s12-4 12-10" />
      <path d="M8 18h32v2c0 2-1 4-3 6H11c-2-2-3-4-3-6v-2z" />
      <path d="M36 22h4a4 4 0 0 1 0 8h-3" />
      <path d="M18 10c1-3 3-4 3-7" />
      <path d="M24 10c1-3 3-4 3-7" />
      <path d="M30 10c1-3 3-4 3-7" />
    </svg>
  ),
  art: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-on-surface-dim/30">
      <rect x="6" y="6" width="36" height="36" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 34l10-10 6 6 8-10 12 14" />
    </svg>
  ),
  membership: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-on-surface-dim/30">
      <path d="M24 4l6 12 13 2-9.5 9 2.5 13L24 34l-12 6 2.5-13L5 18l13-2z" />
    </svg>
  ),
  rwa: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-on-surface-dim/30">
      <rect x="8" y="12" width="32" height="24" />
      <path d="M8 20h32" />
      <circle cx="24" cy="28" r="4" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NFTMarketplace() {
  const { nfts, lang } = useStore();

  const [filter, setFilter] = useState<Category>("all");
  const [sort, setSort] = useState<SortValue>("recent");
  const [search, setSearch] = useState("");
  const [selectedNft, setSelectedNft] = useState<NFTItem | null>(null);

  /* ---- derived data ---- */

  const listedNfts = useMemo(() => nfts.filter((n) => n.isListed && !n.isBurned), [nfts]);

  const filtered = useMemo(() => {
    let items = listedNfts;

    if (filter !== "all") {
      items = items.filter((n) => n.category === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.collection.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case "price-asc":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case "rarity":
        items = [...items].sort(
          (a, b) => (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0),
        );
        break;
      case "recent":
      default:
        items = [...items].reverse();
        break;
    }

    return items;
  }, [listedNfts, filter, search, sort]);

  /* ---- stats ---- */

  const stats = useMemo(() => {
    const floor = listedNfts.length
      ? Math.min(...listedNfts.map((n) => n.price))
      : 0;
    const volume = listedNfts.reduce((s, n) => s + n.priceUsd, 0);
    const owners = new Set(listedNfts.map((n) => n.owner)).size;
    return { floor, volume, owners, items: listedNfts.length };
  }, [listedNfts]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section className="min-h-screen bg-surface">
      {/* ---------- Collection stats bar ---------- */}
      <div className="border-b border-outline-ghost bg-surface-low">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Floor Price", value: `${stats.floor.toFixed(2)} ETH` },
            { label: "Total Volume", value: formatNumber(stats.volume) },
            { label: "Unique Owners", value: String(stats.owners) },
            { label: "Items", value: String(stats.items) },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-dim">
                {s.label}
              </p>
              <p className="text-lg font-mono text-on-surface mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ---------- Header ---------- */}
        <div className="mb-8">
          <h1 className="text-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            NFT Marketplace
          </h1>
          <p className="mt-2 text-sm text-on-surface-dim max-w-lg">
            Discover and collect authenticated tea-culture NFTs — from legendary
            vintage cakes to master-crafted teaware and exclusive memberships.
          </p>
        </div>

        {/* ---------- Filters row ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  filter === cat
                    ? "bg-primary text-surface"
                    : "bg-surface-mid text-on-surface-mid hover:text-on-surface"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search NFTs..."
            className="input-scholar w-full sm:w-64 text-sm"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="bg-surface-mid border border-outline-ghost text-on-surface text-xs font-mono px-3 py-2 focus:outline-none focus:border-primary"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- NFT Grid ---------- */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-on-surface-dim text-sm font-mono">
            No NFTs found.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {filtered.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onSelect={() => setSelectedNft(nft)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* ---------- Detail Modal ---------- */}
      <AnimatePresence>
        {selectedNft && (
          <NFTDetailModal
            nft={selectedNft}
            onClose={() => setSelectedNft(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  NFT Card                                                           */
/* ------------------------------------------------------------------ */

function NFTCard({
  nft,
  onSelect,
}: {
  nft: NFTItem;
  onSelect: () => void;
}) {
  const { purchaseNft, connectWallet, user } = useStore();

  const handleBuy = () => {
    if (user.address) {
      purchaseNft(nft.id);
    } else {
      connectWallet();
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "tween", duration: 0.25 }}
      onClick={onSelect}
      className="group bg-surface-low border border-outline-ghost cursor-pointer transition-shadow hover:shadow-ambient"
    >
      {/* Image placeholder */}
      <div className="relative aspect-square bg-gradient-to-br from-primary-dark/30 via-surface-mid to-accent/10 flex items-center justify-center overflow-hidden">
        {CATEGORY_ICONS[nft.category] ?? CATEGORY_ICONS.tea}

        {/* Rarity badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${RARITY_STYLES[nft.rarity]}`}
        >
          {nft.rarity}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-dim">
          {nft.collection}
        </p>
        <p className="text-sm font-medium text-on-surface truncate">
          {nft.name}
        </p>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-mono text-sm text-on-surface">
              {nft.price} ETH
            </span>
            <span className="font-mono text-[11px] text-on-surface-dim ml-1.5">
              ({formatNumber(nft.priceUsd)})
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBuy();
          }}
          className="btn-gold w-full py-2 text-xs mt-2"
        >
          {user.address ? "Buy Now" : "Connect Wallet"}
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Modal                                                       */
/* ------------------------------------------------------------------ */

function NFTDetailModal({
  nft,
  onClose,
}: {
  nft: NFTItem;
  onClose: () => void;
}) {
  const { purchaseNft, connectWallet, user } = useStore();

  const handleBuy = () => {
    if (user.address) {
      purchaseNft(nft.id);
    } else {
      connectWallet();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 glass backdrop-blur-md" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "tween", duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-surface-low border border-outline-ghost w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center text-on-surface-mid hover:text-on-surface transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: image */}
          <div className="aspect-square bg-gradient-to-br from-primary-dark/30 via-surface-mid to-accent/10 flex items-center justify-center">
            {CATEGORY_ICONS[nft.category] ?? CATEGORY_ICONS.tea}
          </div>

          {/* Right: details */}
          <div className="p-6 space-y-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-dim">
                {nft.collection}
              </p>
              <h2 className="text-serif text-2xl font-bold text-on-surface mt-1">
                {nft.name}
              </h2>
              <span
                className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${RARITY_STYLES[nft.rarity]}`}
              >
                {nft.rarity}
              </span>
            </div>

            <p className="text-sm text-on-surface-mid leading-relaxed">
              {nft.description}
            </p>

            {/* Price */}
            <div className="border-t border-b border-outline-ghost py-3 flex items-baseline gap-3">
              <span className="font-mono text-xl text-on-surface">
                {nft.price} ETH
              </span>
              <span className="font-mono text-sm text-on-surface-dim">
                {formatNumber(nft.priceUsd)}
              </span>
            </div>

            {/* Owner / Creator */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-on-surface-dim font-mono uppercase tracking-wider mb-0.5">
                  Owner
                </p>
                <p className="font-mono text-on-surface">{nft.owner}</p>
              </div>
              <div>
                <p className="text-on-surface-dim font-mono uppercase tracking-wider mb-0.5">
                  Creator
                </p>
                <p className="font-mono text-on-surface">{nft.creator}</p>
              </div>
            </div>

            {/* Attributes */}
            {nft.attributes.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-dim mb-2">
                  Attributes
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.map((attr) => (
                    <div
                      key={attr.trait}
                      className="bg-surface-mid border border-outline-ghost px-3 py-2"
                    >
                      <p className="text-[10px] font-mono uppercase text-on-surface-dim">
                        {attr.trait}
                      </p>
                      <p className="text-sm font-medium text-on-surface mt-0.5">
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provenance Timeline */}
            {nft.history.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-dim mb-3">
                  Provenance
                </p>
                <div className="relative pl-5">
                  {/* Dashed vertical line */}
                  <div className="absolute left-[5px] top-1 bottom-1 w-px border-l border-dashed border-outline" />

                  <div className="space-y-4">
                    {nft.history.map((ev, i) => (
                      <div key={i} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-5 top-1 w-[10px] h-[10px] border border-primary bg-surface" />
                        <p className="text-xs font-mono text-on-surface-dim">
                          {ev.date}
                        </p>
                        <p className="text-sm text-on-surface">
                          {ev.event}{" "}
                          <span className="font-mono text-on-surface-mid">
                            {ev.value}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Buy button */}
            <button onClick={handleBuy} className="btn-gold w-full py-3 text-sm mt-2">
              {user.address ? <>Buy Now &mdash; {nft.price} ETH</> : "Connect Wallet"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

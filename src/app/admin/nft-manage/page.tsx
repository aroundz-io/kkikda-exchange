"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useStore, type TeaCake } from "@/stores/useStore";
import { useNFTMint } from "@/hooks/useNFTContract";
import { buildTeaCakeURI } from "@/lib/web3/metadata";
import { ADDRESSES } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function gradeBadge(grade: string) {
  if (grade === "AAA")
    return "text-primary border-primary/40 bg-primary/10";
  if (grade === "AA+")
    return "text-secondary border-secondary/40 bg-secondary/10";
  return "text-outline border-outline/40 bg-outline/10";
}

function formatUsd(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

const INITIAL_FORM = {
  name: "",
  subtitle: "",
  vintage: "",
  weight: "",
  factory: "",
  grade: "AAA",
  category: "raw" as TeaCake["category"],
  priceBnb: "",
  priceUsd: "",
  tags: "",
};

export default function NftManagePage() {
  const teaCakes = useStore((s) => s.teaCakes);
  const addTeaCake = useStore((s) => s.addTeaCake);
  const removeTeaCake = useStore((s) => s.removeTeaCake);
  const addToast = useStore((s) => s.addToast);

  const { address, isConnected } = useAccount();
  const {
    mint,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset,
  } = useNFTMint();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMintForm, setShowMintForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [pendingCake, setPendingCake] = useState<TeaCake | null>(null);

  // After tx confirms, persist the new cake to the local store with the real tx hash.
  useEffect(() => {
    if (isSuccess && pendingCake && hash) {
      addTeaCake({ ...pendingCake, contractAddress: hash });
      setPendingCake(null);
      setForm(INITIAL_FORM);
      setShowMintForm(false);
      reset();
    }
  }, [isSuccess, pendingCake, hash, addTeaCake, reset]);

  const totalAssets = teaCakes.length;
  const totalValue = teaCakes.reduce((s, t) => s + t.priceUsd, 0);
  const avgVintage =
    teaCakes.length > 0
      ? Math.round(
          teaCakes.reduce((s, t) => s + t.vintage, 0) / teaCakes.length
        )
      : 0;

  const stats = [
    { label: "Total Assets", value: totalAssets.toString() },
    { label: "Total Value", value: formatUsd(totalValue) },
    { label: "Avg Vintage", value: avgVintage.toString() },
  ];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isConnected || !address) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Connect your wallet to mint NFTs on BSC.",
      });
      return;
    }

    const maxTokenId =
      teaCakes.length > 0
        ? Math.max(...teaCakes.map((t) => t.tokenId))
        : 0;

    const today = new Date().toISOString().slice(0, 10);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const cake: TeaCake = {
      id: `tc-${Date.now()}`,
      name: form.name,
      subtitle: form.subtitle,
      vintage: Number(form.vintage) || new Date().getFullYear(),
      weight: form.weight || "357g",
      factory: form.factory,
      grade: form.grade,
      image: "",
      price: Number(form.priceBnb) || 0,
      priceUsd: Number(form.priceUsd) || 0,
      appraisal: Number(form.priceUsd) || 0,
      tags,
      category: form.category,
      tokenId: maxTokenId + 1,
      contractAddress: ADDRESSES.KKIKDA_NFT,
      owner: address,
      isListed: true,
      provenance: [
        { date: today, event: "Minted", detail: "Minted via Admin Panel" },
      ],
    };

    const uri = buildTeaCakeURI({
      name: cake.name,
      description: cake.subtitle,
      vintage: cake.vintage,
      weight: cake.weight,
      factory: cake.factory,
      grade: cake.grade,
      category: cake.category,
      priceBnb: cake.price,
      priceUsd: cake.priceUsd,
      tags: cake.tags,
      mintedAt: today,
    });

    setPendingCake(cake);
    mint(address, uri);
  }

  const inputClass =
    "w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors";

  const selectClass =
    "w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface outline-none focus:border-primary transition-colors";

  return (
    <div className="page-padding space-y-10">
      {/* ── Header ── */}
      <motion.header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        {...fade}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-4xl text-on-surface">
          Tokenized Inventory
        </h1>
        <button
          onClick={() => setShowMintForm((v) => !v)}
          className="btn-gradient inline-block text-center"
        >
          {showMintForm ? "Cancel" : "Mint New Asset"}
        </button>
      </motion.header>

      {/* ── Mint Form ── */}
      <AnimatePresence>
        {showMintForm && (
          <motion.form
            key="mint-form"
            onSubmit={handleSubmit}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="font-headline text-xl text-on-surface">
              Mint New NFT
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Menghai '88 Qing Bing"
                  className={inputClass}
                />
              </div>

              {/* Subtitle / Description */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Subtitle / Description
                </label>
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Short description"
                  className={inputClass}
                />
              </div>

              {/* Vintage Year */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Vintage Year
                </label>
                <input
                  name="vintage"
                  type="number"
                  value={form.vintage}
                  onChange={handleChange}
                  placeholder="e.g. 1988"
                  className={inputClass}
                />
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Weight
                </label>
                <input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="e.g. 357g"
                  className={inputClass}
                />
              </div>

              {/* Factory */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Factory
                </label>
                <input
                  name="factory"
                  value={form.factory}
                  onChange={handleChange}
                  placeholder="e.g. Menghai Tea Factory"
                  className={inputClass}
                />
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Grade
                </label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="AAA">AAA</option>
                  <option value="AA+">AA+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="raw">Raw</option>
                  <option value="ripe">Ripe</option>
                  <option value="aged">Aged</option>
                  <option value="white">White</option>
                </select>
              </div>

              {/* Price in BNB */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Price in BNB
                </label>
                <input
                  name="priceBnb"
                  type="number"
                  step="any"
                  value={form.priceBnb}
                  onChange={handleChange}
                  placeholder="e.g. 4.8"
                  className={inputClass}
                />
              </div>

              {/* Price in USD */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Price in USD
                </label>
                <input
                  name="priceUsd"
                  type="number"
                  step="any"
                  value={form.priceUsd}
                  onChange={handleChange}
                  placeholder="e.g. 12450"
                  className={inputClass}
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Tags
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="Audited, Rare, Certified"
                  className={inputClass}
                />
              </div>
            </div>

            <TxStatus
              hash={hash}
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isSuccess && !!pendingCake}
              isError={isError}
              error={error}
            />

            {!isConnected && (
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-error">
                Connect your wallet to mint on BSC.
              </p>
            )}

            <button
              type="submit"
              disabled={!isConnected || isPending || isConfirming}
              className="btn-gradient disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Awaiting signature…"
                : isConfirming
                  ? "Confirming on-chain…"
                  : "Mint NFT on BSC"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Stats Row ── */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-5 text-center"
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-2">
              {stat.label}
            </p>
            <p className="font-headline text-2xl text-on-surface">
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── View Toggle ── */}
      <motion.div
        className="flex items-center gap-2"
        {...fade}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
            viewMode === "grid"
              ? "border-primary text-primary bg-primary/5"
              : "border-outline-variant text-outline hover:text-on-surface"
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
            viewMode === "list"
              ? "border-primary text-primary bg-primary/5"
              : "border-outline-variant text-outline hover:text-on-surface"
          }`}
        >
          List
        </button>
      </motion.div>

      {/* ── Inventory ── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teaCakes.map((cake, i) => (
            <motion.div
              key={cake.id}
              className="bg-surface-container-low border-[0.5px] border-outline-variant overflow-hidden group relative"
              {...fade}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            >
              {/* Delete Button */}
              <button
                onClick={() => removeTeaCake(cake.id)}
                className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center bg-surface-container border-[0.5px] border-outline-variant text-outline hover:text-error hover:border-error/40 transition-colors font-label text-xs"
                title="Remove"
              >
                X
              </button>

              {/* Image Placeholder */}
              <div className="aspect-[4/5] bg-surface-container flex items-center justify-center relative">
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {cake.weight}
                </span>
                {/* Grade Badge */}
                <span
                  className={`absolute top-3 right-3 font-label text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border-[0.5px] ${gradeBadge(cake.grade)}`}
                >
                  {cake.grade}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-headline text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                  {cake.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {cake.vintage}
                  </p>
                  <p className="font-headline text-sm text-primary">
                    ${cake.priceUsd.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cake.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="font-label text-[9px] uppercase tracking-[0.15em] text-outline border-[0.5px] border-outline-variant/30 px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {teaCakes.map((cake, i) => (
            <motion.div
              key={cake.id}
              className="bg-surface-container-low border-[0.5px] border-outline-variant p-4 flex items-center gap-4"
              {...fade}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
            >
              <div className="w-14 h-14 bg-surface-container shrink-0 flex items-center justify-center">
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-outline">
                  {cake.weight}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-sm text-on-surface truncate">
                    {cake.name}
                  </h3>
                  <span
                    className={`font-label text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 border-[0.5px] shrink-0 ${gradeBadge(cake.grade)}`}
                  >
                    {cake.grade}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">
                  {cake.factory} &middot; {cake.vintage} &middot;{" "}
                  {cake.category}
                </p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-3">
                <div>
                  <p className="font-headline text-sm text-primary">
                    ${cake.priceUsd.toLocaleString()}
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {cake.price} BNB
                  </p>
                </div>
                <button
                  onClick={() => removeTeaCake(cake.id)}
                  className="w-6 h-6 flex items-center justify-center border-[0.5px] border-outline-variant text-outline hover:text-error hover:border-error/40 transition-colors font-label text-xs"
                  title="Remove"
                >
                  X
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

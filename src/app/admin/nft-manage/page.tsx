"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, NFTItem } from "@/stores/useStore";
import { t } from "@/lib/i18n";

type ModalMode = null | "create" | "detail";

export default function AdminNFTPage() {
  const { lang, nfts, addNft, updateNft } = useStore();
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedNft, setSelectedNft] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "listed" | "burned">("all");

  const [form, setForm] = useState({
    name: "",
    description: "",
    collection: "",
    category: "tea" as NFTItem["category"],
    rarity: "common" as NFTItem["rarity"],
    price: "",
    attributes: [{ trait: "", value: "" }],
  });

  const filteredNfts = nfts.filter((n) => {
    if (filter === "listed") return n.isListed && !n.isBurned;
    if (filter === "burned") return n.isBurned;
    return true;
  });

  const handleCreate = () => {
    if (!form.name) return;
    addNft({
      id: `nft-${Date.now()}`,
      name: form.name,
      description: form.description,
      image: "",
      price: parseFloat(form.price) || 0,
      priceUsd: (parseFloat(form.price) || 0) * 2450,
      owner: "0x0000...0000",
      creator: "0x7a3F...9e2B",
      collection: form.collection,
      category: form.category,
      rarity: form.rarity,
      isListed: true,
      isBurned: false,
      tokenId: nfts.length + 1,
      contractAddress: `0x${Date.now().toString(16)}`,
      attributes: form.attributes.filter((a) => a.trait && a.value),
      history: [{ date: new Date().toISOString().slice(0, 7), event: "Minted", value: `${form.price} ETH` }],
    });
    setForm({
      name: "",
      description: "",
      collection: "",
      category: "tea",
      rarity: "common",
      price: "",
      attributes: [{ trait: "", value: "" }],
    });
    setModal(null);
  };

  const handleBurnNft = (id: string) => {
    updateNft(id, { isBurned: true, isListed: false });
  };

  const handleToggleListing = (id: string) => {
    const nft = nfts.find((n) => n.id === id);
    if (nft && !nft.isBurned) {
      updateNft(id, { isListed: !nft.isListed });
    }
  };

  const sel = nfts.find((n) => n.id === selectedNft);

  const rarityColor = (r: string) => {
    switch (r) {
      case "mythic": return "text-primary bg-primary-dim";
      case "legendary": return "text-accent bg-accent/10";
      case "rare": return "text-[#4A90D9] bg-[#4A90D9]/10";
      default: return "text-on-surface-dim bg-surface-mid";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-serif text-2xl font-bold mb-1">
            {t("admin.nfts", lang)}
          </h1>
          <p className="text-xs text-on-surface-dim">
            Create, list, delist, and burn NFTs.
          </p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="btn-gold px-4 py-2 text-xs"
        >
          + MINT NFT
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "listed", "burned"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider ${
              filter === f
                ? "bg-primary-dim text-primary"
                : "text-on-surface-dim hover:text-on-surface"
            }`}
          >
            {f} ({nfts.filter((n) => f === "all" ? true : f === "listed" ? n.isListed && !n.isBurned : n.isBurned).length})
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredNfts.map((nft, i) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-surface-low transition-all hover:bg-surface-mid ${
              nft.isBurned ? "opacity-50" : ""
            }`}
          >
            {/* Image placeholder */}
            <div className="aspect-square bg-gradient-to-br from-surface-mid to-surface-high flex items-center justify-center relative">
              <span className="text-3xl text-on-surface-dim/20 text-serif">
                {nft.category === "tea" ? "茶" : nft.category === "art" ? "藝" : "◈"}
              </span>
              {nft.isBurned && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
                  <span className="text-error font-mono text-sm font-bold">BURNED</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-on-surface-dim font-mono">
                  {nft.collection}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 ${rarityColor(nft.rarity)}`}>
                  {nft.rarity}
                </span>
              </div>
              <h3 className="text-sm font-semibold mb-2 truncate">{nft.name}</h3>
              <div className="text-sm font-mono text-primary mb-3">
                {nft.price} ETH
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setSelectedNft(nft.id);
                    setModal("detail");
                  }}
                  className="btn-ghost flex-1 py-1.5 text-[10px]"
                >
                  Detail
                </button>
                {!nft.isBurned && (
                  <>
                    <button
                      onClick={() => handleToggleListing(nft.id)}
                      className="btn-ghost flex-1 py-1.5 text-[10px]"
                    >
                      {nft.isListed ? "Delist" : "List"}
                    </button>
                    <button
                      onClick={() => handleBurnNft(nft.id)}
                      className="flex-1 py-1.5 text-[10px] font-mono text-error bg-error-dim cursor-pointer"
                    >
                      Burn
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
              onClick={() => setModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-low p-8 max-w-lg w-full z-10 max-h-[80vh] overflow-y-auto"
            >
              {modal === "create" && (
                <>
                  <h3 className="text-serif text-lg font-bold mb-1">Mint New NFT</h3>
                  <p className="text-xs text-on-surface-dim mb-6">
                    Create and mint a new NFT to the marketplace.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                        Name
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Vintage Pu'er Cake #001"
                        className="input-scholar text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe the NFT..."
                        rows={3}
                        className="input-scholar text-sm resize-none"
                        style={{ borderBottom: "none", border: "0.5px solid var(--color-outline)" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Collection
                        </label>
                        <input
                          value={form.collection}
                          onChange={(e) => setForm({ ...form, collection: e.target.value })}
                          placeholder="Legendary Vintages"
                          className="input-scholar text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Price (ETH)
                        </label>
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          placeholder="0.00"
                          className="input-scholar text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value as NFTItem["category"] })}
                          className="input-scholar text-sm bg-transparent"
                        >
                          <option value="tea">Tea</option>
                          <option value="art">Art</option>
                          <option value="membership">Membership</option>
                          <option value="rwa">RWA</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Rarity
                        </label>
                        <select
                          value={form.rarity}
                          onChange={(e) => setForm({ ...form, rarity: e.target.value as NFTItem["rarity"] })}
                          className="input-scholar text-sm bg-transparent"
                        >
                          <option value="common">Common</option>
                          <option value="rare">Rare</option>
                          <option value="legendary">Legendary</option>
                          <option value="mythic">Mythic</option>
                        </select>
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-mono text-on-surface-dim tracking-widest uppercase">
                          Attributes
                        </label>
                        <button
                          onClick={() =>
                            setForm({
                              ...form,
                              attributes: [...form.attributes, { trait: "", value: "" }],
                            })
                          }
                          className="text-[10px] font-mono text-primary cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                      {form.attributes.map((attr, i) => (
                        <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            value={attr.trait}
                            onChange={(e) => {
                              const attrs = [...form.attributes];
                              attrs[i] = { ...attrs[i], trait: e.target.value };
                              setForm({ ...form, attributes: attrs });
                            }}
                            placeholder="Trait"
                            className="input-scholar text-xs"
                          />
                          <input
                            value={attr.value}
                            onChange={(e) => {
                              const attrs = [...form.attributes];
                              attrs[i] = { ...attrs[i], value: e.target.value };
                              setForm({ ...form, attributes: attrs });
                            }}
                            placeholder="Value"
                            className="input-scholar text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setModal(null)} className="btn-ghost flex-1 py-2 text-xs">
                      Cancel
                    </button>
                    <button onClick={handleCreate} className="btn-gold flex-1 py-2 text-xs">
                      MINT NFT
                    </button>
                  </div>
                </>
              )}

              {modal === "detail" && sel && (
                <>
                  <h3 className="text-serif text-lg font-bold mb-1">{sel.name}</h3>
                  <p className="text-xs text-on-surface-dim mb-6">{sel.description}</p>
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex justify-between p-2 bg-surface-mid">
                      <span className="text-on-surface-dim">Token ID</span>
                      <span className="font-mono">#{sel.tokenId}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-surface-mid">
                      <span className="text-on-surface-dim">Contract</span>
                      <span className="font-mono">{sel.contractAddress}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-surface-mid">
                      <span className="text-on-surface-dim">Owner</span>
                      <span className="font-mono">{sel.owner}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-surface-mid">
                      <span className="text-on-surface-dim">Status</span>
                      <span className={`font-mono ${sel.isBurned ? "text-error" : sel.isListed ? "text-secondary" : "text-on-surface-dim"}`}>
                        {sel.isBurned ? "Burned" : sel.isListed ? "Listed" : "Delisted"}
                      </span>
                    </div>
                  </div>
                  {sel.attributes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-2">
                        Attributes
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sel.attributes.map((a, i) => (
                          <div key={i} className="bg-surface-mid p-2 text-xs">
                            <div className="text-on-surface-dim text-[10px]">{a.trait}</div>
                            <div className="font-mono">{a.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {sel.history.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-2">
                        Provenance
                      </div>
                      {sel.history.map((h, i) => (
                        <div key={i} className="flex gap-3 py-2 border-b border-outline-ghost text-xs last:border-0">
                          <span className="text-on-surface-dim font-mono w-16 shrink-0">{h.date}</span>
                          <span>{h.event}</span>
                          <span className="ml-auto font-mono text-accent">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setModal(null)} className="btn-ghost w-full py-2 text-xs">
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

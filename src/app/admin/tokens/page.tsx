"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type Token } from "@/stores/useStore";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const genId = () => Math.random().toString(36).slice(2, 10);

export default function AdminTokensPage() {
  const tokens = useStore((s) => s.tokens);
  const addToken = useStore((s) => s.addToken);
  const updateToken = useStore((s) => s.updateToken);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newMaxSupply, setNewMaxSupply] = useState("");

  const selectedToken = tokens.find((t) => t.id === selectedId) ?? null;

  function handleCreate() {
    if (!newName || !newSymbol || !newMaxSupply) return;

    const token: Token = {
      id: genId(),
      symbol: newSymbol.toUpperCase(),
      name: newName,
      price: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      supply: 0,
      maxSupply: Number(newMaxSupply),
      category: "utility",
      isPaused: false,
      contractAddress: `0x${genId()}...${genId()}`,
    };

    addToken(token);
    setNewName("");
    setNewSymbol("");
    setNewMaxSupply("");
    setShowCreate(false);
  }

  function togglePause(id: string, current: boolean) {
    updateToken(id, { isPaused: !current });
  }

  return (
    <div className="page-padding space-y-10">
      {/* ── Header ── */}
      <motion.header
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        {...fade}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-headline text-4xl text-on-surface">
          Token Management
        </h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-gradient"
        >
          {showCreate ? "Cancel" : "Create New Token"}
        </button>
      </motion.header>

      {/* ── Create Token Form ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              New Token
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Name
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Yunnan Gold"
                  className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Symbol
                </label>
                <input
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="e.g. YGLD"
                  className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Max Supply
                </label>
                <input
                  value={newMaxSupply}
                  onChange={(e) => setNewMaxSupply(e.target.value)}
                  placeholder="e.g. 1000000"
                  type="number"
                  className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName || !newSymbol || !newMaxSupply}
              className="btn-gradient disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Create Token
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Token List + Detail ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Token List */}
        <div className="col-span-12 lg:col-span-7 space-y-3">
          {tokens.map((token, i) => (
            <motion.button
              key={token.id}
              onClick={() =>
                setSelectedId(selectedId === token.id ? null : token.id)
              }
              className={`w-full text-left bg-surface-container-low border-[0.5px] p-5 transition-colors ${
                selectedId === token.id
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant hover:border-outline"
              }`}
              {...fade}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-container-high border-[0.5px] border-outline-variant flex items-center justify-center">
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-primary">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-base text-on-surface">
                      {token.symbol}
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      {token.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline text-sm text-on-surface">
                    ${token.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span
                      className={`font-label text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border-[0.5px] ${
                        token.isPaused
                          ? "text-error border-error/40"
                          : "text-secondary border-secondary/40"
                      }`}
                    >
                      {token.isPaused ? "Paused" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-3 font-body text-xs text-on-surface-variant">
                <span>
                  Supply: {token.supply.toLocaleString()} /{" "}
                  {token.maxSupply.toLocaleString()}
                </span>
                <span>
                  Vol 24h: ${token.volume24h.toLocaleString()}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail / Edit Panel */}
        <div className="col-span-12 lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedToken ? (
              <motion.div
                key={selectedToken.id}
                className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-5 sticky top-24"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  Token Detail
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-headline text-2xl text-on-surface">
                      {selectedToken.symbol}
                    </span>
                    <span className="font-body text-sm text-on-surface-variant">
                      {selectedToken.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Price", value: `$${selectedToken.price.toLocaleString()}` },
                      { label: "24h Change", value: `${selectedToken.change24h > 0 ? "+" : ""}${selectedToken.change24h}%` },
                      { label: "Market Cap", value: `$${selectedToken.marketCap.toLocaleString()}` },
                      { label: "Category", value: selectedToken.category },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                          {item.label}
                        </p>
                        <p className="font-body text-sm text-on-surface">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Supply */}
                  <div className="space-y-1">
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                      Supply
                    </p>
                    <div className="h-1.5 bg-surface-container-high overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(selectedToken.supply / selectedToken.maxSupply) * 100}%`,
                        }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <p className="font-body text-xs text-on-surface-variant">
                      {selectedToken.supply.toLocaleString()} /{" "}
                      {selectedToken.maxSupply.toLocaleString()}
                    </p>
                  </div>

                  {/* Contract */}
                  <div className="space-y-1">
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                      Contract
                    </p>
                    <p className="font-label text-[10px] text-on-surface-variant">
                      {selectedToken.contractAddress}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() =>
                      togglePause(selectedToken.id, selectedToken.isPaused)
                    }
                    className={`flex-1 py-2.5 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] transition-colors ${
                      selectedToken.isPaused
                        ? "bg-secondary/10 text-secondary border-secondary/40 hover:bg-secondary/20"
                        : "bg-error/10 text-error border-error/40 hover:bg-error/20"
                    }`}
                  >
                    {selectedToken.isPaused ? "Resume Token" : "Pause Token"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 flex items-center justify-center h-48"
                {...fade}
              >
                <p className="font-body text-xs text-outline">
                  Select a token to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

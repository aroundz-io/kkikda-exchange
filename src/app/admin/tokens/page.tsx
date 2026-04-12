"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Token } from "@/stores/useStore";
import { t, formatNumber, formatPercent } from "@/lib/i18n";

type ModalMode = null | "mint" | "burn" | "create";

export default function AdminTokensPage() {
  const { lang, tokens, addToken, updateToken } = useStore();
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  // New token form
  const [newToken, setNewToken] = useState({
    symbol: "",
    name: "",
    nameKo: "",
    price: "",
    maxSupply: "",
    category: "rwa" as Token["category"],
    contractAddress: "",
  });

  const handleMint = () => {
    if (!selectedToken || !mintAmount) return;
    const token = tokens.find((tk) => tk.id === selectedToken);
    if (token) {
      updateToken(selectedToken, {
        supply: token.supply + parseInt(mintAmount),
      });
    }
    setMintAmount("");
    setModal(null);
  };

  const handleBurn = () => {
    if (!selectedToken || !burnAmount) return;
    const token = tokens.find((tk) => tk.id === selectedToken);
    if (token) {
      const burnAmt = Math.min(parseInt(burnAmount), token.supply);
      updateToken(selectedToken, { supply: token.supply - burnAmt });
    }
    setBurnAmount("");
    setModal(null);
  };

  const handlePause = (id: string) => {
    const token = tokens.find((tk) => tk.id === id);
    if (token) {
      updateToken(id, { isPaused: !token.isPaused });
    }
  };

  const handleCreate = () => {
    if (!newToken.symbol || !newToken.name) return;
    addToken({
      id: `token-${Date.now()}`,
      symbol: newToken.symbol.toUpperCase(),
      name: newToken.name,
      nameKo: newToken.nameKo,
      price: parseFloat(newToken.price) || 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      supply: 0,
      maxSupply: parseInt(newToken.maxSupply) || 1_000_000,
      image: "",
      category: newToken.category,
      isPaused: false,
      contractAddress: newToken.contractAddress || `0x${Date.now().toString(16)}`,
    });
    setNewToken({
      symbol: "",
      name: "",
      nameKo: "",
      price: "",
      maxSupply: "",
      category: "rwa",
      contractAddress: "",
    });
    setModal(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-serif text-2xl font-bold mb-1">
            {t("admin.tokens", lang)}
          </h1>
          <p className="text-xs text-on-surface-dim">
            Mint, burn, pause, and create tokens.
          </p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="btn-gold px-4 py-2 text-xs"
        >
          + CREATE TOKEN
        </button>
      </div>

      {/* Tokens Table */}
      <div className="bg-surface-low overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] font-mono text-on-surface-dim tracking-widest uppercase">
              <th className="p-4">Token</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">Supply</th>
              <th className="p-4 text-right">Max Supply</th>
              <th className="p-4 text-right">Market Cap</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((tk, i) => (
              <motion.tr
                key={tk.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-t border-outline-ghost hover:bg-surface-mid transition-colors"
              >
                <td className="p-4">
                  <div className="font-mono font-semibold">{tk.symbol}</div>
                  <div className="text-on-surface-dim text-[10px]">{tk.name}</div>
                </td>
                <td className="p-4 text-right font-mono">
                  ${tk.price.toFixed(2)}
                  <div
                    className={`text-[10px] ${
                      tk.change24h >= 0 ? "text-secondary" : "text-error"
                    }`}
                  >
                    {formatPercent(tk.change24h)}
                  </div>
                </td>
                <td className="p-4 text-right font-mono">
                  {tk.supply.toLocaleString()}
                </td>
                <td className="p-4 text-right font-mono">
                  {tk.maxSupply.toLocaleString()}
                </td>
                <td className="p-4 text-right font-mono">
                  {formatNumber(tk.marketCap)}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 ${
                      tk.isPaused
                        ? "bg-error-dim text-error"
                        : "bg-success-dim text-success"
                    }`}
                  >
                    {tk.isPaused ? "PAUSED" : "ACTIVE"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setSelectedToken(tk.id);
                        setModal("mint");
                      }}
                      className="btn-ghost px-2 py-1 text-[10px] text-secondary"
                    >
                      {t("admin.mint", lang)}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedToken(tk.id);
                        setModal("burn");
                      }}
                      className="btn-ghost px-2 py-1 text-[10px] text-error"
                    >
                      {t("admin.burn", lang)}
                    </button>
                    <button
                      onClick={() => handlePause(tk.id)}
                      className={`btn-ghost px-2 py-1 text-[10px] ${
                        tk.isPaused ? "text-accent" : "text-on-surface-dim"
                      }`}
                    >
                      {tk.isPaused
                        ? t("admin.unpause", lang)
                        : t("admin.pause", lang)}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
              className="relative bg-surface-low p-8 max-w-md w-full z-10"
            >
              {/* Mint Modal */}
              {modal === "mint" && (
                <>
                  <h3 className="text-serif text-lg font-bold mb-1">
                    {t("admin.mint", lang)} Tokens
                  </h3>
                  <p className="text-xs text-on-surface-dim mb-6">
                    Mint new tokens to the contract supply.
                  </p>
                  <div className="mb-4">
                    <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                      Token
                    </label>
                    <div className="text-sm font-mono text-primary">
                      {tokens.find((tk) => tk.id === selectedToken)?.symbol}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                      Amount to Mint
                    </label>
                    <input
                      type="number"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      placeholder="0"
                      className="input-scholar text-lg font-mono"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="btn-ghost flex-1 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMint}
                      className="btn-gold flex-1 py-2 text-xs"
                    >
                      MINT
                    </button>
                  </div>
                </>
              )}

              {/* Burn Modal */}
              {modal === "burn" && (
                <>
                  <h3 className="text-serif text-lg font-bold mb-1">
                    {t("admin.burn", lang)} Tokens
                  </h3>
                  <p className="text-xs text-on-surface-dim mb-6">
                    Permanently destroy tokens. This is irreversible.
                  </p>
                  <div className="mb-4">
                    <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                      Token
                    </label>
                    <div className="text-sm font-mono text-error">
                      {tokens.find((tk) => tk.id === selectedToken)?.symbol}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                      Amount to Burn
                    </label>
                    <input
                      type="number"
                      value={burnAmount}
                      onChange={(e) => setBurnAmount(e.target.value)}
                      placeholder="0"
                      className="input-scholar text-lg font-mono"
                    />
                  </div>
                  <div className="p-3 bg-error-dim text-error text-[10px] font-mono mb-6">
                    WARNING: Burned tokens cannot be recovered.
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="btn-ghost flex-1 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button onClick={handleBurn} className="flex-1 py-2 text-xs font-mono font-bold uppercase bg-error text-surface cursor-pointer">
                      BURN
                    </button>
                  </div>
                </>
              )}

              {/* Create Modal */}
              {modal === "create" && (
                <>
                  <h3 className="text-serif text-lg font-bold mb-1">
                    Create New Token
                  </h3>
                  <p className="text-xs text-on-surface-dim mb-6">
                    Deploy a new token on the exchange.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Symbol
                        </label>
                        <input
                          value={newToken.symbol}
                          onChange={(e) =>
                            setNewToken({ ...newToken, symbol: e.target.value })
                          }
                          placeholder="TEA"
                          className="input-scholar text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={newToken.category}
                          onChange={(e) =>
                            setNewToken({
                              ...newToken,
                              category: e.target.value as Token["category"],
                            })
                          }
                          className="input-scholar text-sm bg-transparent"
                        >
                          <option value="rwa">RWA</option>
                          <option value="utility">Utility</option>
                          <option value="governance">Governance</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                        Name (EN)
                      </label>
                      <input
                        value={newToken.name}
                        onChange={(e) =>
                          setNewToken({ ...newToken, name: e.target.value })
                        }
                        placeholder="Vintage Tea 2005"
                        className="input-scholar text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                        Name (KO)
                      </label>
                      <input
                        value={newToken.nameKo}
                        onChange={(e) =>
                          setNewToken({ ...newToken, nameKo: e.target.value })
                        }
                        placeholder="빈티지 차 2005"
                        className="input-scholar text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Initial Price ($)
                        </label>
                        <input
                          type="number"
                          value={newToken.price}
                          onChange={(e) =>
                            setNewToken({ ...newToken, price: e.target.value })
                          }
                          placeholder="0.00"
                          className="input-scholar text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                          Max Supply
                        </label>
                        <input
                          type="number"
                          value={newToken.maxSupply}
                          onChange={(e) =>
                            setNewToken({
                              ...newToken,
                              maxSupply: e.target.value,
                            })
                          }
                          placeholder="1000000"
                          className="input-scholar text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                        Contract Address
                      </label>
                      <input
                        value={newToken.contractAddress}
                        onChange={(e) =>
                          setNewToken({
                            ...newToken,
                            contractAddress: e.target.value,
                          })
                        }
                        placeholder="0x... (auto-generated if empty)"
                        className="input-scholar text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="btn-ghost flex-1 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      className="btn-gold flex-1 py-2 text-xs"
                    >
                      CREATE TOKEN
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

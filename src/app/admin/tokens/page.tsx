"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { parseUnits, type Address } from "viem";
import { useStore, type Token } from "@/stores/useStore";
import { useTokenMint } from "@/hooks/useTokenContract";
import { useMinterRole } from "@/hooks/useMinterRole";
import { ADDRESSES, KKD_TOKEN_ABI } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";
import { useT } from "@/lib/i18n/useT";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const genId = () => Math.random().toString(36).slice(2, 10);

/** Map a store token id to its on-chain BSC contract address (if deployed). */
function onChainAddressFor(tokenId: string): Address | undefined {
  if (tokenId === "kkd") return ADDRESSES.KKD_TOKEN as Address;
  if (tokenId === "puer") return ADDRESSES.RWA_PUER_TOKEN as Address;
  return undefined;
}

export default function AdminTokensPage() {
  const t = useT();
  const tokens = useStore((s) => s.tokens);
  const addToken = useStore((s) => s.addToken);
  const updateToken = useStore((s) => s.updateToken);
  const mintTokenSupply = useStore((s) => s.mintTokenSupply);
  const deleteToken = useStore((s) => s.deleteToken);
  const addToast = useStore((s) => s.addToast);

  const { address, isConnected } = useAccount();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newMaxSupply, setNewMaxSupply] = useState("");
  const [newSupply, setNewSupply] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState<"rwa" | "utility" | "governance">("utility");

  // Mint supply state
  const [mintAmount, setMintAmount] = useState("");
  const [pendingMint, setPendingMint] = useState<{ id: string; amount: number } | null>(null);

  const selectedToken = tokens.find((t) => t.id === selectedId) ?? null;
  const onChainAddress = selectedToken ? onChainAddressFor(selectedToken.id) : undefined;

  const { hasRole: hasMinterRole, isLoading: roleLoading } = useMinterRole(
    onChainAddress,
    address,
    KKD_TOKEN_ABI,
  );

  const {
    mint,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset,
  } = useTokenMint(onChainAddress);

  // After tx confirms, sync the local store's supply. setState here is
  // intentional — we're bridging an external system (wagmi tx state) into
  // local state and the `pendingMint` guard ensures it runs once per tx.
  useEffect(() => {
    if (isSuccess && pendingMint) {
      mintTokenSupply(pendingMint.id, pendingMint.amount);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingMint(null);
      setMintAmount("");
      reset();
    }
  }, [isSuccess, pendingMint, mintTokenSupply, reset]);

  function handleMintSupply() {
    if (!selectedToken) return;
    const amount = Number(mintAmount);
    if (!amount || amount <= 0) return;

    // If this token has a deployed contract counterpart, mint on-chain.
    if (onChainAddress) {
      if (!isConnected || !address) {
        addToast({
          type: "error",
          title: "Wallet Not Connected",
          message: "Connect your wallet to mint on BSC.",
        });
        return;
      }
      setPendingMint({ id: selectedToken.id, amount });
      // ERC-20 mint takes raw units (assume 18 decimals like KKD).
      mint(address, parseUnits(String(amount), 18));
    } else {
      // Locally-created token (no contract) — store-only update.
      mintTokenSupply(selectedToken.id, amount);
      setMintAmount("");
    }
  }

  function handleCreate() {
    if (!newName || !newSymbol || !newMaxSupply) return;

    const token: Token = {
      id: genId(),
      symbol: newSymbol.toUpperCase(),
      name: newName,
      price: Number(newPrice) || 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
      supply: Number(newSupply) || 0,
      maxSupply: Number(newMaxSupply),
      category: newCategory,
      isPaused: false,
      contractAddress: `0x${genId()}...${genId()}`,
    };

    addToken(token);
    setNewName("");
    setNewSymbol("");
    setNewMaxSupply("");
    setNewSupply("");
    setNewPrice("");
    setNewCategory("utility");
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
          {t("adminTok.title")}
        </h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-gradient"
        >
          {showCreate ? t("adminTok.cancel") : t("adminTok.createNew")}
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
              {t("adminTok.newToken")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {t("adminTok.name")}
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
                  {t("adminTok.symbol")}
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
                  {t("adminTok.maxSupply")}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {t("adminTok.initialSupply")}
                </label>
                <input
                  value={newSupply}
                  onChange={(e) => setNewSupply(e.target.value)}
                  placeholder="e.g. 500000"
                  type="number"
                  className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {t("adminTok.price")}
                </label>
                <input
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 1.50"
                  type="number"
                  className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {t("adminTok.category")}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as "rwa" | "utility" | "governance")}
                  className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface outline-none focus:border-primary transition-colors"
                >
                  <option value="rwa">{t("adminTok.catRwa")}</option>
                  <option value="utility">{t("adminTok.catUtility")}</option>
                  <option value="governance">{t("adminTok.catGov")}</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName || !newSymbol || !newMaxSupply}
              className="btn-gradient disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t("adminTok.createBtn")}
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
                      {token.isPaused ? t("adminTok.paused") : t("adminTok.active")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-3 font-body text-xs text-on-surface-variant">
                <span>
                  {t("adminTok.supply")}: {token.supply.toLocaleString()} /{" "}
                  {token.maxSupply.toLocaleString()}
                </span>
                <span>
                  {t("adminTok.vol24h")}: ${token.volume24h.toLocaleString()}
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
                  {t("adminTok.detail")}
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
                      { label: t("adminTok.col.price"), value: `$${selectedToken.price.toLocaleString()}` },
                      { label: t("adminTok.col.change"), value: `${selectedToken.change24h > 0 ? "+" : ""}${selectedToken.change24h}%` },
                      { label: t("adminTok.col.cap"), value: `$${selectedToken.marketCap.toLocaleString()}` },
                      { label: t("adminTok.col.cat"), value: selectedToken.category },
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
                      {t("adminTok.supply")}
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

                  {/* Mint Supply */}
                  <div className="space-y-2">
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                      {t("adminTok.mintAdditional")}
                      {onChainAddress && (
                        <span className="ml-2 text-secondary normal-case tracking-normal">
                          · {t("adminTok.onChain")}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        placeholder={t("adminTok.mintAmount")}
                        type="number"
                        disabled={isPending || isConfirming}
                        className="flex-1 bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary transition-colors disabled:opacity-50"
                      />
                      <button
                        onClick={handleMintSupply}
                        disabled={
                          !mintAmount ||
                          Number(mintAmount) <= 0 ||
                          isPending ||
                          isConfirming
                        }
                        className="px-4 py-2 bg-secondary/10 text-secondary border-[0.5px] border-secondary/40 font-label text-[10px] uppercase tracking-[0.15em] hover:bg-secondary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isPending
                          ? t("adminTok.signBtn")
                          : isConfirming
                            ? t("adminTok.confirmBtn")
                            : t("adminTok.mintBtn")}
                      </button>
                    </div>
                    <p className="font-body text-[10px] text-on-surface-variant">
                      {t("adminTok.remaining")}: {(selectedToken.maxSupply - selectedToken.supply).toLocaleString()} {t("adminTok.tokensAvailable")}
                    </p>
                    {onChainAddress && isConnected && !roleLoading && !hasMinterRole && (
                      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-error">
                        {t("adminTok.minterWarn")}
                      </p>
                    )}
                    <TxStatus
                      hash={hash}
                      isPending={isPending}
                      isConfirming={isConfirming}
                      isSuccess={isSuccess && !!pendingMint}
                      isError={isError}
                      error={error}
                    />
                  </div>

                  {/* Contract */}
                  <div className="space-y-1">
                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                      {t("adminTok.contract")}
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
                    {selectedToken.isPaused ? t("adminTok.resume") : t("adminTok.pause")}
                  </button>
                  <button
                    onClick={() => {
                      deleteToken(selectedToken.id);
                      setSelectedId(null);
                    }}
                    className="flex-1 py-2.5 font-label text-[10px] uppercase tracking-[0.15em] border-[0.5px] bg-error/10 text-error border-error/40 hover:bg-error/20 transition-colors"
                  >
                    {t("adminTok.delete")}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 flex items-center justify-center h-48"
                {...fade}
              >
                <p className="font-body text-xs text-outline">
                  {t("adminTok.selectMsg")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

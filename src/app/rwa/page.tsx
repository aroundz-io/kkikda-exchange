"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Lock,
  CheckCircle2,
  Wallet,
  Flame,
  ShieldCheck,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { useStore, type RedemptionStatus } from "@/stores/useStore";
import { useT } from "@/lib/i18n/useT";
import { useNFTBalance, useNFTBurn } from "@/hooks/useNFTContract";
import { ADDRESSES } from "@/lib/web3/contracts";
import { TxStatus } from "@/components/ui/TxStatus";
import { PICKUP_POINTS, findPickupPoint } from "@/lib/pickupPoints";
import type { Address } from "viem";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/* ───────────── Pickup Points list ───────────── */
function PickupPointsCard() {
  const t = useT();
  return (
    <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-5">
      <div>
        <h3 className="font-headline text-lg text-on-surface flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          {t("rwa.tradePoints")}
        </h3>
        <p className="font-body text-xs text-on-surface-variant mt-1">
          {t("rwa.tradePointsDesc")}
        </p>
      </div>
      <div className="space-y-4">
        {PICKUP_POINTS.map((p) => (
          <div
            key={p.id}
            className="border-l-2 border-primary/40 pl-4 space-y-1.5"
          >
            <div>
              <h4 className="font-headline text-base text-on-surface">
                {p.name}
              </h4>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-primary">
                {p.region}
              </p>
            </div>
            <p className="font-body text-xs text-on-surface-variant">
              {p.address}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-label uppercase tracking-tighter text-outline">
              <span>
                {t("rwa.hoursWeekday")}: <span className="text-on-surface normal-case tracking-normal">{p.hoursWeekday}</span>
              </span>
              <span>
                {t("rwa.hoursWeekend")}: <span className="text-on-surface normal-case tracking-normal">{p.hoursWeekend}</span>
              </span>
            </div>
            <p className="font-label text-[10px] uppercase tracking-tighter text-outline">
              {t("rwa.contact")}: <span className="text-on-surface normal-case tracking-normal">{p.contact}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="font-body text-[10px] text-outline border-t border-outline-variant/15 pt-3">
        ⚠ {t("rwa.appointmentRequired")}
      </p>
    </div>
  );
}

/* ───────────── How-it-works steps ───────────── */
function HowItWorks() {
  const t = useT();
  const steps = [
    { n: "01", title: t("rwa.howStep1"), desc: t("rwa.howStep1Desc") },
    { n: "02", title: t("rwa.howStep2"), desc: t("rwa.howStep2Desc") },
    { n: "03", title: t("rwa.howStep3"), desc: t("rwa.howStep3Desc") },
    { n: "04", title: t("rwa.howStep4"), desc: t("rwa.howStep4Desc") },
  ];
  return (
    <div className="space-y-5">
      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
        {t("rwa.howItWorks")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-5 space-y-2"
          >
            <span className="font-headline text-2xl text-outline-variant">
              {s.n}
            </span>
            <h4 className="font-headline text-sm text-on-surface">{s.title}</h4>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Redemption Modal ───────────── */
function RedemptionModal({
  onClose,
  ownerAddress,
}: {
  onClose: () => void;
  ownerAddress: Address;
}) {
  const t = useT();
  const teaCakes = useStore((s) => s.teaCakes);
  const addRedemptionRequest = useStore((s) => s.addRedemptionRequest);
  const addToast = useStore((s) => s.addToast);

  const [tokenIdsInput, setTokenIdsInput] = useState("");
  const [pickupPointId, setPickupPointId] = useState(PICKUP_POINTS[0].id);

  const tokenIds = useMemo(
    () =>
      tokenIdsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s))
        .filter((n) => !isNaN(n) && n > 0),
    [tokenIdsInput],
  );

  // Find which product the first tokenId belongs to (assumes all same product
  // when burning multiple — UI keeps it simple)
  const matchedCake = useMemo(() => {
    if (tokenIds.length === 0) return null;
    const id = tokenIds[0];
    return (
      teaCakes.find(
        (c) => id >= c.tokenId && id < c.tokenId + (c.totalUnits ?? 1),
      ) ?? null
    );
  }, [tokenIds, teaCakes]);

  // We burn the FIRST tokenId on-chain (single tx). For multi-NFT redemption
  // user repeats the flow, OR a future iteration batches via multicall.
  const { burn, hash, isPending, isConfirming, isSuccess, isError, error, reset } =
    useNFTBurn();

  useEffect(() => {
    if (isSuccess && hash && tokenIds.length > 0 && matchedCake) {
      const genId = () => Math.random().toString(36).slice(2, 10);
      addRedemptionRequest({
        id: `rdm-${Date.now()}-${genId()}`,
        cakeId: matchedCake.id,
        cakeName: matchedCake.name,
        tokenIds,
        burnTxHash: hash,
        owner: ownerAddress,
        pickupPointId,
        timestamp: Date.now(),
        status: "submitted",
      });
      reset();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash]);

  function handleConfirm() {
    if (tokenIds.length === 0) {
      addToast({
        type: "error",
        title: "Invalid token IDs",
        message: "Enter at least one valid tokenId.",
      });
      return;
    }
    // Burn first token only (single tx). Track ownership/multi-burn off-chain.
    burn(BigInt(tokenIds[0]));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-surface/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface-container-low border-[0.5px] border-outline-variant max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-outline-variant/15 flex items-center justify-between">
          <h3 className="font-headline text-base text-on-surface flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            {t("rwa.modalTitle")}
          </h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Token IDs */}
          <div className="space-y-1.5">
            <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              {t("rwa.tokenIdInput")}
            </label>
            <input
              value={tokenIdsInput}
              onChange={(e) => setTokenIdsInput(e.target.value)}
              placeholder="e.g. 1, 2, 3"
              className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2.5 font-label text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary"
            />
            <p className="font-body text-[10px] text-on-surface-variant">
              {t("rwa.tokenIdHint")}
            </p>
            {matchedCake && (
              <div className="flex items-center gap-3 mt-2 px-3 py-2 bg-surface-container-high border-[0.5px] border-secondary/30">
                {matchedCake.image && (
                  <div className="w-10 h-10 bg-surface-container shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={matchedCake.image}
                      alt={matchedCake.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-headline text-sm text-on-surface truncate">
                    {matchedCake.name}
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                    {matchedCake.vintage} · {matchedCake.weight} · {matchedCake.grade}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pickup point */}
          <div className="space-y-1.5">
            <label className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
              {t("rwa.pickupPoint")}
            </label>
            <select
              value={pickupPointId}
              onChange={(e) => setPickupPointId(e.target.value)}
              className="w-full bg-surface-container-high border-[0.5px] border-outline-variant px-3 py-2.5 font-body text-sm text-on-surface outline-none focus:border-primary"
            >
              {PICKUP_POINTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.region}
                </option>
              ))}
            </select>
          </div>

          <TxStatus
            hash={hash}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-[0.5px] border-outline-variant text-outline font-label text-[10px] uppercase tracking-[0.15em] hover:text-on-surface"
            >
              {t("rwa.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={tokenIds.length === 0 || isPending || isConfirming}
              className="flex-[2] btn-gradient disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                <Flame size={14} />
                {isPending
                  ? "Awaiting signature…"
                  : isConfirming
                    ? t("rwa.confirmingBurn")
                    : t("rwa.confirmRedemption")}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────── Status Tracker (per request) ───────────── */
function StatusTracker({ status }: { status: RedemptionStatus }) {
  const t = useT();
  const order: RedemptionStatus[] = [
    "submitted",
    "verified",
    "ready_for_pickup",
    "completed",
  ];
  if (status === "cancelled") {
    return (
      <p className="font-label text-[10px] uppercase tracking-[0.15em] text-error">
        ✕ {t("rwa.status.cancelled")}
      </p>
    );
  }
  const idx = order.indexOf(status);
  const labels = [
    t("rwa.statusStep1"),
    t("rwa.statusStep2"),
    t("rwa.statusStep3"),
    t("rwa.statusStep4"),
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {labels.map((label, i) => {
        const reached = i <= idx;
        const current = i === idx;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 flex items-center justify-center border-[0.5px] font-label text-[9px] ${
                  reached
                    ? current
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-secondary/20 text-secondary border-secondary/40"
                    : "bg-surface-container border-outline-variant text-outline"
                }`}
              >
                {reached && !current ? "✓" : i + 1}
              </span>
              <span
                className={`font-label text-[10px] uppercase tracking-[0.15em] ${
                  reached
                    ? current
                      ? "text-primary"
                      : "text-on-surface-variant"
                    : "text-outline"
                }`}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className={`w-6 h-[1px] ${
                  reached && i < idx ? "bg-secondary/50" : "bg-outline-variant/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── Main Page ───────────── */
export default function RwaPage() {
  const t = useT();
  const { address, isConnected } = useAccount();
  const { balance } = useNFTBalance(address as Address | undefined);
  const nftCount = balance ? Number(balance) : 0;

  const allRequests = useStore((s) => s.redemptionRequests);
  const myRequests = useMemo(
    () =>
      address
        ? allRequests.filter(
            (r) => r.owner.toLowerCase() === address.toLowerCase(),
          )
        : [],
    [allRequests, address],
  );

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page-padding space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <span className="font-label text-primary text-xs uppercase tracking-[0.3em]">
          {t("rwa.kicker")}
        </span>
        <h1 className="font-headline text-4xl lg:text-5xl text-white leading-tight">
          {t("rwa.title")}
        </h1>
      </motion.div>

      {/* ────────── Disconnected state ────────── */}
      {!isConnected ? (
        <>
          <motion.section
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-8 lg:p-10 space-y-6"
            {...fade}
          >
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-primary shrink-0" strokeWidth={1.5} />
              <div className="space-y-3 max-w-2xl">
                <h2 className="font-headline text-2xl text-on-surface">
                  {t("rwa.disconnectedTitle")}
                </h2>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {t("rwa.disconnectedBody")}
                </p>
              </div>
            </div>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button onClick={openConnectModal} className="btn-gradient inline-flex items-center gap-2">
                  <Wallet size={14} />
                  {t("rwa.connectButton")}
                </button>
              )}
            </ConnectButton.Custom>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.1 }}>
            <HowItWorks />
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.15 }}>
            <PickupPointsCard />
          </motion.section>
        </>
      ) : (
        /* ────────── Connected state ────────── */
        <>
          {/* My Holdings */}
          <motion.section
            className="bg-surface-container-low border-[0.5px] border-outline-variant p-6 space-y-5"
            {...fade}
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-headline text-xl text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  {t("rwa.myHoldings")}
                </h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  {t("rwa.holdingsDesc")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline">
                  {t("rwa.totalHeld")}
                </p>
                <p className="font-headline text-3xl text-primary">{nftCount}</p>
              </div>
            </div>

            {nftCount === 0 ? (
              <div className="bg-surface-container border-[0.5px] border-outline-variant p-8 text-center">
                <p className="font-body text-sm text-on-surface-variant">
                  {t("rwa.holdings.empty")}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container border-[0.5px] border-outline-variant px-4 py-3">
                <p className="font-body text-sm text-on-surface-variant">
                  Connected wallet:{" "}
                  <span className="font-label text-xs text-on-surface">
                    {address?.slice(0, 6)}…{address?.slice(-4)}
                  </span>
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-gradient inline-flex items-center gap-2"
                >
                  <Flame size={14} />
                  {t("rwa.requestRedeem")}
                </button>
              </div>
            )}

            <p className="font-label text-[10px] uppercase tracking-tighter text-outline">
              KKIKDA_NFT · {ADDRESSES.KKIKDA_NFT}
            </p>
          </motion.section>

          {/* My Redemption Requests */}
          <motion.section className="space-y-4" {...fade} transition={{ delay: 0.1 }}>
            <div>
              <h2 className="font-headline text-xl text-on-surface flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t("rwa.requests")}
              </h2>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                {t("rwa.requestsDesc")}
              </p>
            </div>

            {myRequests.length === 0 ? (
              <div className="bg-surface-container-low border-[0.5px] border-outline-variant p-10 text-center">
                <p className="font-body text-sm text-on-surface-variant">
                  {t("rwa.noRequests")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((r) => {
                  const point = findPickupPoint(r.pickupPointId);
                  return (
                    <div
                      key={r.id}
                      className="bg-surface-container-low border-[0.5px] border-outline-variant p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="font-headline text-base text-on-surface">
                            {r.cakeName}
                          </h4>
                          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mt-1">
                            {new Date(r.timestamp).toLocaleString()} ·{" "}
                            {r.tokenIds.length} unit{r.tokenIds.length > 1 ? "s" : ""} ·{" "}
                            #{r.tokenIds.join(", #")}
                          </p>
                        </div>
                        <a
                          href={`https://testnet.bscscan.com/tx/${r.burnTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-label text-[10px] uppercase tracking-[0.15em] text-outline hover:text-primary"
                        >
                          {t("rwa.viewBurnTx")} ↗
                        </a>
                      </div>

                      <StatusTracker status={r.status} />

                      {point && (
                        <div className="bg-surface-container border-[0.5px] border-outline-variant px-4 py-3 flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-0.5">
                              {t("rwa.pickupAt")}
                            </p>
                            <p className="font-headline text-sm text-on-surface">
                              {point.name}
                            </p>
                            <p className="font-body text-xs text-on-surface-variant">
                              {point.address}
                            </p>
                            <p className="font-label text-[10px] uppercase tracking-tighter text-outline mt-1">
                              {point.contact}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>

          {/* Pickup Points */}
          <motion.section {...fade} transition={{ delay: 0.15 }}>
            <PickupPointsCard />
          </motion.section>
        </>
      )}

      <AnimatePresence>
        {showModal && address && (
          <RedemptionModal
            ownerAddress={address}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* Mark CheckCircle2 used elsewhere if needed (kept for compatibility) */
void CheckCircle2;

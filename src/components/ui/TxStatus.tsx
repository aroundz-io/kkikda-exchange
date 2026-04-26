"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useChainId } from "wagmi";
import { bscScanTxUrl } from "@/lib/web3/metadata";

interface Props {
  hash?: `0x${string}`;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: Error | null;
}

export function TxStatus({
  hash,
  isPending,
  isConfirming,
  isSuccess,
  isError,
  error,
}: Props) {
  const chainId = useChainId();

  const visible = isPending || isConfirming || isSuccess || isError;
  if (!visible) return null;

  let label = "";
  let tone = "text-outline border-outline-variant";
  if (isPending) {
    label = "Awaiting wallet signature…";
    tone = "text-primary border-primary/40 bg-primary/5";
  } else if (isConfirming) {
    label = "Confirming on-chain…";
    tone = "text-secondary border-secondary/40 bg-secondary/5";
  } else if (isSuccess) {
    label = "Transaction confirmed";
    tone = "text-secondary border-secondary/40 bg-secondary/10";
  } else if (isError) {
    label = error?.message?.split("\n")[0] ?? "Transaction failed";
    tone = "text-error border-error/40 bg-error/5";
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className={`border-[0.5px] px-4 py-3 flex items-start justify-between gap-4 ${tone}`}
      >
        <div className="space-y-1 min-w-0 flex-1">
          <p className="font-label text-[10px] uppercase tracking-[0.15em]">
            Transaction Status
          </p>
          <p className="font-body text-sm break-words">{label}</p>
        </div>
        {hash && (
          <a
            href={bscScanTxUrl(chainId, hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-[10px] uppercase tracking-[0.15em] underline shrink-0 self-center"
          >
            View on BSCScan
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

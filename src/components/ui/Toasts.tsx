"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/stores/useStore";

const ICONS: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  success: { bg: "bg-success-dim", border: "border-secondary/30", icon: "text-secondary" },
  error: { bg: "bg-error-dim", border: "border-error/30", icon: "text-error" },
  info: { bg: "bg-primary-dim", border: "border-primary/30", icon: "text-primary" },
};

export default function Toasts() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const c = COLORS[toast.type] || COLORS.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto ${c.bg} border ${c.border} backdrop-blur-xl p-4 flex items-start gap-3 cursor-pointer`}
              onClick={() => removeToast(toast.id)}
            >
              <span className={`${c.icon} font-mono text-sm font-bold mt-0.5 shrink-0`}>
                {ICONS[toast.type]}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-on-surface">{toast.title}</p>
                <p className="text-[11px] text-on-surface-mid mt-0.5">{toast.message}</p>
              </div>
              <button className="text-on-surface-dim hover:text-on-surface ml-auto shrink-0 text-xs">
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

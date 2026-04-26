"use client";

import { useStore } from "@/stores/useStore";
import { translations, type TranslationKey } from "./translations";

/**
 * Returns a `t(key)` function that resolves a translation key to the current
 * language's string. Falls back to English if a key is missing in Korean.
 */
export function useT() {
  const lang = useStore((s) => s.lang);
  return (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en;
  };
}

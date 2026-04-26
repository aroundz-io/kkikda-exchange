"use client";

import { useStore } from "@/stores/useStore";

/**
 * Hook factory that returns a `pickName(cake)` function which resolves the
 * product display name based on the current language. Falls back to the
 * Korean `name` when an English `nameEn` is missing or in KO mode.
 *
 * Usage:
 *   const cakeName = useCakeName();
 *   ...
 *   <h3>{cakeName(cake)}</h3>
 */
export function useCakeName() {
  const lang = useStore((s) => s.lang);
  return (cake: { name: string; nameEn?: string }): string =>
    lang === "en" && cake.nameEn ? cake.nameEn : cake.name;
}

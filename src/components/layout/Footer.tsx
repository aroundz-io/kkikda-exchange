"use client";

import { useT } from "@/lib/i18n/useT";

const FOOTER_LINKS = [
  "footer.provenance",
  "footer.whitepaper",
  "footer.terms",
  "footer.audit",
] as const;

export function Footer() {
  const t = useT();
  return (
    <footer className="app-footer flex flex-col md:flex-row justify-between items-center gap-6 bg-surface border-t border-outline-variant/15">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-primary font-headline text-lg uppercase tracking-tighter">
          KKIKDAGEO
        </span>
        <p className="font-label text-[10px] tracking-tight uppercase text-white/30">
          {t("footer.tagline")}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {FOOTER_LINKS.map((key) => (
          <a
            key={key}
            href="#"
            className="font-label text-[10px] tracking-tight uppercase text-white/30 hover:text-primary transition-colors"
          >
            {t(key)}
          </a>
        ))}
      </div>
    </footer>
  );
}

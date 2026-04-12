"use client";

import { useStore } from "@/stores/useStore";
import { t } from "@/lib/i18n";

const FOOTER_LINKS = [
  { label: "PROVENANCE PROTOCOL", href: "#" },
  { label: "WHITEPAPER", href: "#" },
  { label: "TERMS OF SERVICE", href: "#" },
  { label: "SECURITY AUDIT", href: "#" },
];

export default function Footer() {
  const { lang } = useStore();

  return (
    <footer className="bg-surface-low mt-auto border-t border-outline-ghost">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Brand + copyright */}
        <div>
          <div className="text-serif text-xl font-bold text-primary">
            KKIKDAGEO
          </div>
          <p className="text-[11px] text-on-surface-dim mt-1">
            &copy; 2024 KKIKDAGEO. THE DIGITAL KURA FOR VINTAGE PU&rsquo;ER.
          </p>
        </div>

        {/* Right: Links */}
        <nav className="flex flex-col md:flex-row gap-3 md:gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] font-mono uppercase tracking-wider text-on-surface-dim hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

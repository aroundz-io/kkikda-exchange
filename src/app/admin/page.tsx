"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { t } from "@/lib/i18n";

export default function AdminSitePage() {
  const { lang, siteConfig, updateSiteConfig } = useStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-serif text-2xl font-bold mb-1">
          {t("admin.site", lang)}
        </h1>
        <p className="text-xs text-on-surface-dim mb-8">
          Manage site appearance, announcements, and feature toggles.
        </p>

        {/* General */}
        <section className="bg-surface-low p-6 mb-6">
          <h2 className="text-sm font-mono font-semibold text-primary mb-4">
            General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                Site Name
              </label>
              <input
                value={siteConfig.siteName}
                onChange={(e) => updateSiteConfig({ siteName: e.target.value })}
                className="input-scholar text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                Hero Title
              </label>
              <input
                value={siteConfig.heroTitle}
                onChange={(e) => updateSiteConfig({ heroTitle: e.target.value })}
                className="input-scholar text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                Hero Subtitle
              </label>
              <input
                value={siteConfig.heroSubtitle}
                onChange={(e) =>
                  updateSiteConfig({ heroSubtitle: e.target.value })
                }
                className="input-scholar text-sm"
              />
            </div>
          </div>
        </section>

        {/* Announcement */}
        <section className="bg-surface-low p-6 mb-6">
          <h2 className="text-sm font-mono font-semibold text-primary mb-4">
            Announcement Bar
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-mid">Enable Announcement</span>
              <button
                onClick={() =>
                  updateSiteConfig({
                    announcementEnabled: !siteConfig.announcementEnabled,
                  })
                }
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  siteConfig.announcementEnabled ? "bg-primary" : "bg-surface-high"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-surface absolute top-0.5 transition-transform ${
                    siteConfig.announcementEnabled
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-on-surface-dim tracking-widest uppercase mb-1">
                Announcement Text
              </label>
              <input
                value={siteConfig.announcement}
                onChange={(e) =>
                  updateSiteConfig({ announcement: e.target.value })
                }
                className="input-scholar text-sm"
              />
            </div>
          </div>
        </section>

        {/* Feature Toggles */}
        <section className="bg-surface-low p-6 mb-6">
          <h2 className="text-sm font-mono font-semibold text-primary mb-4">
            Feature Toggles
          </h2>
          <div className="space-y-3">
            {[
              { key: "tradingEnabled", label: "DEX Trading" },
              { key: "stakingEnabled", label: "Staking" },
              { key: "nftEnabled", label: "NFT Marketplace" },
              { key: "maintenanceMode", label: "Maintenance Mode" },
            ].map((feature) => (
              <div
                key={feature.key}
                className="flex items-center justify-between py-2"
              >
                <span className="text-xs text-on-surface-mid">
                  {feature.label}
                </span>
                <button
                  onClick={() =>
                    updateSiteConfig({
                      [feature.key]:
                        !siteConfig[feature.key as keyof typeof siteConfig],
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    feature.key === "maintenanceMode"
                      ? siteConfig.maintenanceMode
                        ? "bg-error"
                        : "bg-surface-high"
                      : siteConfig[feature.key as keyof typeof siteConfig]
                      ? "bg-secondary"
                      : "bg-surface-high"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-surface absolute top-0.5 transition-transform ${
                      siteConfig[feature.key as keyof typeof siteConfig]
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security Overview */}
        <section className="bg-surface-low p-6 mb-6">
          <h2 className="text-sm font-mono font-semibold text-primary mb-4">
            Security Status
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Rate Limiting", status: "Active", color: "text-secondary" },
              { label: "DDoS Protection", status: "Active", color: "text-secondary" },
              { label: "CSP Headers", status: "Strict", color: "text-secondary" },
              { label: "CSRF Protection", status: "Enabled", color: "text-secondary" },
              { label: "Timelock", status: "48h", color: "text-accent" },
              { label: "Multisig", status: "3/5", color: "text-accent" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between p-3 bg-surface-mid text-xs"
              >
                <span className="text-on-surface-dim">{s.label}</span>
                <span className={`font-mono ${s.color}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <button onClick={handleSave} className="btn-gold px-8 py-3 text-sm">
          {saved ? "SAVED ✓" : "SAVE CHANGES"}
        </button>
      </motion.div>
    </div>
  );
}

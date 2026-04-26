"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/useT";

export default function RedeemPage() {
  const t = useT();
  return (
    <div className="page-padding">
      <p className="label mb-2">{t("redeem.kicker")}</p>
      <h1 className="font-headline text-4xl font-bold text-on-surface mb-4">
        {t("redeem.title")}
      </h1>
      <p className="text-on-surface-variant mb-8">
        {t("redeem.body")}{" "}
        <Link href="/rwa" className="text-primary underline">
          {t("redeem.vaultPage")}
        </Link>
        .
      </p>
    </div>
  );
}

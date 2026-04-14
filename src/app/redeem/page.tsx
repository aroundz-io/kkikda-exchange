"use client";

import Link from "next/link";

export default function RedeemPage() {
  return (
    <div className="page-padding">
      <p className="label mb-2">PHYSICAL REDEMPTION</p>
      <h1 className="font-headline text-4xl font-bold text-on-surface mb-4">
        Redeem Your Asset
      </h1>
      <p className="text-on-surface-variant mb-8">
        To redeem a tokenized tea cake for its physical counterpart, visit the{" "}
        <Link href="/rwa" className="text-primary underline">
          Vault page
        </Link>
        .
      </p>
    </div>
  );
}

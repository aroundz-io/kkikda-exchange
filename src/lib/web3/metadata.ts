// ---------------------------------------------------------------------------
// NFT metadata encoding
//
// Encodes tea cake metadata as a `data:application/json;base64,...` URI so
// it can be passed directly to KKIKDA_NFT.safeMint(to, uri) without needing
// IPFS / Arweave. The URI is stored on-chain via tokenURI(tokenId).
// ---------------------------------------------------------------------------

export interface TeaCakeMetadata {
  name: string;
  description: string;
  vintage: number;
  weight: string;
  factory: string;
  grade: string;
  category: string;
  priceBnb: number;
  priceUsd: number;
  tags: string[];
  mintedAt: string;
}

/**
 * Build an OpenSea-compatible NFT metadata JSON and return it as a base64
 * data URI suitable for storing on-chain.
 */
export function buildTeaCakeURI(meta: TeaCakeMetadata): string {
  const json = {
    name: meta.name,
    description: meta.description,
    image: "",
    attributes: [
      { trait_type: "Vintage", value: meta.vintage },
      { trait_type: "Weight", value: meta.weight },
      { trait_type: "Factory", value: meta.factory },
      { trait_type: "Grade", value: meta.grade },
      { trait_type: "Category", value: meta.category },
      { trait_type: "Price (BNB)", value: meta.priceBnb },
      { trait_type: "Price (USD)", value: meta.priceUsd },
      ...meta.tags.map((t) => ({ trait_type: "Tag", value: t })),
    ],
    minted_at: meta.mintedAt,
  };

  const text = JSON.stringify(json);
  // Browser-safe base64 encoding (handles unicode safely)
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(text, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(text)));

  return `data:application/json;base64,${base64}`;
}

/** Build the BSCScan transaction URL for a given chainId and tx hash. */
export function bscScanTxUrl(chainId: number, hash: string): string {
  const base = chainId === 56 ? "https://bscscan.com" : "https://testnet.bscscan.com";
  return `${base}/tx/${hash}`;
}

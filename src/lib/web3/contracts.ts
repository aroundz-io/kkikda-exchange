// ---------------------------------------------------------------------------
// Chain IDs
// ---------------------------------------------------------------------------
export const BSC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN === "mainnet" ? 56 : 97;

// ---------------------------------------------------------------------------
// Contract Addresses
// Replace placeholder addresses after deployment
// ---------------------------------------------------------------------------

export const TESTNET_ADDRESSES = {
  /** KKD utility/governance token */
  KKD_TOKEN: "0xdae7BE3dAe2f8E90b7B68FdF92cb13a0aa5Ee479" as const,
  /** RWA-backed Puer tea token */
  RWA_PUER_TOKEN: "0x374609bfC6492E618fB44985f6548A218e1bF757" as const,
  /** RWA-backed Aged tea token */
  RWA_AGED_TOKEN: "0xB73d530Af0A8A07A94465656e2B4fe6eE8CFEA8c" as const,
  /** RWA-backed Cera (ceramics) token */
  RWA_CERA_TOKEN: "0x211E83e3cfE323791fcd57b44474d3FFD38F114C" as const,
  /** KKIKDA NFT collection */
  KKIKDA_NFT: "0x96f91e0757aa5769aEEc509408c7Ab86A81539bc" as const,
  /** NFT Marketplace */
  MARKETPLACE: "0x1C80967399D0146b7DcEAAE45aEdc89aFa128656" as const,
  /** KKD Staking pool */
  STAKING: "0x1A58c14DEEb7f1B555f9ea08dC486C191719F081" as const,
} as const;

export const MAINNET_ADDRESSES = {
  /** KKD utility/governance token */
  KKD_TOKEN: "0x0000000000000000000000000000000000000001" as const, // TODO: replace after mainnet deployment
  /** RWA-backed Puer tea token */
  RWA_PUER_TOKEN: "0x0000000000000000000000000000000000000002" as const, // TODO: replace after mainnet deployment
  /** RWA-backed Aged tea token */
  RWA_AGED_TOKEN: "0x0000000000000000000000000000000000000003" as const, // TODO: replace after mainnet deployment
  /** RWA-backed Cera (ceramics) token */
  RWA_CERA_TOKEN: "0x0000000000000000000000000000000000000004" as const, // TODO: replace after mainnet deployment
  /** KKIKDA NFT collection */
  KKIKDA_NFT: "0x0000000000000000000000000000000000000005" as const, // TODO: replace after mainnet deployment
  /** NFT Marketplace */
  MARKETPLACE: "0x0000000000000000000000000000000000000006" as const, // TODO: replace after mainnet deployment
  /** KKD Staking pool */
  STAKING: "0x0000000000000000000000000000000000000007" as const, // TODO: replace after mainnet deployment
} as const;

/**
 * Return the address set matching the current NEXT_PUBLIC_CHAIN env var.
 * Defaults to testnet when unset.
 */
export function getAddresses() {
  return process.env.NEXT_PUBLIC_CHAIN === "mainnet"
    ? MAINNET_ADDRESSES
    : TESTNET_ADDRESSES;
}

/** Convenience constant — same as getAddresses() but evaluated eagerly */
export const ADDRESSES = getAddresses();

// ---------------------------------------------------------------------------
// ABIs -- key functions only, typed with `as const` for viem inference
// ---------------------------------------------------------------------------

export const KKD_TOKEN_ABI = [
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [
      { name: "", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [
      { name: "", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      { name: "", type: "uint8", internalType: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MINTER_ROLE",
    inputs: [],
    outputs: [
      { name: "", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "view",
  },
] as const;

export const RWA_TOKEN_ABI = [
  // --- Inherited ERC-20 + AccessControl functions (same as KKD) ---
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [
      { name: "", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [
      { name: "", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      { name: "", type: "uint8", internalType: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MINTER_ROLE",
    inputs: [],
    outputs: [
      { name: "", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "view",
  },
  // --- RWA-specific functions ---
  {
    type: "function",
    name: "redeem",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeemable",
    inputs: [],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "assetURI",
    inputs: [],
    outputs: [
      { name: "", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setAssetURI",
    inputs: [
      { name: "uri", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const KKIKDA_NFT_ABI = [
  {
    type: "function",
    name: "safeMint",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "uri", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setApprovalForAll",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "approved", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isApprovedForAll",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalMinted",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenOfOwnerByIndex",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "index", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const MARKETPLACE_ABI = [
  {
    type: "function",
    name: "listItem",
    inputs: [
      { name: "nftAddress", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buyItem",
    inputs: [
      { name: "nftAddress", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "cancelListing",
    inputs: [
      { name: "nftAddress", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updatePrice",
    inputs: [
      { name: "nftAddress", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "newPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getListing",
    inputs: [
      { name: "nftAddress", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Marketplace.Listing",
        components: [
          { name: "seller", type: "address", internalType: "address" },
          { name: "price", type: "uint256", internalType: "uint256" },
          { name: "active", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFee",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

export const STAKING_ABI = [
  {
    type: "function",
    name: "stake",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstake",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimRewards",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pendingRewards",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "stakedBalance",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalStaked",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "apy",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minStakeAmount",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lockPeriod",
    inputs: [],
    outputs: [
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

// ---------------------------------------------------------------------------
// Chain IDs
// ---------------------------------------------------------------------------
export const BSC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN === "mainnet" ? 56 : 97;

// ---------------------------------------------------------------------------
// PancakeSwap V2 Router (used for DEX swaps against existing liquidity)
// ---------------------------------------------------------------------------
export const PANCAKE_ROUTER =
  process.env.NEXT_PUBLIC_CHAIN === "mainnet"
    ? "0x10ED43C718714eb63d5aA57B78B54704E256024E" // V2 mainnet
    : "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // V2 testnet

export const WBNB =
  process.env.NEXT_PUBLIC_CHAIN === "mainnet"
    ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" // WBNB mainnet
    : "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"; // WBNB testnet

/** Tether USD on BSC. Used as the sole quote currency on this DEX. */
export const USDT =
  process.env.NEXT_PUBLIC_CHAIN === "mainnet"
    ? "0x55d398326f99059fF775485246999027B3197955" // USDT mainnet (18 decimals on BSC)
    : "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // USDT testnet (PancakeSwap)

/**
 * Treasury wallet that receives USDT payments from NFT purchases.
 * Override via NEXT_PUBLIC_TREASURY env var; otherwise defaults to the
 * Marketplace contract address as a placeholder.
 */
export const TREASURY_ADDRESS = (process.env.NEXT_PUBLIC_TREASURY ??
  "0xb1623d80F00e735CF2D360bdba6b3Ad3e0623804") as `0x${string}`;

// ---------------------------------------------------------------------------
// Contract Addresses
// Replace placeholder addresses after deployment
// ---------------------------------------------------------------------------

export const TESTNET_ADDRESSES = {
  /** KKD utility/governance token */
  KKD_TOKEN: "0xEB9F26cF82846adB0547669AEab89e5511fd9098" as const,
  /** RWA-backed Puer tea token */
  RWA_PUER_TOKEN: "0xcb667c2D689F2e08AD9110fC9f0F57BDf7547c66" as const,
  /** RWA-backed Aged tea token */
  RWA_AGED_TOKEN: "0x0F88F739d74153DaC6dEdd676BC3891867784C57" as const,
  /** RWA-backed Cera (ceramics) token */
  RWA_CERA_TOKEN: "0x9a6dBf85400CBD01d030D3313ccF24892fBea587" as const,
  /** KKIKDA NFT collection */
  KKIKDA_NFT: "0x5043C557E7c2DC0F62f86EACa60845938552eb7C" as const,
  /** NFT Marketplace */
  MARKETPLACE: "0xb1623d80F00e735CF2D360bdba6b3Ad3e0623804" as const,
  /** KKD Staking pool */
  STAKING: "0xEE979430b15B76F072128C00080aC5746Fe91234" as const,
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

// ---------------------------------------------------------------------------
// PancakeSwap V2 Router ABI (subset — swap + quote only)
// ---------------------------------------------------------------------------
export const PANCAKE_ROUTER_ABI = [
  {
    type: "function",
    name: "getAmountsOut",
    inputs: [
      { name: "amountIn", type: "uint256", internalType: "uint256" },
      { name: "path", type: "address[]", internalType: "address[]" },
    ],
    outputs: [
      { name: "amounts", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "swapExactETHForTokens",
    inputs: [
      { name: "amountOutMin", type: "uint256", internalType: "uint256" },
      { name: "path", type: "address[]", internalType: "address[]" },
      { name: "to", type: "address", internalType: "address" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amounts", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "swapExactTokensForETH",
    inputs: [
      { name: "amountIn", type: "uint256", internalType: "uint256" },
      { name: "amountOutMin", type: "uint256", internalType: "uint256" },
      { name: "path", type: "address[]", internalType: "address[]" },
      { name: "to", type: "address", internalType: "address" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amounts", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "swapExactTokensForTokens",
    inputs: [
      { name: "amountIn", type: "uint256", internalType: "uint256" },
      { name: "amountOutMin", type: "uint256", internalType: "uint256" },
      { name: "path", type: "address[]", internalType: "address[]" },
      { name: "to", type: "address", internalType: "address" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amounts", type: "uint256[]", internalType: "uint256[]" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addLiquidity",
    inputs: [
      { name: "tokenA", type: "address", internalType: "address" },
      { name: "tokenB", type: "address", internalType: "address" },
      { name: "amountADesired", type: "uint256", internalType: "uint256" },
      { name: "amountBDesired", type: "uint256", internalType: "uint256" },
      { name: "amountAMin", type: "uint256", internalType: "uint256" },
      { name: "amountBMin", type: "uint256", internalType: "uint256" },
      { name: "to", type: "address", internalType: "address" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amountA", type: "uint256", internalType: "uint256" },
      { name: "amountB", type: "uint256", internalType: "uint256" },
      { name: "liquidity", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "factory",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
] as const;

// PancakeSwap V2 Pair ABI subset — for reading reserves of an LP pool
export const PANCAKE_PAIR_ABI = [
  {
    type: "function",
    name: "getReserves",
    inputs: [],
    outputs: [
      { name: "reserve0", type: "uint112", internalType: "uint112" },
      { name: "reserve1", type: "uint112", internalType: "uint112" },
      { name: "blockTimestampLast", type: "uint32", internalType: "uint32" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token0",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token1",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
] as const;

// PancakeSwap V2 Factory ABI subset — get pair address for two tokens
export const PANCAKE_FACTORY_ABI = [
  {
    type: "function",
    name: "getPair",
    inputs: [
      { name: "tokenA", type: "address", internalType: "address" },
      { name: "tokenB", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "pair", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
] as const;

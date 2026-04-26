import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "ko" | "en";

/* ───── Domain Types ───── */

export interface TeaCake {
  id: string;
  name: string;
  /** Optional English display name. Falls back to `name` when missing or KO mode. */
  nameEn?: string;
  subtitle: string;
  vintage: number;
  weight: string;
  factory: string;
  grade: string;
  image: string;
  /** Per-unit price in USDT (the sole quote currency on this DEX). */
  price: number;
  priceUsd: number;
  appraisal: number;
  tags: string[];
  category: "raw" | "ripe" | "aged" | "white";
  /** Starting tokenId of this product's NFT range on KKIKDA_NFT. */
  tokenId: number;
  contractAddress: string;
  owner: string;
  isListed: boolean;
  /** Total physical units in the vault (= max NFTs that can be minted 1:1). */
  totalUnits: number;
  /** NFTs minted so far for this product. */
  mintedUnits: number;
  provenance: { date: string; event: string; detail: string }[];
  /** Mint transaction hash if this cake was minted on-chain. Empty for demo seeds. */
  txHash?: string;
  /** Units already sold (NFTs transferred to buyers). */
  soldUnits?: number;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  supply: number;
  maxSupply: number;
  category: "rwa" | "utility" | "governance";
  isPaused: boolean;
  contractAddress: string;
}

export interface StakingPool {
  id: string;
  name: string;
  pair: string;
  apy: number;
  totalStaked: number;
  totalStakedUsd: number;
  minStake: number;
  lockDays: number;
  rewardToken: string;
}

export interface UserState {
  address: string | null;
  balance: number;
  balanceUsd: number;
  kycTier: 0 | 1 | 2 | 3;
  isAdmin: boolean;
  pnl: number;
  pnlPercent: number;
  stakedValue: number;
  securityScore: number;
}

export interface Order {
  id: string;
  type: "buy" | "sell";
  tokenSymbol: string;
  amount: number;
  price: number;
  total: number;
  status: "open" | "filled" | "cancelled";
  txHash: string;
  timestamp: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export interface MintRecord {
  id: string;
  assetName: string;
  tokenId: number;
  txHash: string;
  status: "confirmed" | "processing" | "failed";
  timestamp: number;
  value: number;
}

export interface PurchaseOrder {
  id: string;
  cakeId: string;
  cakeName: string;
  quantity: number;
  pricePerUnit: number;
  totalUsdt: number;
  buyer: string;          // wallet address
  txHash: string;         // USDT transfer tx
  timestamp: number;
  status: "paid" | "delivered" | "refunded";
  /** Comma-separated tokenIds delivered (set by admin when fulfilling). */
  deliveredTokenIds?: string;
}

/**
 * Redemption flow — admin executes every on-chain step. User only submits
 * the request and selects the pickup point.
 *
 *   submitted        → user clicked "Request Redemption"
 *   frozen           → admin froze the NFTs (transfer suspended) · 1차 거래정지
 *   ready_for_pickup → admin verified inventory and staged item at trade point
 *   picked_up        → user collected the physical item in person
 *   burned           → admin burned the NFT on-chain after pickup
 *   cancelled        → request voided
 */
export type RedemptionStatus =
  | "submitted"
  | "frozen"
  | "ready_for_pickup"
  | "picked_up"
  | "burned"
  | "cancelled";

export interface RedemptionRequest {
  id: string;
  cakeId: string;
  cakeName: string;
  tokenIds: number[];
  owner: string;
  pickupPointId: string;
  timestamp: number;
  status: RedemptionStatus;
  // Admin-set fields (set as status advances):
  freezeTxHash?: string;
  readyAt?: number;
  pickedUpAt?: number;
  burnTxHash?: string;
}

/* ───── Store Interface ───── */

interface AppStore {
  lang: Lang;
  setLang: (l: Lang) => void;

  user: UserState;
  setUser: (u: Partial<UserState>) => void;
  clearUser: () => void;

  teaCakes: TeaCake[];
  setTeaCakes: (t: TeaCake[]) => void;
  addTeaCake: (t: TeaCake) => void;
  removeTeaCake: (id: string) => void;

  tokens: Token[];
  setTokens: (t: Token[]) => void;
  addToken: (t: Token) => void;
  updateToken: (id: string, data: Partial<Token>) => void;
  mintTokenSupply: (id: string, amount: number) => void;
  deleteToken: (id: string) => void;

  stakingPools: StakingPool[];
  setStakingPools: (p: StakingPool[]) => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  cancelOrder: (id: string) => void;

  mintRecords: MintRecord[];
  addMintRecord: (m: MintRecord) => void;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (p: PurchaseOrder) => void;
  fulfillPurchaseOrder: (id: string, deliveredTokenIds: string) => void;

  redemptionRequests: RedemptionRequest[];
  addRedemptionRequest: (r: RedemptionRequest) => void;
  updateRedemptionStatus: (id: string, status: RedemptionStatus) => void;

  toasts: Toast[];
  addToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

/* ───── KKIKDA RWA Inventory (KDG 토큰 RWA 수탁 LIST · 2026.04.08) ─────
 * 12 product types · 33,159 total physical units · $66,685,000 USDT vault value.
 * Each unit is tokenized 1:1 as an ERC-721 NFT on KKIKDA_NFT (BSC).
 * tokenId is the START of each product's NFT range; contiguous 1..33,159.
 */
const NFT_CONTRACT = "0x5043C557E7c2DC0F62f86EACa60845938552eb7C"; // ADDRESSES.KKIKDA_NFT
const VAULT_OWNER = "0xKKIKDAGEO_VAULT";

const DEMO_TEA_CAKES: TeaCake[] = [
  {
    id: "puer-001",
    name: "8892 후기홍인",
    nameEn: "8892 Late-period Hong Yin",
    subtitle: "Late-period Hong Yin (Red Mark) · Zhongcha 1988 recipe",
    vintage: 1988,
    weight: "357g",
    factory: "Zhongcha 中茶",
    grade: "AAA",
    image: "/puer/puer-001.jpg",
    price: 30000,
    priceUsd: 30000,
    appraisal: 30000,
    tags: ["Audited", "Rare", "Museum Grade"],
    category: "raw",
    tokenId: 1,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 150,
    mintedUnits: 150,
    provenance: [
      { date: "1988", event: "Produced", detail: "Zhongcha Yunnan factory · 8892 recipe" },
      { date: "2024", event: "Vault Acquired", detail: "Authenticated and stored in HK Kura" },
      { date: "2026-04-08", event: "Tokenized", detail: "150 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-002",
    name: "녹설헌 (홍표)",
    nameEn: "Noksolheon (Red Label)",
    subtitle: "Noksolheon · Imu Mountain wild-grape ancient-tree raw Pu'er",
    vintage: 2002,
    weight: "370g",
    factory: "Lincang 临沧",
    grade: "AA+",
    image: "/puer/puer-002.jpg",
    price: 1200,
    priceUsd: 1200,
    appraisal: 1200,
    tags: ["Audited", "Certified"],
    category: "raw",
    tokenId: 151,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 2500,
    mintedUnits: 2500,
    provenance: [
      { date: "2002", event: "Produced", detail: "Lincang · Imu Mountain ancient-tree raw" },
      { date: "2024", event: "Vault Acquired", detail: "Authenticated and stored in HK Kura" },
      { date: "2026-04-08", event: "Tokenized", detail: "2,500 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-003",
    name: "7808 중타",
    nameEn: "7808 Medium Tuo",
    subtitle: "Xiaguan 7808 · 70/30 raw-ripe blend, exported via Yunnan Province",
    vintage: 1978,
    weight: "250g",
    factory: "Xiaguan 下关",
    grade: "AA+",
    image: "/puer/puer-003.jpg",
    price: 6000,
    priceUsd: 6000,
    appraisal: 6000,
    tags: ["Audited", "Rare"],
    category: "raw",
    tokenId: 2651,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 1200,
    mintedUnits: 1200,
    provenance: [
      { date: "1978", event: "Produced", detail: "Xiaguan factory · 7808 recipe" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "1,200 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-004",
    name: "소법 하관 중타",
    nameEn: "Xiaofa Xiaguan Medium Tuo",
    subtitle: "Xiaofa (銷法) · Xiaguan 1984 export-to-France medium Tuo",
    vintage: 1984,
    weight: "250g",
    factory: "Xiaguan 下关",
    grade: "AA+",
    image: "/puer/puer-004.jpg",
    price: 6000,
    priceUsd: 6000,
    appraisal: 6000,
    tags: ["Certified", "Rare"],
    category: "raw",
    tokenId: 3851,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 500,
    mintedUnits: 500,
    provenance: [
      { date: "1984", event: "Produced", detail: "Xiaguan factory · 銷法 (export-to-France) series" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "500 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-005",
    name: "7592 삼분숙병",
    nameEn: "7592 Three-part Ripening Bing",
    subtitle: "Menghai 7592 · 70/30 raw-ripe \"three-part ripening\" Bing",
    vintage: 1993,
    weight: "300g",
    factory: "Menghai 勐海",
    grade: "AA+",
    image: "/puer/puer-005.jpg",
    price: 3800,
    priceUsd: 3800,
    appraisal: 3800,
    tags: ["Audited", "Certified"],
    category: "ripe",
    tokenId: 4351,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 200,
    mintedUnits: 200,
    provenance: [
      { date: "1993", event: "Produced", detail: "Menghai factory · 7592 \"3-fen ripe\" recipe" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "200 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-006",
    name: "운남 봉황 소타",
    nameEn: "Yunnan Phoenix Small Tuo",
    subtitle: "Phoenix (鳳凰) Small Tuo · Dali 1990 70/30 raw-ripe blend",
    vintage: 1990,
    weight: "100g",
    factory: "Dali 大理",
    grade: "A",
    image: "/puer/puer-006.jpg",
    price: 1300,
    priceUsd: 1300,
    appraisal: 1300,
    tags: ["Certified"],
    category: "raw",
    tokenId: 4551,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 15000,
    mintedUnits: 15000,
    provenance: [
      { date: "1990", event: "Produced", detail: "Dali Tea Factory · Phoenix 鳳凰 series" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "15,000 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-007",
    name: "하관 청소타",
    nameEn: "Xiaguan Raw Small Tuo",
    subtitle: "Xiaguan Raw Small Tuo (青小沱) · grade 1-2 tender leaves, tight-pressed",
    vintage: 1989,
    weight: "100g",
    factory: "Xiaguan 下关",
    grade: "A",
    image: "/puer/puer-007.jpg",
    price: 1900,
    priceUsd: 1900,
    appraisal: 1900,
    tags: ["Audited", "Certified"],
    category: "raw",
    tokenId: 19551,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 10000,
    mintedUnits: 10000,
    provenance: [
      { date: "1989", event: "Produced", detail: "Xiaguan factory · 青小沱 raw small Tuo" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "10,000 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-008",
    name: "보이차전 (1970)",
    nameEn: "Pu'er Tea Brick (1970)",
    subtitle: "Pu'er Cha Zhuan (茶磚) · 1970s Xiaguan brick-form, 50/50 raw-ripe",
    vintage: 1970,
    weight: "250g",
    factory: "Xiaguan 下关",
    grade: "AA+",
    image: "/puer/puer-008.jpg",
    price: 4500,
    priceUsd: 4500,
    appraisal: 4500,
    tags: ["Audited", "Rare", "Museum Grade"],
    category: "aged",
    tokenId: 29551,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 800,
    mintedUnits: 800,
    provenance: [
      { date: "1970", event: "Produced", detail: "Xiaguan factory · brick-form (茶磚)" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage · 50+ year aged" },
      { date: "2026-04-08", event: "Tokenized", detail: "800 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-009",
    name: "완전건창 맹해 청소타",
    nameEn: "Fully Dry-Stored Menghai Raw",
    subtitle: "Menghai 8582 青餅 · fully dry-stored Xishuangbanna raw cake",
    vintage: 1985,
    weight: "320g",
    factory: "Menghai 勐海",
    grade: "AA+",
    image: "/puer/puer-009.jpg",
    price: 2000,
    priceUsd: 2000,
    appraisal: 2000,
    tags: ["Certified"],
    category: "raw",
    tokenId: 30351,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 1000,
    mintedUnits: 1000,
    provenance: [
      { date: "1985", event: "Produced", detail: "Menghai factory · 8582 青餅 raw cake" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura · fully dry-storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "1,000 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-010",
    name: "맹해 소타",
    nameEn: "Menghai Small Tuo",
    subtitle: "Menghai 三分小沱 · 70/30 raw-ripe small Tuo, grade 1-2 leaves",
    vintage: 1980,
    weight: "100g",
    factory: "Menghai 勐海",
    grade: "A",
    image: "/puer/puer-010.jpg",
    price: 2100,
    priceUsd: 2100,
    appraisal: 2100,
    tags: ["Certified"],
    category: "raw",
    tokenId: 31351,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 1800,
    mintedUnits: 1800,
    provenance: [
      { date: "1980", event: "Produced", detail: "Menghai factory · 三分小沱 small Tuo" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "1,800 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-011",
    name: "홍태창",
    nameEn: "Hung Tai Chang",
    subtitle: "Hung Tai Chang (鴻泰昌) · 1950s Thailand-made wild-leaf antique",
    vintage: 1950,
    weight: "300g",
    factory: "Hung Tai Chang 鴻泰昌",
    grade: "AAA",
    image: "/puer/puer-011.jpg",
    price: 37000,
    priceUsd: 37000,
    appraisal: 37000,
    tags: ["Audited", "Antique", "Museum Grade"],
    category: "aged",
    tokenId: 33151,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 5,
    mintedUnits: 5,
    provenance: [
      { date: "1950", event: "Produced", detail: "Hung Tai Chang private label · pre-state" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura · museum-grade antique" },
      { date: "2026-04-08", event: "Tokenized", detail: "5 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-012",
    name: "하내원차",
    nameEn: "Ha Nai Yuan",
    subtitle: "Ha Nai Yuan (河內圓茶) · 1930s Vietnam wild-leaf antique round cake",
    vintage: 1930,
    weight: "290g",
    factory: "Hanoi 河內",
    grade: "AAA",
    image: "/puer/puer-012.jpg",
    price: 40000,
    priceUsd: 40000,
    appraisal: 40000,
    tags: ["Audited", "Antique", "Museum Grade"],
    category: "aged",
    tokenId: 33156,
    contractAddress: NFT_CONTRACT,
    owner: VAULT_OWNER,
    isListed: true,
    totalUnits: 4,
    mintedUnits: 4,
    provenance: [
      { date: "1930", event: "Produced", detail: "Hanoi · Vietnamese wild-leaf round cake" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura · museum-grade antique" },
      { date: "2026-04-08", event: "Tokenized", detail: "4 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
];

/* ───── BSC-issued Tokens ─────
 * KKDA · governance/utility token · 1,000,000,000 (1B) total cap.
 *   Price is set independently of current RWA backing — the 1B cap is the
 *   long-term capacity for future Vintage Pu'er additions. Today's $66.685M
 *   inventory is only the first batch; circulation expands as more RWA is
 *   onboarded over time. Do NOT compute price as RWA-backing / supply.
 *
 * PUER · RWA index token · supply tracks current RWA NFT count (33,159).
 *   Price reflects average USDT per unit of the inventory.
 */
const DEMO_TOKENS: Token[] = [
  {
    id: "kkd",
    symbol: "KKDA",
    name: "KKIKDA Token",
    price: 0.05, // independent launch price — not pegged to current RWA value
    change24h: 5.24,
    volume24h: 2_840_000,
    marketCap: 50_000_000, // 1B × $0.05 fully-diluted; circulating value reflected by trading
    supply: 1_000_000_000,
    maxSupply: 1_000_000_000,
    category: "governance",
    isPaused: false,
    contractAddress: "0xEB9F26cF82846adB0547669AEab89e5511fd9098", // ADDRESSES.KKD_TOKEN
  },
  {
    id: "puer",
    symbol: "PUER",
    name: "Vintage Pu'er Index",
    price: 2010.4, // $66,685,000 / 33,159 ≈ avg per-unit USDT
    change24h: 1.8,
    volume24h: 320_000,
    marketCap: 66_685_000,
    supply: 33_159,
    maxSupply: 33_159,
    category: "rwa",
    isPaused: false,
    contractAddress: "0xcb667c2D689F2e08AD9110fC9f0F57BDf7547c66", // ADDRESSES.RWA_PUER_TOKEN
  },
];

/**
 * Staking pools — TVL recomputed against the real $0.05 KKDA launch price.
 * pool-1 = KKDA single-staking (deployed STAKING contract, ADDRESSES.STAKING)
 *          UI overlays live `useStakingInfo()` reads on top of these defaults.
 * pool-2 / pool-3 = LP staking — contracts not yet deployed; UI marks them
 *          as "coming soon" so users don't expect to be able to stake.
 */
/**
 * Staking APY policy (demo values; pool-1 overlays live `STAKING.apy()` read):
 *   base 12% (single-side, no impermanent-loss risk, 30d lock).
 *   LP pools earn an IL premium and a lock-duration premium on top:
 *     LP 90d  = base × 2.0 = 24%
 *     LP 180d = base × 1.5 = 18%   (longer lock but lower than 90d LP because
 *                                   liquidity provider here is more passive
 *                                   institutional capital — sticky-yield tier)
 *   Funded by a 5-year, 5%-of-supply emission program (~$500K/yr at $0.05/KKDA).
 */
const DEMO_POOLS: StakingPool[] = [
  // 50M KKDA × $0.05 = $2.5M TVL (5% of total supply staked at launch)
  { id: "pool-1", name: "KKDA Single Staking", pair: "KKDA", apy: 12.0, totalStaked: 50_000_000, totalStakedUsd: 2_500_000, minStake: 100, lockDays: 30, rewardToken: "KKDA" },
  // 5M KKDA + 250K USDT in LP = $250K + $250K = $500K TVL
  { id: "pool-2", name: "KKDA-USDT LP", pair: "KKDA-USDT", apy: 24.0, totalStaked: 5_000_000, totalStakedUsd: 500_000, minStake: 50, lockDays: 90, rewardToken: "KKDA" },
  // 1,000 PUER + 2M USDT = $2.01M + $2M ≈ $4.01M (institutional-tier RWA pool)
  { id: "pool-3", name: "PUER-USDT LP", pair: "PUER-USDT", apy: 18.0, totalStaked: 1_000, totalStakedUsd: 4_010_000, minStake: 500, lockDays: 180, rewardToken: "KKDA" },
];

const genId = () => Math.random().toString(36).slice(2, 10);

/* ───── Store ───── */

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      lang: "ko",
      setLang: (lang) => set({ lang }),

      user: {
        address: null,
        balance: 0,
        balanceUsd: 0,
        kycTier: 0,
        isAdmin: false,
        pnl: 12840,
        pnlPercent: 8.4,
        stakedValue: 48200,
        securityScore: 96,
      },
      setUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
      clearUser: () => {
        set({
          user: {
            address: null,
            balance: 0,
            balanceUsd: 0,
            kycTier: 0,
            isAdmin: false,
            pnl: 0,
            pnlPercent: 0,
            stakedValue: 0,
            securityScore: 0,
          },
        });
        get().addToast({ type: "info", title: "Disconnected", message: "Wallet disconnected" });
      },

      teaCakes: DEMO_TEA_CAKES,
      setTeaCakes: (teaCakes) => set({ teaCakes }),
      addTeaCake: (t) => {
        set((s) => ({ teaCakes: [...s.teaCakes, t] }));
        const genId = () => Math.random().toString(36).slice(2, 10);
        get().addMintRecord({
          id: genId(),
          assetName: t.name,
          tokenId: t.tokenId,
          txHash: `0x${genId()}...${genId()}`,
          status: "confirmed",
          timestamp: Date.now(),
          value: t.priceUsd,
        });
        get().addToast({ type: "success", title: "NFT Minted", message: `${t.name} has been minted as NFT #${t.tokenId}` });
      },
      removeTeaCake: (id) => {
        const cake = get().teaCakes.find((t) => t.id === id);
        set((s) => ({ teaCakes: s.teaCakes.filter((t) => t.id !== id) }));
        if (cake) get().addToast({ type: "info", title: "NFT Burned", message: `${cake.name} has been redeemed` });
      },

      tokens: DEMO_TOKENS,
      setTokens: (tokens) => set({ tokens }),
      addToken: (t) => {
        set((s) => ({ tokens: [...s.tokens, t] }));
        get().addToast({ type: "success", title: "Token Created", message: `${t.symbol} created` });
      },
      updateToken: (id, data) =>
        set((s) => ({ tokens: s.tokens.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      mintTokenSupply: (id, amount) => {
        set((s) => ({
          tokens: s.tokens.map((t) =>
            t.id === id ? { ...t, supply: Math.min(t.supply + amount, t.maxSupply) } : t
          ),
        }));
        const token = get().tokens.find((t) => t.id === id);
        if (token) get().addToast({ type: "success", title: "Tokens Minted", message: `${amount.toLocaleString()} ${token.symbol} minted` });
      },
      deleteToken: (id) => {
        const token = get().tokens.find((t) => t.id === id);
        set((s) => ({ tokens: s.tokens.filter((t) => t.id !== id) }));
        if (token) get().addToast({ type: "info", title: "Token Removed", message: `${token.symbol} has been removed` });
      },

      stakingPools: DEMO_POOLS,
      setStakingPools: (stakingPools) => set({ stakingPools }),

      orders: [],
      addOrder: (o) => {
        set((s) => ({ orders: [o, ...s.orders].slice(0, 100) }));
        get().addToast({ type: "success", title: "Order Filled", message: `${o.amount} ${o.tokenSymbol}` });
      },
      cancelOrder: (id) => {
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" as const } : o)) }));
        get().addToast({ type: "info", title: "Order Cancelled", message: "Order cancelled" });
      },

      mintRecords: [],
      addMintRecord: (m) => {
        set((s) => ({ mintRecords: [m, ...s.mintRecords] }));
        get().addToast({ type: "success", title: "Asset Minted", message: m.assetName });
      },

      purchaseOrders: [],
      addPurchaseOrder: (p) => {
        set((s) => ({
          purchaseOrders: [p, ...s.purchaseOrders],
          // Increment soldUnits on the matching cake so availability tracks
          teaCakes: s.teaCakes.map((c) =>
            c.id === p.cakeId
              ? { ...c, soldUnits: (c.soldUnits ?? 0) + p.quantity }
              : c,
          ),
        }));
        get().addToast({
          type: "success",
          title: "Purchase Confirmed",
          message: `${p.quantity} × ${p.cakeName} · ${p.totalUsdt.toLocaleString()} USDT paid`,
        });
      },
      fulfillPurchaseOrder: (id, deliveredTokenIds) => {
        set((s) => ({
          purchaseOrders: s.purchaseOrders.map((p) =>
            p.id === id
              ? { ...p, status: "delivered" as const, deliveredTokenIds }
              : p,
          ),
        }));
        get().addToast({
          type: "info",
          title: "Order Delivered",
          message: `Tokens ${deliveredTokenIds} sent to buyer`,
        });
      },

      redemptionRequests: [],
      addRedemptionRequest: (r) => {
        set((s) => ({
          redemptionRequests: [r, ...s.redemptionRequests],
        }));
        get().addToast({
          type: "success",
          title: "Redemption Submitted",
          message: `${r.tokenIds.length} unit(s) of ${r.cakeName} queued for pickup`,
        });
      },
      updateRedemptionStatus: (id, status) => {
        set((s) => ({
          redemptionRequests: s.redemptionRequests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  readyAt:
                    status === "ready_for_pickup" ? Date.now() : r.readyAt,
                  pickedUpAt:
                    status === "picked_up" ? Date.now() : r.pickedUpAt,
                }
              : r,
          ),
        }));
      },

      toasts: [],
      addToast: (t) => {
        const toast: Toast = { ...t, id: genId() };
        set((s) => ({ toasts: [...s.toasts, toast] }));
        setTimeout(() => set((s) => ({ toasts: s.toasts.filter((tt) => tt.id !== toast.id) })), 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      sidebarOpen: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: "kkikda-store-v11-redeploy",
      partialize: (s) => ({
        lang: s.lang,
        user: s.user,
        orders: s.orders,
        teaCakes: s.teaCakes,
        tokens: s.tokens,
        mintRecords: s.mintRecords,
        stakingPools: s.stakingPools,
        purchaseOrders: s.purchaseOrders,
        redemptionRequests: s.redemptionRequests,
      }),
    }
  )
);

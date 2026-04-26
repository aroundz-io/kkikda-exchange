import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "ko" | "en";

/* ───── Domain Types ───── */

export interface TeaCake {
  id: string;
  name: string;
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
const NFT_CONTRACT = "0x96f91e0757aa5769aEEc509408c7Ab86A81539bc"; // ADDRESSES.KKIKDA_NFT
const VAULT_OWNER = "0xKKIKDAGEO_VAULT";

const DEMO_TEA_CAKES: TeaCake[] = [
  {
    id: "puer-001",
    name: "8892 후기홍인",
    subtitle: "Late-period Hong Yin (Red Mark) · Zhongcha 1988 recipe",
    vintage: 1988,
    weight: "357g",
    factory: "Zhongcha 中茶",
    grade: "AAA",
    image: "",
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
    subtitle: "Noksolheon Red Label · Zhongcha 1990s premium series",
    vintage: 1995,
    weight: "357g",
    factory: "Zhongcha 中茶",
    grade: "AA+",
    image: "",
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
      { date: "1995", event: "Produced", detail: "Zhongcha · Noksolheon Red Label" },
      { date: "2024", event: "Vault Acquired", detail: "Authenticated and stored in HK Kura" },
      { date: "2026-04-08", event: "Tokenized", detail: "2,500 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-003",
    name: "7808 중타",
    subtitle: "Xiaguan 7808 Recipe · Medium Tuo (中沱) raw Pu'er",
    vintage: 1978,
    weight: "250g",
    factory: "Xiaguan 下关",
    grade: "AA+",
    image: "",
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
    subtitle: "Xiaofa Xiaguan · French-method Medium Tuo, fully-fermented dry storage",
    vintage: 1990,
    weight: "250g",
    factory: "Xiaguan 下关",
    grade: "AA+",
    image: "",
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
      { date: "1990", event: "Produced", detail: "Xiaguan factory · Xiaofa export series" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "500 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-005",
    name: "7592 삼분숙병",
    subtitle: "Menghai 7592 · 30% lightly-fermented ripe Bing (三分熟餅)",
    vintage: 1992,
    weight: "357g",
    factory: "Menghai 勐海",
    grade: "AA+",
    image: "",
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
      { date: "1992", event: "Produced", detail: "Menghai factory · 7592 recipe" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "200 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-006",
    name: "운남 봉황 소타",
    subtitle: "Yunnan Phoenix Small Tuo (鳳凰小沱) · classic 1990s small bird-nest tuo",
    vintage: 1995,
    weight: "100g",
    factory: "Yunnan 雲南",
    grade: "A",
    image: "",
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
      { date: "1995", event: "Produced", detail: "Yunnan provincial Phoenix series" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "15,000 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-007",
    name: "하관 청소타",
    subtitle: "Xiaguan Raw Small Tuo (生小沱) · firm-pressed long-storage classic",
    vintage: 1990,
    weight: "100g",
    factory: "Xiaguan 下关",
    grade: "A",
    image: "",
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
      { date: "1990", event: "Produced", detail: "Xiaguan factory · raw small Tuo" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "10,000 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-008",
    name: "보이차전 (1970)",
    subtitle: "1970 Pu'er Cha Zhuan (茶磚) · brick-form rare aged",
    vintage: 1970,
    weight: "250g",
    factory: "Menghai 勐海",
    grade: "AA+",
    image: "",
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
      { date: "1970", event: "Produced", detail: "Menghai factory · brick-form (茶磚)" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage · 50+ year aged" },
      { date: "2026-04-08", event: "Tokenized", detail: "800 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-009",
    name: "완전건창 맹해 청소타",
    subtitle: "Fully Dry-Stored Menghai Raw Small Tuo · early 2000s clean-storage",
    vintage: 2000,
    weight: "100g",
    factory: "Menghai 勐海",
    grade: "A",
    image: "",
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
      { date: "2000", event: "Produced", detail: "Menghai factory · raw small Tuo" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura · fully dry-storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "1,000 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-010",
    name: "맹해 소타",
    subtitle: "Menghai Small Tuo (小沱) · early-2000s factory-direct stockpile",
    vintage: 2000,
    weight: "100g",
    factory: "Menghai 勐海",
    grade: "A",
    image: "",
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
      { date: "2000", event: "Produced", detail: "Menghai factory · small Tuo" },
      { date: "2024", event: "Vault Acquired", detail: "HK Kura cold storage" },
      { date: "2026-04-08", event: "Tokenized", detail: "1,800 units minted 1:1 as ERC-721 on BSC" },
    ],
  },
  {
    id: "puer-011",
    name: "홍태창",
    subtitle: "Hung Tai Chang (鴻泰昌) · 1950s antique private-label cake",
    vintage: 1950,
    weight: "357g",
    factory: "Hung Tai Chang 鴻泰昌",
    grade: "AAA",
    image: "",
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
    subtitle: "Ha Nai Yuan (河內圓茶) · 1950s Hanoi-routed antique round cake",
    vintage: 1950,
    weight: "250g",
    factory: "Ha Nai Yuan 河內",
    grade: "AAA",
    image: "",
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
      { date: "1950", event: "Produced", detail: "Ha Nai Yuan · Hanoi-routed export round cake" },
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
    contractAddress: "0xdae7BE3dAe2f8E90b7B68FdF92cb13a0aa5Ee479", // ADDRESSES.KKD_TOKEN
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
    contractAddress: "0x374609bfC6492E618fB44985f6548A218e1bF757", // ADDRESSES.RWA_PUER_TOKEN
  },
];

const DEMO_POOLS: StakingPool[] = [
  { id: "pool-1", name: "KKDA Staking", pair: "KKDA", apy: 14.5, totalStaked: 2_500_000, totalStakedUsd: 3_121_250_000, minStake: 100, lockDays: 30, rewardToken: "KKDA" },
  { id: "pool-2", name: "KKDA-USDT LP", pair: "KKDA-USDT", apy: 18.4, totalStaked: 890_000, totalStakedUsd: 1_111_265_000, minStake: 50, lockDays: 90, rewardToken: "KKDA" },
  { id: "pool-3", name: "PUER-USDT LP", pair: "PUER-USDT", apy: 12.1, totalStaked: 5_200_000, totalStakedUsd: 6_492_200_000, minStake: 500, lockDays: 180, rewardToken: "PUER" },
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
      name: "kkikda-store-v4-rwa-issuance-2",
      partialize: (s) => ({ lang: s.lang, user: s.user, orders: s.orders, teaCakes: s.teaCakes, tokens: s.tokens, mintRecords: s.mintRecords, stakingPools: s.stakingPools }),
    }
  )
);

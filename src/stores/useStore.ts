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
  price: number;       // in BNB
  priceUsd: number;
  appraisal: number;   // USD
  tags: string[];
  category: "raw" | "ripe" | "aged" | "white";
  tokenId: number;
  contractAddress: string;
  owner: string;
  isListed: boolean;
  provenance: { date: string; event: string; detail: string }[];
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

  tokens: Token[];
  setTokens: (t: Token[]) => void;
  addToken: (t: Token) => void;
  updateToken: (id: string, data: Partial<Token>) => void;

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

/* ───── Demo Data ───── */

const DEMO_TEA_CAKES: TeaCake[] = [
  {
    id: "tc-1",
    name: "Menghai '88 Qing Bing",
    subtitle: "Original raw Pu'er stored in dry Hong Kong warehouse since 1992",
    vintage: 1988,
    weight: "357g",
    factory: "Menghai Tea Factory",
    grade: "AAA",
    image: "/tea/menghai88.jpg",
    price: 4.8,
    priceUsd: 12450,
    appraisal: 12450,
    tags: ["Audited", "Rare", "Certified"],
    category: "raw",
    tokenId: 1,
    contractAddress: "0x1111...2222",
    owner: "0xabc...123",
    isListed: true,
    provenance: [
      { date: "1988", event: "Produced", detail: "Menghai Tea Factory, Yunnan" },
      { date: "1992", event: "Transferred", detail: "Hong Kong dry storage vault" },
      { date: "2018", event: "Authenticated", detail: "Master Chen verification" },
      { date: "2024", event: "Tokenized", detail: "Minted as NFT on BSC" },
    ],
  },
  {
    id: "tc-2",
    name: "Purple Peacock Gong Bing",
    subtitle: "Rare purple leaf variety from Bulang Mountains, aged in ceramic vessels",
    vintage: 1996,
    weight: "400g",
    factory: "CNNP Kunming",
    grade: "AA+",
    image: "/tea/purple-peacock.jpg",
    price: 3.4,
    priceUsd: 8900,
    appraisal: 8900,
    tags: ["Rare", "Certified"],
    category: "raw",
    tokenId: 2,
    contractAddress: "0x1111...2222",
    owner: "0xdef...456",
    isListed: true,
    provenance: [
      { date: "1996", event: "Produced", detail: "CNNP Kunming Factory" },
      { date: "2005", event: "Transferred", detail: "Private collector, Guangzhou" },
      { date: "2023", event: "Authenticated", detail: "Tea Master Li verification" },
      { date: "2024", event: "Tokenized", detail: "Minted as NFT on BSC" },
    ],
  },
  {
    id: "tc-3",
    name: "Jingmai Ancient Tree",
    subtitle: "Harvested from 500-year-old trees. Characterized by honey fragrance",
    vintage: 2003,
    weight: "357g",
    factory: "Jingmai Cooperative",
    grade: "A",
    image: "/tea/jingmai.jpg",
    price: 2.2,
    priceUsd: 5820,
    appraisal: 5820,
    tags: ["Audited", "Certified"],
    category: "raw",
    tokenId: 3,
    contractAddress: "0x1111...2222",
    owner: "0x333...444",
    isListed: true,
    provenance: [
      { date: "2003", event: "Harvested", detail: "Jingmai Mountain, Yunnan" },
      { date: "2003", event: "Pressed", detail: "Jingmai Cooperative" },
      { date: "2022", event: "Authenticated", detail: "Lab analysis + master tasting" },
      { date: "2024", event: "Tokenized", detail: "Minted as NFT on BSC" },
    ],
  },
  {
    id: "tc-4",
    name: "Red Stamp Round Tea",
    subtitle: "1950s Hong Yin, museum-grade condition with original wrapper",
    vintage: 1955,
    weight: "330g",
    factory: "Zhongcha",
    grade: "AAA",
    image: "/tea/red-stamp.jpg",
    price: 18.5,
    priceUsd: 48100,
    appraisal: 48100,
    tags: ["Audited", "Rare", "Certified", "Museum Grade"],
    category: "aged",
    tokenId: 4,
    contractAddress: "0x1111...2222",
    owner: "0x777...888",
    isListed: true,
    provenance: [
      { date: "1955", event: "Produced", detail: "Zhongcha Company, Yunnan" },
      { date: "1978", event: "Acquired", detail: "Taiwan collector" },
      { date: "2015", event: "Authenticated", detail: "Sotheby's tea division" },
      { date: "2024", event: "Tokenized", detail: "Minted as NFT on BSC" },
    ],
  },
  {
    id: "tc-5",
    name: "Yiwu Spring Tips",
    subtitle: "First flush spring harvest, stone-pressed using traditional methods",
    vintage: 2010,
    weight: "200g",
    factory: "Yiwu Village Press",
    grade: "AA+",
    image: "/tea/yiwu.jpg",
    price: 1.1,
    priceUsd: 2850,
    appraisal: 2850,
    tags: ["Certified"],
    category: "raw",
    tokenId: 5,
    contractAddress: "0x1111...2222",
    owner: "0x999...000",
    isListed: true,
    provenance: [
      { date: "2010", event: "Harvested", detail: "Yiwu village, Xishuangbanna" },
      { date: "2010", event: "Stone-pressed", detail: "Traditional method" },
      { date: "2023", event: "Authenticated", detail: "Master verification" },
      { date: "2024", event: "Tokenized", detail: "Minted as NFT on BSC" },
    ],
  },
  {
    id: "tc-6",
    name: "Bulang Mountain Ripe",
    subtitle: "Shu pu'er with 20 years of aging, rich and earthy profile",
    vintage: 2004,
    weight: "357g",
    factory: "Haiwan Tea Factory",
    grade: "A",
    image: "/tea/bulang-ripe.jpg",
    price: 0.8,
    priceUsd: 2100,
    appraisal: 2100,
    tags: ["Certified"],
    category: "ripe",
    tokenId: 6,
    contractAddress: "0x1111...2222",
    owner: "0xbbb...ccc",
    isListed: true,
    provenance: [
      { date: "2004", event: "Produced", detail: "Haiwan Tea Factory" },
      { date: "2020", event: "Authenticated", detail: "Tea Master Wang" },
      { date: "2024", event: "Tokenized", detail: "Minted as NFT on BSC" },
    ],
  },
];

const DEMO_TOKENS: Token[] = [
  {
    id: "kkd",
    symbol: "KKDA",
    name: "KKIKDA Token",
    price: 1248.5,
    change24h: 5.24,
    volume24h: 2_840_000,
    marketCap: 42_890_200,
    supply: 17_142_857,
    maxSupply: 100_000_000,
    category: "governance",
    isPaused: false,
    contractAddress: "0x1234...5678",
  },
  {
    id: "puer",
    symbol: "PUER",
    name: "Vintage Pu'er Index",
    price: 158.3,
    change24h: 1.8,
    volume24h: 320_000,
    marketCap: 15_830_000,
    supply: 100_000,
    maxSupply: 100_000,
    category: "rwa",
    isPaused: false,
    contractAddress: "0xabcd...ef01",
  },
];

const DEMO_POOLS: StakingPool[] = [
  { id: "pool-1", name: "KKDA Staking", pair: "KKDA", apy: 14.5, totalStaked: 2_500_000, totalStakedUsd: 3_121_250_000, minStake: 100, lockDays: 30, rewardToken: "KKDA" },
  { id: "pool-2", name: "KKDA-BNB LP", pair: "KKDA-BNB", apy: 18.4, totalStaked: 890_000, totalStakedUsd: 1_111_265_000, minStake: 50, lockDays: 90, rewardToken: "KKDA" },
  { id: "pool-3", name: "KKDA-USDT LP", pair: "KKDA-USDT", apy: 12.1, totalStaked: 5_200_000, totalStakedUsd: 6_492_200_000, minStake: 500, lockDays: 180, rewardToken: "PUER" },
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

      tokens: DEMO_TOKENS,
      setTokens: (tokens) => set({ tokens }),
      addToken: (t) => {
        set((s) => ({ tokens: [...s.tokens, t] }));
        get().addToast({ type: "success", title: "Token Created", message: `${t.symbol} created` });
      },
      updateToken: (id, data) =>
        set((s) => ({ tokens: s.tokens.map((t) => (t.id === id ? { ...t, ...data } : t)) })),

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
      name: "kkikda-store-v2",
      partialize: (s) => ({ lang: s.lang, user: s.user, orders: s.orders }),
    }
  )
);

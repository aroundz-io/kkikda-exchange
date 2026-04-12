import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "ko" | "zh" | "ja" | "es";

export interface Token {
  id: string;
  symbol: string;
  name: string;
  nameKo?: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  supply: number;
  maxSupply: number;
  image: string;
  category: "rwa" | "utility" | "governance";
  isPaused: boolean;
  contractAddress: string;
}

export interface NFTItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  priceUsd: number;
  owner: string;
  creator: string;
  collection: string;
  category: "tea" | "art" | "membership" | "rwa";
  rarity: "common" | "rare" | "legendary" | "mythic";
  isListed: boolean;
  isBurned: boolean;
  tokenId: number;
  contractAddress: string;
  attributes: { trait: string; value: string }[];
  history: { date: string; event: string; value: string }[];
}

export interface UserState {
  address: string | null;
  balance: number;
  kycTier: 0 | 1 | 2 | 3;
  isAdmin: boolean;
}

export interface StakingPool {
  id: string;
  name: string;
  apy: number;
  totalStaked: number;
  minStake: number;
  lockDays: number;
  rewardToken: string;
}

export interface SiteConfig {
  siteName: string;
  announcement: string;
  announcementEnabled: boolean;
  maintenanceMode: boolean;
  tradingEnabled: boolean;
  stakingEnabled: boolean;
  nftEnabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  featuredCollectionId: string;
}

export interface Order {
  id: string;
  type: "buy" | "sell";
  token: string;
  amount: number;
  price: number;
  total: number;
  status: "open" | "filled" | "cancelled";
  timestamp: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export interface StakePosition {
  poolId: string;
  amount: number;
  stakedAt: number;
  rewards: number;
}

interface AppStore {
  lang: Lang;
  setLang: (l: Lang) => void;

  user: UserState;
  setUser: (u: Partial<UserState>) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;

  tokens: Token[];
  setTokens: (t: Token[]) => void;
  addToken: (t: Token) => void;
  updateToken: (id: string, data: Partial<Token>) => void;

  nfts: NFTItem[];
  setNfts: (n: NFTItem[]) => void;
  addNft: (n: NFTItem) => void;
  updateNft: (id: string, data: Partial<NFTItem>) => void;

  stakingPools: StakingPool[];
  setStakingPools: (p: StakingPool[]) => void;

  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "status" | "timestamp">) => void;
  cancelOrder: (id: string) => void;

  stakePositions: StakePosition[];
  stakeTokens: (poolId: string, amount: number) => void;
  unstakeTokens: (poolId: string) => void;
  claimRewards: (poolId: string) => void;

  purchaseNft: (nftId: string) => void;

  toasts: Toast[];
  addToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  siteConfig: SiteConfig;
  updateSiteConfig: (c: Partial<SiteConfig>) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const DEMO_TOKENS: Token[] = [
  {
    id: "kkd",
    symbol: "KKD",
    name: "KKIKDA Token",
    nameKo: "끽다 토큰",
    price: 2.45,
    change24h: 5.2,
    volume24h: 1_280_000,
    marketCap: 42_000_000,
    supply: 17_142_857,
    maxSupply: 100_000_000,
    image: "/tokens/kkd.png",
    category: "governance",
    isPaused: false,
    contractAddress: "0x1234...5678",
  },
  {
    id: "rwa-puer-01",
    symbol: "PUER",
    name: "Vintage Pu'er 2005",
    nameKo: "빈티지 보이차 2005",
    price: 158.3,
    change24h: 1.8,
    volume24h: 320_000,
    marketCap: 15_830_000,
    supply: 100_000,
    maxSupply: 100_000,
    image: "/tokens/puer.png",
    category: "rwa",
    isPaused: false,
    contractAddress: "0xabcd...ef01",
  },
  {
    id: "rwa-puer-02",
    symbol: "AGED",
    name: "Imperial Aged Tea",
    nameKo: "황실 숙성차",
    price: 420.0,
    change24h: -2.1,
    volume24h: 89_000,
    marketCap: 4_200_000,
    supply: 10_000,
    maxSupply: 10_000,
    image: "/tokens/aged.png",
    category: "rwa",
    isPaused: false,
    contractAddress: "0x9876...5432",
  },
  {
    id: "rwa-cer-01",
    symbol: "CERA",
    name: "Yixing Ceramics Token",
    nameKo: "이싱 도자기 토큰",
    price: 75.5,
    change24h: 3.4,
    volume24h: 156_000,
    marketCap: 7_550_000,
    supply: 100_000,
    maxSupply: 500_000,
    image: "/tokens/cera.png",
    category: "rwa",
    isPaused: false,
    contractAddress: "0xfedc...ba98",
  },
];

const DEMO_NFTS: NFTItem[] = [
  {
    id: "nft-1",
    name: "Menghai '88 Qing Bing",
    description: "A legendary 1988 Menghai raw Pu'er tea cake, verified provenance.",
    image: "/nft/menghai88.jpg",
    price: 12.5,
    priceUsd: 30625,
    owner: "0xabc...123",
    creator: "0xdef...456",
    collection: "Legendary Vintages",
    category: "tea",
    rarity: "mythic",
    isListed: true,
    isBurned: false,
    tokenId: 1,
    contractAddress: "0x1111...2222",
    attributes: [
      { trait: "Year", value: "1988" },
      { trait: "Type", value: "Raw Pu'er" },
      { trait: "Weight", value: "357g" },
      { trait: "Factory", value: "Menghai" },
    ],
    history: [
      { date: "2024-01", event: "Minted", value: "8 ETH" },
      { date: "2024-06", event: "Sold", value: "10.2 ETH" },
      { date: "2025-01", event: "Listed", value: "12.5 ETH" },
    ],
  },
  {
    id: "nft-2",
    name: "Purple Stamp Round Tea",
    description: "1950s Purple Stamp Pu'er, museum-grade condition.",
    image: "/nft/purplestamp.jpg",
    price: 45.0,
    priceUsd: 110250,
    owner: "0xfed...987",
    creator: "0xdef...456",
    collection: "Legendary Vintages",
    category: "tea",
    rarity: "legendary",
    isListed: true,
    isBurned: false,
    tokenId: 2,
    contractAddress: "0x1111...2222",
    attributes: [
      { trait: "Year", value: "1955" },
      { trait: "Type", value: "Raw Pu'er" },
      { trait: "Weight", value: "330g" },
      { trait: "Grade", value: "Museum" },
    ],
    history: [
      { date: "2024-03", event: "Minted", value: "30 ETH" },
      { date: "2025-02", event: "Listed", value: "45 ETH" },
    ],
  },
  {
    id: "nft-3",
    name: "Golden Yixing Teapot #7",
    description: "Handcrafted Yixing teapot by Master Chen, 24k gold inlay.",
    image: "/nft/yixing7.jpg",
    price: 5.8,
    priceUsd: 14210,
    owner: "0x333...444",
    creator: "0x555...666",
    collection: "Master Craftworks",
    category: "art",
    rarity: "rare",
    isListed: true,
    isBurned: false,
    tokenId: 7,
    contractAddress: "0x3333...4444",
    attributes: [
      { trait: "Artist", value: "Master Chen" },
      { trait: "Material", value: "Yixing Clay + 24k Gold" },
      { trait: "Edition", value: "1 of 1" },
    ],
    history: [
      { date: "2025-01", event: "Minted", value: "5.8 ETH" },
    ],
  },
  {
    id: "nft-4",
    name: "Kura Membership: Jade",
    description: "Lifetime access to the Kura private tea vault and exclusive drops.",
    image: "/nft/membership-jade.jpg",
    price: 2.0,
    priceUsd: 4900,
    owner: "0x777...888",
    creator: "0xdef...456",
    collection: "Kura Membership",
    category: "membership",
    rarity: "rare",
    isListed: true,
    isBurned: false,
    tokenId: 12,
    contractAddress: "0x5555...6666",
    attributes: [
      { trait: "Tier", value: "Jade" },
      { trait: "Benefits", value: "Private Vault + Priority Drops" },
    ],
    history: [
      { date: "2025-03", event: "Minted", value: "2 ETH" },
    ],
  },
];

const DEMO_POOLS: StakingPool[] = [
  { id: "pool-1", name: "KKD Staking", apy: 14.5, totalStaked: 2_500_000, minStake: 100, lockDays: 30, rewardToken: "KKD" },
  { id: "pool-2", name: "PUER LP Farming", apy: 28.3, totalStaked: 890_000, minStake: 50, lockDays: 90, rewardToken: "KKD" },
  { id: "pool-3", name: "RWA Yield Vault", apy: 8.2, totalStaked: 5_200_000, minStake: 500, lockDays: 180, rewardToken: "PUER" },
];

const genId = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      lang: "ko" as Lang,
      setLang: (lang) => set({ lang }),

      user: { address: null, balance: 0, kycTier: 0, isAdmin: false },
      setUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
      connectWallet: () => {
        set({
          user: {
            address: "0x7a3F...9e2B",
            balance: 4.238,
            kycTier: 2,
            isAdmin: true,
          },
        });
        get().addToast({ type: "success", title: "Wallet Connected", message: "Connected as 0x7a3F...9e2B" });
      },
      disconnectWallet: () => {
        set({ user: { address: null, balance: 0, kycTier: 0, isAdmin: false } });
        get().addToast({ type: "info", title: "Disconnected", message: "Wallet disconnected" });
      },

      tokens: DEMO_TOKENS,
      setTokens: (tokens) => set({ tokens }),
      addToken: (t) => {
        set((s) => ({ tokens: [...s.tokens, t] }));
        get().addToast({ type: "success", title: "Token Created", message: `${t.symbol} has been created` });
      },
      updateToken: (id, data) =>
        set((s) => ({
          tokens: s.tokens.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      nfts: DEMO_NFTS,
      setNfts: (nfts) => set({ nfts }),
      addNft: (n) => {
        set((s) => ({ nfts: [...s.nfts, n] }));
        get().addToast({ type: "success", title: "NFT Minted", message: `${n.name} has been minted` });
      },
      updateNft: (id, data) =>
        set((s) => ({
          nfts: s.nfts.map((n) => (n.id === id ? { ...n, ...data } : n)),
        })),

      stakingPools: DEMO_POOLS,
      setStakingPools: (stakingPools) => set({ stakingPools }),

      orders: [],
      placeOrder: (o) => {
        const order: Order = { ...o, id: genId(), status: "filled", timestamp: Date.now() };
        set((s) => ({ orders: [order, ...s.orders].slice(0, 50) }));
        // Simulate balance change
        const { user } = get();
        if (o.type === "buy") {
          set({ user: { ...user, balance: Math.max(0, user.balance - o.total / 2450) } });
        } else {
          set({ user: { ...user, balance: user.balance + o.total / 2450 } });
        }
        get().addToast({
          type: "success",
          title: `Order ${o.type === "buy" ? "Bought" : "Sold"}`,
          message: `${o.amount} ${o.token} at $${o.price.toFixed(2)}`,
        });
      },
      cancelOrder: (id) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" as const } : o)),
        }));
        get().addToast({ type: "info", title: "Order Cancelled", message: "Your order has been cancelled" });
      },

      stakePositions: [],
      stakeTokens: (poolId, amount) => {
        const pool = get().stakingPools.find((p) => p.id === poolId);
        if (!pool) return;
        set((s) => ({
          stakePositions: [...s.stakePositions, { poolId, amount, stakedAt: Date.now(), rewards: 0 }],
          stakingPools: s.stakingPools.map((p) =>
            p.id === poolId ? { ...p, totalStaked: p.totalStaked + amount } : p
          ),
        }));
        get().addToast({ type: "success", title: "Staked", message: `${amount} tokens staked in ${pool.name}` });
      },
      unstakeTokens: (poolId) => {
        set((s) => ({
          stakePositions: s.stakePositions.filter((p) => p.poolId !== poolId),
        }));
        get().addToast({ type: "success", title: "Unstaked", message: "Tokens have been unstaked" });
      },
      claimRewards: (poolId) => {
        const pool = get().stakingPools.find((p) => p.id === poolId);
        get().addToast({ type: "success", title: "Rewards Claimed", message: `Rewards from ${pool?.name || "pool"} claimed` });
      },

      purchaseNft: (nftId) => {
        const nft = get().nfts.find((n) => n.id === nftId);
        if (!nft || !get().user.address) return;
        set((s) => ({
          nfts: s.nfts.map((n) =>
            n.id === nftId
              ? {
                  ...n,
                  owner: s.user.address || n.owner,
                  isListed: false,
                  history: [...n.history, { date: new Date().toISOString().slice(0, 7), event: "Purchased", value: `${n.price} ETH` }],
                }
              : n
          ),
          user: { ...s.user, balance: Math.max(0, s.user.balance - nft.price) },
        }));
        get().addToast({ type: "success", title: "NFT Purchased!", message: `You now own "${nft.name}"` });
      },

      toasts: [],
      addToast: (t) => {
        const toast: Toast = { ...t, id: genId() };
        set((s) => ({ toasts: [...s.toasts, toast] }));
        // Auto-remove after 4s
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((tt) => tt.id !== toast.id) }));
        }, 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      siteConfig: {
        siteName: "KKIKDA",
        announcement: "RWA Token Launch: Vintage Pu'er 2005 now available for trading",
        announcementEnabled: true,
        maintenanceMode: false,
        tradingEnabled: true,
        stakingEnabled: true,
        nftEnabled: true,
        heroTitle: "Vintage Pu'er tea",
        heroSubtitle: "meets blockchain",
        featuredCollectionId: "legendary-vintages",
      },
      updateSiteConfig: (c) => {
        set((s) => ({ siteConfig: { ...s.siteConfig, ...c } }));
        get().addToast({ type: "success", title: "Settings Saved", message: "Site configuration updated" });
      },

      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: "kkikda-store",
      partialize: (state) => ({
        lang: state.lang,
        user: state.user,
        tokens: state.tokens,
        nfts: state.nfts,
        orders: state.orders,
        stakePositions: state.stakePositions,
        stakingPools: state.stakingPools,
        siteConfig: state.siteConfig,
      }),
    }
  )
);

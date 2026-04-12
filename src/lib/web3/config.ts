import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, bscTestnet } from "wagmi/chains";
import { http } from "wagmi";

export const chains = [bsc, bscTestnet] as const;

// WalletConnect Cloud project ID
// Get yours at https://cloud.walletconnect.com/
// Using a placeholder that won't break MetaMask injection-based connections
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "21fef48091f12692cad574a6f7753643";

export const config = getDefaultConfig({
  appName: "KKIKDA Exchange",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains,
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org/"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.bnbchain.org:8545"),
  },
  ssr: true,
});

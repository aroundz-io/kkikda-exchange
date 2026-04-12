import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, bscTestnet } from "wagmi/chains";
import { http } from "wagmi";

export const chains = [bsc, bscTestnet] as const;

export const config = getDefaultConfig({
  appName: "KKIKDA Exchange",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID",
  chains,
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org/"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.bnbchain.org:8545"),
  },
  ssr: true,
});

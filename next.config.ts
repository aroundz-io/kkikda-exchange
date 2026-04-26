import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              [
                "connect-src 'self'",
                // BSC public RPCs (testnet + mainnet)
                "https://*.bnbchain.org",
                "https://*.binance.org",
                "https://*.publicnode.com",
                "https://bsc.publicnode.com",
                // Generic node providers (kept for fallback)
                "https://*.infura.io",
                "wss://*.infura.io",
                "https://*.alchemy.com",
                "wss://*.alchemy.com",
                // WalletConnect / Reown / RainbowKit relay + verify + explorer
                "https://*.walletconnect.com",
                "https://*.walletconnect.org",
                "https://*.web3modal.org",
                "https://*.reown.com",
                "wss://*.walletconnect.com",
                "wss://*.walletconnect.org",
                "wss://*.reown.com",
                "wss://relay.walletconnect.com",
                "wss://relay.walletconnect.org",
                // Misc data
                "https://api.coingecko.com",
              ].join(" "),
              // WalletConnect modal renders inside an iframe
              "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.reown.com https://verify.walletconnect.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

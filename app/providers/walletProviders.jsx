"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  polygonAmoy,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECTPROJECTID ??
  "a8596606f31dd36e8f20bd4237ef2415";

const customPolygonAmoy = {
  ...polygonAmoy,
  rpcUrls: {
    default: {
      http: [
        "https://polygon-amoy.g.alchemy.com/v2/AZBKEZeaHBjvMwtb79QDbq8g6PAwKjLd",
      ], // Replace with your RPC URL
    },
  },
};

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: projectId,
  chains: [customPolygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
export const WalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

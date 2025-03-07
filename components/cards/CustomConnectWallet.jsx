"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, LogOut, AlertCircle } from "lucide-react";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useState, useEffect } from "react";

// Polygon Amoy testnet chain ID
const POLYGON_AMOY_CHAIN_ID = 80002;

export default function CustomConnectButton() {
  const { isConnected, chain, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Check if connected to the correct network
  useEffect(() => {
    if (isConnected && chainId !== POLYGON_AMOY_CHAIN_ID) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [isConnected, chainId]);

  // Handle switching to Polygon Amoy
  const handleSwitchNetwork = () => {
    switchChain({ chainId: POLYGON_AMOY_CHAIN_ID });
  };

  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, chain: rainbowChain }) => {
        return (
          <div className="flex gap-2 items-center">
            {isConnected ? (
              <>
                {isWrongNetwork ? (
                  <button
                    onClick={handleSwitchNetwork}
                    className="flex justify-center items-center bg-yellow-500 text-black font-bold text-lg md:text-xl px-4 md:px-6 py-2 md:py-3 rounded-md transition duration-300 hover:bg-yellow-600"
                  >
                    <AlertCircle className="h-5 mr-2" />
                    Switch to Polygon Amoy
                  </button>
                ) : (
                  <button
                    onClick={disconnect}
                    className="flex justify-center items-center bg-[#39FF14] text-black font-bold text-lg md:text-xl px-4 md:px-6 py-2 md:py-3 rounded-md transition duration-300 hover:bg-red-600"
                  >
                    {account.displayName}
                    <LogOut className="h-6 ml-2" />
                  </button>
                )}
              </>
            ) : (
              <div className="">
                <button onClick={openConnectModal} className="btn btn-video">
                  <video
                    src="/connect-bg.mp4"
                    muted
                    loop
                    autoPlay
                    height={56}
                    width={128}
                    className="h-fit"
                  ></video>
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

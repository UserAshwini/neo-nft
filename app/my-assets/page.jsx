"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { nftAddress, nftMarketAddress } from "@/config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { config } from "../providers/walletProviders";
import { useAccount } from "wagmi";
import axios from "axios";
import NftGrid from "@/components/cards/NftGrid";
import AnimatedText from "@/components/cards/AnimatedText";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const [loadingState, setLoadingState] = useState("not-loaded");
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      loadNfts();
    }
  }, [address]);

  async function loadNfts() {
    setLoadingState("loading");
    try {
      const marketItems = await readContract(config, {
        abi: Market.abi,
        address: nftMarketAddress,
        functionName: "fetchMyNFTs",
        args: [address],
      });
      if (!marketItems || marketItems.length === 0) {
        setIsEmpty(true);
        setLoadingState("loaded");
        return;
      }

      const items = await Promise.all(
        marketItems.map(async (i) => {
          const tokenUri = await readContract(config, {
            abi: NFT.abi,
            address: nftAddress,
            functionName: "tokenURI",
            args: [i.tokenId],
          });
          const meta = await axios.get(tokenUri);
          let price = ethers.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: Number(i.tokenId),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
          };
          return item;
        })
      );
      setNfts(items);
      setLoadingState("loaded");
    } catch (error) {
      console.log(error);
      setLoadingState("error");
    }
  }

  if (loadingState === "loading") {
    return <div className={"loader loader-center"}></div>;
  }

  return (
    <>
      <div className="px-4 sm:px-8 md:px-12 lg:px-32 py-6 sm:py-8 md:py-10 lg:py-12">
        {loadingState === "loaded" && isEmpty ? (
          <div className="flex items-center justify-center min-h-screen gap-4 text-4xl text-[#39FF14]">
            <AnimatedText text="No NFTs Bought" color="#39FF14" />
          </div>
        ) : (
          <div className="row section home-feature ">
            <div className="section-header col-12">
              <div className="section-heading">My NFTs</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
              {nfts.map((nft, i) => (
                <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
                  <NftGrid
                    nftPath={nft.image}
                    nftName={nft.name}
                    nftDiscription={nft.description}
                    nftPrice={nft.price + " ETH"}
                    nft={nft}
                    index={i}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

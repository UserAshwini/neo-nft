"use client";
import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { readContract } from "@wagmi/core";

import { nftAddress, nftMarketAddress } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { config } from "../providers/walletProviders";

import NftGrid from "@/components/cards/NftGrid";
import AnimatedText from "@/components/cards/AnimatedText";

const Explore = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    fetchNFTs();
  }, []);

  async function fetchNFTs() {
    setLoadingState("loading");
    try {
      const marketItems = await readContract(config, {
        abi: Market.abi,
        address: nftMarketAddress,
        functionName: "fetchMarketItems",
      });
      if (!marketItems || marketItems.length === 0) {
        setIsEmpty(true);
        setLoadingState("loaded");
        return;
      }
      console.log(marketItems);
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
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );
      setNfts(items);
      setLoadingState("loaded");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-32 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className=" section home-feature">
        <div className="section-header col-12">
          <div className="section-heading">All NFTs</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 ">
          {loadingState === "loading" ? (
            <div className="col-span-full flex justify-center items-center h-12">
              <div className="loader"></div>
            </div>
          ) : nfts.length > 0 ? (
            nfts.map((nft, i) => (
              <div key={i}>
                <NftGrid
                  nftPath={nft.image}
                  nftName={nft.name}
                  nftDiscription={nft.description}
                  nftPrice={nft.price + " ETH"}
                  nft={nft}
                  index={i}
                />
              </div>
            ))
          ) : (
            <AnimatedText text="No NFTs Available" color="#39FF14" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;

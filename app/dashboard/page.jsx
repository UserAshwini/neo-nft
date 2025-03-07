"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { nftAddress, nftMarketAddress } from "@/config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { config } from "../providers/walletProviders";
import axios from "axios";
import { useAccount } from "wagmi";
import NftGrid from "@/components/cards/NftGrid";

export default function Dashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [isNftEmpty, setIsNftEmpty] = useState(false);
  const [isSoldEmpty, setIsSoldEmpty] = useState(false);

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
        functionName: "fetchItemsCreated",
        args: [address],
      });

      if (marketItems.length === 0) {
        setIsNftEmpty(true);
        setLoadingState("loaded");
        return;
      }
      console.log("marketitems", marketItems);

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
            sold: i.sold,
          };
          return item;
        })
      );

      const soldItems = items.filter((item) => item.sold === true);

      setSold(soldItems);
      setIsSoldEmpty(soldItems.length === 0);
      console.log("sold", soldItems);
      setNfts(items);
      setLoadingState("loaded");
    } catch (error) {
      console.log(error);
    }
  }

  if (loadingState === "loading") {
    return <div className={"loader loader-center"}></div>;
  }
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-32 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="row section home-feature ml-auto">
        <div className="section-header col-12">
          <div className="section-heading">All NFTs</div>
        </div>
        {isNftEmpty ? (
          <div className="text-center text-2xl text-gray-500">No NFTs</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
            {nfts.map(
              (nft, i) =>
                !nfts[i].sold && (
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
                )
            )}
          </div>
        )}
      </div>
      <div className="row section home-feature px-32 py-10">
        <div className="section-header col-12">
          <div className="section-heading">Sold NFTs</div>
        </div>
        {isSoldEmpty ? (
          <div className="text-center text-gray-500">No Sold NFTs</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
            {sold.map((nft, i) => (
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
        )}
      </div>
    </div>
  );
}

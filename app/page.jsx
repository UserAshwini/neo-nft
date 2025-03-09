"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { readContract } from "@wagmi/core";

import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { config } from "./providers/walletProviders";
// import { useAccount } from "wagmi";
import NftGrid from "@/components/cards/NftGrid";
import { useGSAP } from "@gsap/react";
import { MoveRight, Sparkles } from "lucide-react";
import BtnPrimary from "@/components/buttons/BtnPrimary";
import AnimatedText from "@/components/cards/AnimatedText";
import HowItWorks from "@/components/cards/HowItWorks";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  // const { address } = useAccount();
  const router = useRouter();

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
      const limitedItems = marketItems.slice(0, 8);
      const items = await Promise.all(
        limitedItems.map(async (i) => {
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
    <div className="flex justify-center px-8 md:px-20">
      <div className="page home containe">
        <div className="flex home-hero mt-32">
          <div className="left col-12 col-md-6 w-50">
            <video src="/hero-bg.mp4" muted loop autoPlay></video>
            <div className="heading">
              Explore, Create, and Mint Unique <span>NFTs</span>.
            </div>
            <p>
              Explore a diverse collection of digital art, create your own NFTs,
              and connect with a global community of artists and collectors.
            </p>
          </div>
          <div className="right col-12 col-md-6 py-40">
            <div className="sub-heading">
              Join the community of creators and collectors by exploring the
              latest in digital art.
            </div>
            <button
              className="btn btn-main"
              onClick={() => router.push("/explore")}
            >
              Explore NFTs
              <MoveRight />
            </button>
          </div>
        </div>
        <div className=" section home-feature ">
          <div className="section-header col-12">
            <div className="section-heading">Our Cool NFTs</div>

            <BtnPrimary className="inline-flex items-center" to={"/explore"}>
              <span className="flex items-center">
                See All <Sparkles className="ml-4 " size={10} />
              </span>
            </BtnPrimary>
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
        <HowItWorks />
      </div>
    </div>
  );
}

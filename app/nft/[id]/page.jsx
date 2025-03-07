"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "@/app/providers/walletProviders";
import { nftMarketAddress, nftAddress } from "@/config";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const NftDetail = () => {
  const { id } = useParams();
  const [nft, setNft] = useState(null);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [error, setError] = useState(null);
  // const { address } = useAccount();
  const [isSold, setIsSold] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const router = useRouter();

  async function handleBuy() {
    setTransactionStatus("Processing transaction...");
    setIsModalOpen(true);
    setTransactionHash(null);
    try {
      const price = ethers.parseEther(nft.price);
      console.log(price);
      const { request: buyNftRequest } = await simulateContract(config, {
        abi: Market.abi,
        address: nftMarketAddress,
        functionName: "createMarketSale",
        args: [nftAddress, id],
        value: price,
        // gasPrice: ethers.parseUnits("20", "gwei"),
      });
      console.log(buyNftRequest);
      const txHash = await writeContract(config, buyNftRequest);
      setTransactionStatus("Waiting for confirmation...");
      console.log("txHash :", txHash);
      await waitForTransactionReceipt(config, { hash: txHash });
      setTransactionStatus("Transaction successful!");
      setTransactionHash(txHash);

      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/my-assets");
      }, 4000);

      console.log("transactionStatus", transactionStatus);
    } catch (error) {
      console.log("error : ", error);
    }
  }
  useEffect(() => {
    console.log("Transaction Status Updated:", transactionStatus);
  }, [transactionStatus]);

  const fetchNftDetails = async () => {
    try {
      setLoadingState("loading");
      setError(null);

      const nftData = await readContract(config, {
        abi: Market.abi,
        address: nftMarketAddress,
        functionName: "idToMarketItem",
        args: [id],
      });

      const tokenUri = await readContract(config, {
        abi: NFT.abi,
        address: nftAddress,
        functionName: "tokenURI",
        args: [id],
      });

      const meta = await axios.get(tokenUri);

      const price = ethers.formatUnits(nftData[5], "ether");

      let item = {
        price: price,
        tokenId: id,
        seller: nftData[3],
        owner: nftData[4],
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        sold: nftData[6],
      };

      setNft(item);
      setIsSold(item.sold);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingState("loaded");
    }
  };

  useEffect(() => {
    console.log("NFT ID:", id);
    if (id) {
      fetchNftDetails();
    }
  }, [id]);

  // console.log(nft?.name);

  if (loadingState === "loading") {
    return <div className={"loader loader-center"}></div>;
  }

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="text-white text-3xl font-bold mb-20">
              {transactionStatus}
            </p>
            {transactionHash && (
              <p className="mb-12">
                View transaction on{" "}
                <a
                  href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#39FF14] text-2xl gap-2 underline underline-offset-8 decoration-white"
                >
                  Amoy Explorer
                </a>
              </p>
            )}
            {!transactionHash && (
              <div className="mt-32 flex justify-center">
                <div className="loader loader-center"></div>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={
          loadingState
            ? "page nft-details container d-none"
            : "page nft-details container"
        }
      >
        {error && <p>Error: {error}</p>}
        {loadingState && nft && (
          <div
            className="nft-details-bg lg:ml-28 ml-0 mt-48 flex flex-col lg:flex-row"
            style={{ background: `url(${nft.image}) no-repeat` }}
          >
            <div className="col-12 col-lg-6 nft-image">
              <img src={nft.image} alt={nft.name} />
            </div>
            <div className="col-12 col-lg-6 nft-info">
              <h2>{nft.name}</h2>
              <p>{nft.description}</p>
              <button className="btn btn-white bg-white" onClick={() => {}}>
                View On<span>Explorer</span>
              </button>
              <button
                className={`btn btn-white bg-[#39FF14] ${
                  isSold ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ marginTop: "5px" }}
                onClick={() => nft && handleBuy(nft)}
                disabled={isSold} // Disable if NFT is sold
              >
                {isSold ? "Sold Out" : "Buy NFT"}
              </button>
              <p className="date">{nft.price} ETH</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NftDetail;

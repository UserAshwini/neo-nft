"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { PinataSDK } from "pinata-web3";
import { nftAddress, nftMarketAddress } from "@/config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { config } from "../providers/walletProviders";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";
import ImageUpload from "@/components/cards/ImageUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import CustomConnectButton from "@/components/cards/CustomConnectWallet";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export default function CreateItem() {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const { isConnected } = useAccount();
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  const handleImageUrl = (fileUrl) => {
    console.log("Received File URL:", fileUrl);
    setFileUrl(fileUrl); // Save the URL in the state
  };

  async function uploadItem() {
    const { name, description, price } = formInput;

    // Check if any of the required fields are empty
    if (!name) {
      toast.error("Asset name is required");
      return;
    }
    if (!description) {
      toast.error("Asset description is required");
      return;
    }
    if (!price) {
      toast.error("Asset price is required");
      return;
    }
    if (!fileUrl) {
      toast.error("Asset image is required");
      return;
    }
    let url = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    setTransactionStatus("Uploading Metadata...");
    try {
      const upload = await pinata.upload.json({
        name,
        description,
        image: fileUrl,
      });

      if (!upload || !upload.IpfsHash) {
        throw new Error("Invalid JSON upload response from Pinata");
      }
      //   url = "https://" + url + "/ipfs/" + upload;
      url = `https://${url}/ipfs/${upload.IpfsHash}`;
      console.log(url);
      await createSale(url);
    } catch (error) {
      console.log(error);
    }
  }

  async function createSale(url) {
    setTransactionStatus("Creating NFT...");
    setIsModalOpen(true);
    setTransactionHash(null);
    try {
      const { request: createTokenResult, result: tokenId } =
        await simulateContract(config, {
          abi: NFT.abi,
          address: nftAddress,
          functionName: "createToken",
          args: [url],
        });

      const txHash = await writeContract(config, createTokenResult);
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });

      console.log("createTokenReceipt", transactionReceipt);

      const price = ethers.parseUnits(formInput.price, "ether");

      const listingPrice = await readContract(config, {
        abi: Market.abi,
        address: nftMarketAddress,
        functionName: "getListingPrice",
      });
      setTransactionStatus("Listing NFT...");

      const { request: createMarketItenResult } = await simulateContract(
        config,
        {
          abi: Market.abi,
          address: nftMarketAddress,
          functionName: "createMarketItem",
          args: [nftAddress, tokenId, price],
          value: listingPrice.toString(),
        }
      );

      const txHash1 = await writeContract(config, createMarketItenResult);

      const transactionReceipt1 = await waitForTransactionReceipt(config, {
        hash: txHash1,
      });
      setTransactionStatus("Transaction successful!");
      setTransactionHash(txHash);
      console.log("show11", transactionReceipt1);
      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="dark"
      />
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
      <div className=" relative flex justify-center items-center min-h-screen">
        <video
          src="/upload-bg.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 filter blur-sm"
          muted
          loop
          autoPlay
        ></video>
        <div className="w-1/2 flex flex-col pb-12 relative gap-10">
          <input
            placeholder="Asset Name"
            className="mt-8  bg-black/50 rounded p-4 text-white border-2 border-black/50 focus:border-green-500 focus:outline-none"
            name="name"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2  rounded p-4 text-white bg-black/50 border-2 border-black/50 focus:outline-none focus:border-green-500 "
            name="description"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in Matic"
            className="mt-2  rounded p-4 text-white bg-black/50 focus:border-green-500 border-2 border-black/50 focus:outline-none"
            name="price"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          {/* <input type="file" name="Asset" className="my-4 " onChange={onChange} />
        {fileUrl && (
          <img className="rounded mt-4 bg-black/50" width="350" src={fileUrl} />
        )} */}
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            // onImageBase64={onChange}
            onImageUrl={handleImageUrl}
          />
          {!isConnected ? (
            <div className="flex justify-center">
              <CustomConnectButton />
            </div>
          ) : (
            <button
              onClick={uploadItem}
              className=" flex justify-center gap-4 font-bold mt-4 bg-gradient-to-r from-yellow-500 to-[#39FF14] text-white rounded p-4 shadow-lg"
              value="create-nft"
            >
              Create Digital Asset
              <CloudUpload />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

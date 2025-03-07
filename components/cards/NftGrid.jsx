import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

const NftGrid = ({ nftPath, nftName, nftPrice, nft, index }) => {
  const router = useRouter();

  return (
    <motion.div
      className="card nft-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.2 }} // Staggered animation
    >
      <img src={nftPath} alt={nftName} />
      {nft ? (
        <div
          className="btn btn-hover text-black"
          onClick={() => router.push(`/nft/${nft.tokenId}`)}
        >
          View NFT
        </div>
      ) : (
        <button className="btn btn-hover">View NFT</button>
      )}
      <div className="nft-grid-info py-4">
        <h1>{nftName}</h1>
        <div className="nft-grid-other-infos">
          <div className="other-info">
            <span>Price - {nftPrice}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NftGrid;

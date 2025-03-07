import React from "react";
import { Image, Search, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HowItWorks = () => {
  const steps = [
    {
      id: "step-1",
      icon: <Image size={30} />,
      title: "Unleash Your Creativity",
      description:
        "Upload your masterpiece and set the stage for its digital transformation. Customize the details, and prepare your art for its NFT journey.",
    },
    {
      id: "step-2",
      icon: <Send />,
      title: "Mint Your Masterpiece",
      description:
        "Transform your uploaded artwork into a unique, blockchain-secured NFT, solidifying your ownership and ensuring its exclusivity.",
    },
    {
      id: "step-3",
      icon: <Search />,
      title: "Explore & Showcase",
      description:
        "Discover a world of digital art. Display your NFTs, explore creations by other artists, and build your unique collection on our platform.",
    },
  ];

  return (
    <div className="row mt-10 md:mt-20 home-how-to min-w-screen px-4 md:px-0">
      <div className="section-header col-12">
        <div className="section-heading mb-10 md:mb-20">How It Works</div>
      </div>
      {steps.map((step, index) => {
        // Dynamic animation: Steps 1 & 3 slide from left, Step 2 slides from right
        const fadeInVariants = {
          hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 2, ease: "easeOut" },
          },
        };

        return (
          <motion.div
            key={step.id}
            className={`col-lg-7 col-md-6 step w-full md:w-[60%] ${
              index % 2 !== 0 ? "md:ml-auto" : ""
            } mb-8 md:mb-0`}
            id={step.id}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% in view
          >
            <div className="step-icon">{index + 1}</div>
            <div className="flex items-center gap-2">
              <div className="step-title flex gap-2">{step.title}</div>
              {step.icon}
            </div>
            <p className="mt-2">{step.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HowItWorks;

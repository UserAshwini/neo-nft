require("@nomicfoundation/hardhat-toolbox");
require ("dotenv/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // hardhat: {
    //   forking: {
    //     url: process.env.POLYGON_AMOY_PUBLIC_URL!,
    //   },
    // },
    amoy: {
      url: process.env.POLYGON_AMOY_PUBLIC_URL,
      // accounts: [`⁠ 0x${process.env.PVT_KEY} `],
      accounts: [process.env.PVT_KEY],
      gasPrice: 35000000000,
    },
  },
};

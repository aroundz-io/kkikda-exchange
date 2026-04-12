require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: { chainId: 31337 },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      accounts: [PRIVATE_KEY],
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  },
};

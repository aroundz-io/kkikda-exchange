const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy KKD Token
  console.log("\n--- Deploying KKD Token ---");
  const KKDToken = await hre.ethers.getContractFactory("KKDToken");
  const kkdToken = await KKDToken.deploy();
  await kkdToken.waitForDeployment();
  const kkdAddress = await kkdToken.getAddress();
  console.log("KKD Token deployed to:", kkdAddress);

  // 2. Deploy RWA Tokens
  console.log("\n--- Deploying RWA Tokens ---");
  const RWAToken = await hre.ethers.getContractFactory("RWAToken");

  const puerToken = await RWAToken.deploy("Vintage Pu'er 2005", "PUER", hre.ethers.parseEther("100000"));
  await puerToken.waitForDeployment();
  const puerAddress = await puerToken.getAddress();
  console.log("PUER Token deployed to:", puerAddress);

  const agedToken = await RWAToken.deploy("Imperial Aged Tea", "AGED", hre.ethers.parseEther("10000"));
  await agedToken.waitForDeployment();
  const agedAddress = await agedToken.getAddress();
  console.log("AGED Token deployed to:", agedAddress);

  const ceraToken = await RWAToken.deploy("Yixing Ceramics Token", "CERA", hre.ethers.parseEther("500000"));
  await ceraToken.waitForDeployment();
  const ceraAddress = await ceraToken.getAddress();
  console.log("CERA Token deployed to:", ceraAddress);

  // 3. Deploy NFT Collection
  console.log("\n--- Deploying KKIKDA NFT ---");
  const KKIKDANft = await hre.ethers.getContractFactory("KKIKDANft");
  const nft = await KKIKDANft.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("KKIKDA NFT deployed to:", nftAddress);

  // 4. Deploy Marketplace
  console.log("\n--- Deploying Marketplace ---");
  const Marketplace = await hre.ethers.getContractFactory("KKIKDAMarketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  // 5. Deploy Staking
  console.log("\n--- Deploying Staking ---");
  const Staking = await hre.ethers.getContractFactory("KKIKDAStaking");
  const staking = await Staking.deploy(kkdAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking deployed to:", stakingAddress);

  // Summary
  console.log("\n========================================");
  console.log("         DEPLOYMENT COMPLETE            ");
  console.log("========================================");
  console.log(`KKD Token:     ${kkdAddress}`);
  console.log(`PUER Token:    ${puerAddress}`);
  console.log(`AGED Token:    ${agedAddress}`);
  console.log(`CERA Token:    ${ceraAddress}`);
  console.log(`KKIKDA NFT:    ${nftAddress}`);
  console.log(`Marketplace:   ${marketplaceAddress}`);
  console.log(`Staking:       ${stakingAddress}`);
  console.log("========================================");
  console.log("\nUpdate these addresses in src/lib/web3/contracts.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("Deploying ProductRegistry...");

  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();
  await productRegistry.waitForDeployment();

  const address = await productRegistry.getAddress();
  console.log("ProductRegistry deployed to:", address);

  // Log for .env.local update
  console.log("\nAdd to .env.local:");
  console.log(`PRODUCT_REGISTRY_CONTRACT=${address}`);

  // Log verification command for Etherscan
  console.log("\nTo verify on Etherscan, run:");
  console.log(`npx hardhat verify --network sepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

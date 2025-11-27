import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("Deploying Lock contract to", hre.network.name, "...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Set unlock time to 1 year from now
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // Lock 0.001 ETH (small amount for demo)
  const lockedAmount = ethers.parseEther("0.001");

  console.log("Deployment parameters:");
  console.log("  - Unlock time:", unlockTime);
  console.log("  - Unlock date:", new Date(unlockTime * 1000).toISOString());
  console.log("  - Locked amount:", ethers.formatEther(lockedAmount), "ETH\n");

  // Deploy contract
  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // Wait for deployment
  await lock.waitForDeployment();

  const address = await lock.getAddress();
  const deployTx = lock.deploymentTransaction();

  console.log("Deployment successful!");
  console.log("  - Contract address:", address);
  console.log("  - Transaction hash:", deployTx?.hash);
  console.log("\nTo verify on Etherscan, run:");
  console.log(`  npx hardhat verify --network ${hre.network.name} ${address} ${unlockTime}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

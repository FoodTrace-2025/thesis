import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("PRIVATE_KEY not found in .env.local");
  process.exit(1);
}

// Derive address from private key
import { privateKeyToAccount } from "viem/accounts";
const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

async function main() {
  const balance = await client.getBalance({ address: account.address });

  console.log("Network: Sepolia");
  console.log("Address:", account.address);
  console.log("Balance:", formatEther(balance), "ETH");

  const needed = BigInt("1100000000000000"); // ~0.0011 ETH for deployment
  if (balance < needed) {
    console.log("\nWARNING: Insufficient balance for deployment!");
    console.log("Need at least 0.0011 ETH (0.001 lock + gas)");
    console.log("Get Sepolia ETH from: https://sepoliafaucet.com/");
  } else {
    console.log("\nSufficient balance for deployment!");
  }
}

main().catch(console.error);

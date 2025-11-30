/**
 * Full Integration Test: Product Registration API (Story 5.3)
 *
 * This script performs a complete end-to-end test:
 * 1. Authenticates as PRODUCER user
 * 2. Calls POST /api/products/register
 * 3. Verifies the response and blockchain transaction
 *
 * Prerequisites:
 * - npm run dev (server running on localhost:3000)
 * - Run test-product-registration.ts first to set up test data
 *
 * Usage:
 * npx tsx scripts/test-product-registration-full.ts
 */

import { config } from "dotenv";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

// Load environment variables
config({ path: ".env.local" });

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const TEST_USER_EMAIL = "producer@producer.farm";
const TEST_USER_PASSWORD = "producer123";

// Viem client for blockchain verification
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

interface CsrfResponse {
  csrfToken: string;
}

interface ProductResponse {
  success: boolean;
  product?: {
    id: string;
    blockchainId: number;
    name: string;
    origin: string;
    harvestDate: string;
    transactionHash: string;
    qrCodeUrl: string;
  };
  error?: string;
  code?: string;
}

async function main() {
  console.log("=== Story 5.3: Full Integration Test ===\n");

  // Step 1: Get CSRF token
  console.log("Step 1: Getting CSRF token...");
  const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);

  if (!csrfResponse.ok) {
    console.error("❌ Failed to get CSRF token. Is the server running?");
    console.error(`   Status: ${csrfResponse.status}`);
    console.error("   Make sure to run: npm run dev");
    process.exit(1);
  }

  const csrfData = (await csrfResponse.json()) as CsrfResponse;
  const csrfToken = csrfData.csrfToken;
  console.log(`   ✅ CSRF token obtained`);

  // Extract cookies from CSRF response
  const csrfCookies = csrfResponse.headers.get("set-cookie") || "";

  // Step 2: Login as PRODUCER user
  console.log("\nStep 2: Authenticating as PRODUCER user...");
  const loginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies,
    },
    body: new URLSearchParams({
      csrfToken,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      json: "true",
    }),
    redirect: "manual", // Don't follow redirects
  });

  // Get all set-cookie headers (NextAuth sets multiple cookies)
  const setCookieHeaders =
    loginResponse.headers.getSetCookie?.() ||
    ([loginResponse.headers.get("set-cookie")].filter(Boolean) as string[]);

  // Parse cookies into name=value pairs
  const cookieJar: Record<string, string> = {};

  // Parse CSRF cookies first
  if (csrfCookies) {
    csrfCookies.split(",").forEach((cookie) => {
      const match = cookie.trim().match(/^([^=]+)=([^;]*)/);
      if (match) {
        cookieJar[match[1]] = match[2];
      }
    });
  }

  // Parse session cookies (override any duplicates)
  setCookieHeaders.forEach((cookie) => {
    if (cookie) {
      const match = cookie.match(/^([^=]+)=([^;]*)/);
      if (match) {
        cookieJar[match[1]] = match[2];
      }
    }
  });

  const hasSessionToken = Object.keys(cookieJar).some((name) => name.includes("session-token"));

  if (!hasSessionToken) {
    console.error("❌ Login failed. No session token received.");
    console.error(`   Status: ${loginResponse.status}`);
    console.error(`   User: ${TEST_USER_EMAIL}`);
    console.error(`   Cookies received: ${Object.keys(cookieJar).join(", ")}`);
    console.error("   Make sure the PRODUCER user exists (run test-product-registration.ts first)");
    process.exit(1);
  }

  console.log(`   ✅ Authenticated as ${TEST_USER_EMAIL}`);

  // Combine all cookies into a single cookie header
  const allCookies = Object.entries(cookieJar)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  // Step 3: Call product registration API
  console.log("\nStep 3: Calling POST /api/products/register...");
  const productData = {
    name: "Integration Test Milk",
    origin: "Automated Test Farm",
    harvestDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  };

  console.log(`   Request body:`, JSON.stringify(productData, null, 2));

  const startTime = Date.now();
  const registerResponse = await fetch(`${BASE_URL}/api/products/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: allCookies,
    },
    body: JSON.stringify(productData),
  });

  const duration = Date.now() - startTime;
  const result = (await registerResponse.json()) as ProductResponse;

  console.log(`   Response (${duration}ms):`);
  console.log(`   Status: ${registerResponse.status}`);
  console.log(`   Body:`, JSON.stringify(result, null, 2));

  if (!registerResponse.ok || !result.success) {
    console.error("\n❌ Product registration failed");
    console.error(`   Error: ${result.error}`);
    console.error(`   Code: ${result.code}`);
    process.exit(1);
  }

  // Step 4: Verify blockchain transaction
  console.log("\nStep 4: Verifying blockchain transaction...");
  const txHash = result.product!.transactionHash as `0x${string}`;

  const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

  if (receipt.status === "success") {
    console.log(`   ✅ Transaction confirmed on Sepolia`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed}`);
  } else {
    console.error("❌ Transaction failed on blockchain");
    process.exit(1);
  }

  // Step 5: Print summary
  console.log("\n=== Test Results ===\n");
  console.log("✅ ALL TESTS PASSED\n");
  console.log("Product Created:");
  console.log(`  Database ID: ${result.product!.id}`);
  console.log(`  Blockchain ID: ${result.product!.blockchainId}`);
  console.log(`  Name: ${result.product!.name}`);
  console.log(`  Origin: ${result.product!.origin}`);
  console.log(`  Harvest Date: ${result.product!.harvestDate}`);
  console.log(`  TX Hash: ${result.product!.transactionHash}`);
  console.log(`  QR Code URL: ${result.product!.qrCodeUrl}`);
  console.log("");
  console.log("View on Etherscan:");
  console.log(`  https://sepolia.etherscan.io/tx/${txHash}`);
  console.log("");
  console.log(`Duration: ${duration}ms (includes blockchain confirmation)`);
}

main().catch((error) => {
  console.error("Test failed:", error.message);
  process.exit(1);
});

/**
 * Test Script: Product Registration API (Story 5.3)
 *
 * This script tests the POST /api/products/register endpoint by:
 * 1. Checking/creating a PRODUCER user
 * 2. Funding the test wallet with Sepolia ETH (if needed)
 * 3. Making the API call
 *
 * Prerequisites:
 * - npm run dev (server running on localhost:3000)
 * - .env.local configured with DATABASE_URL, PRIVATE_KEY, SEPOLIA_RPC_URL
 *
 * Usage:
 * npx tsx scripts/test-product-registration.ts
 */

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
} from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import bcrypt from 'bcrypt';

// Load environment variables
config({ path: '.env.local' });

// Create Prisma client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Viem clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

const deployerAccount = privateKeyToAccount(
  process.env.PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account: deployerAccount,
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

// Test configuration
const TEST_COMPANY_ID = 'test-producer-001';
const TEST_USER_EMAIL = 'producer@producer.farm';
const TEST_USER_PASSWORD = 'producer123';
const MIN_ETH_BALANCE = parseEther('0.01'); // Minimum ETH needed for testing

async function main() {
  console.log('=== Story 5.3: Product Registration API Test ===\n');

  // Step 1: Check test company exists
  console.log('Step 1: Checking test company...');
  const company = await prisma.company.findUnique({
    where: { id: TEST_COMPANY_ID },
    select: {
      id: true,
      name: true,
      status: true,
      type: true,
      walletAddress: true,
      encryptedPrivateKey: true,
    },
  });

  if (!company) {
    console.error('❌ Test company not found: ' + TEST_COMPANY_ID);
    console.error(
      '   Run the approve API test first to create the test company.'
    );
    console.error(
      '   Or manually create via POST /api/admin/companies + approve'
    );
    process.exit(1);
  }

  console.log(`✅ Company found: ${company.name}`);
  console.log(`   Status: ${company.status}`);
  console.log(`   Type: ${company.type}`);
  console.log(`   Wallet: ${company.walletAddress}`);

  if (company.status !== 'APPROVED') {
    console.error('❌ Company is not APPROVED. Cannot test.');
    process.exit(1);
  }

  if (!company.walletAddress) {
    console.error('❌ Company has no wallet. Cannot test.');
    process.exit(1);
  }

  // Step 2: Check/fund wallet balance
  console.log('\nStep 2: Checking wallet balance...');
  const balance = await publicClient.getBalance({
    address: company.walletAddress as `0x${string}`,
  });

  console.log(`   Current balance: ${formatEther(balance)} ETH`);

  if (balance < MIN_ETH_BALANCE) {
    console.log(`   ⚠️  Balance too low. Funding from deployer...`);

    const fundAmount = parseEther('0.05'); // Send 0.05 ETH

    // Check deployer balance
    const deployerBalance = await publicClient.getBalance({
      address: deployerAccount.address,
    });
    console.log(`   Deployer balance: ${formatEther(deployerBalance)} ETH`);

    if (deployerBalance < fundAmount) {
      console.error('❌ Deployer has insufficient funds.');
      console.error('   Get Sepolia ETH from: https://sepoliafaucet.com/');
      process.exit(1);
    }

    // Send ETH to company wallet
    const txHash = await walletClient.sendTransaction({
      to: company.walletAddress as `0x${string}`,
      value: fundAmount,
    });

    console.log(`   TX sent: ${txHash}`);
    console.log(`   Waiting for confirmation...`);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
    });

    if (receipt.status === 'success') {
      console.log(`   ✅ Funded ${formatEther(fundAmount)} ETH`);
    } else {
      console.error('❌ Funding transaction failed');
      process.exit(1);
    }

    // Re-check balance
    const newBalance = await publicClient.getBalance({
      address: company.walletAddress as `0x${string}`,
    });
    console.log(`   New balance: ${formatEther(newBalance)} ETH`);
  } else {
    console.log(`   ✅ Wallet has sufficient ETH`);
  }

  // Step 3: Check/create PRODUCER user
  console.log('\nStep 3: Checking PRODUCER user...');
  let user = await prisma.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (!user) {
    console.log(`   Creating PRODUCER user: ${TEST_USER_EMAIL}`);
    const passwordHash = await bcrypt.hash(TEST_USER_PASSWORD, 10);

    user = await prisma.user.create({
      data: {
        email: TEST_USER_EMAIL,
        passwordHash,
        name: 'Test Producer',
        role: 'PRODUCER',
        companyId: company.id,
      },
    });
    console.log(`   ✅ User created`);
  } else {
    console.log(`   ✅ User exists: ${user.email}`);

    // Verify user is linked to correct company
    if (user.companyId !== company.id) {
      console.error('❌ User is linked to different company!');
      process.exit(1);
    }

    if (user.role !== 'PRODUCER') {
      console.error('❌ User does not have PRODUCER role!');
      process.exit(1);
    }
  }

  // Step 4: Print test instructions
  console.log('\n=== Test Setup Complete ===\n');
  console.log('To test the API, you need to:');
  console.log('');
  console.log('1. Start the dev server (if not running):');
  console.log('   npm run dev');
  console.log('');
  console.log('2. Get a session token by logging in:');
  console.log(`   Email: ${TEST_USER_EMAIL}`);
  console.log(`   Password: ${TEST_USER_PASSWORD}`);
  console.log('');
  console.log('3. Test via curl (after getting session cookie):');
  console.log(`   curl -X POST http://localhost:3000/api/products/register \\
     -H "Content-Type: application/json" \\
     -H "Cookie: next-auth.session-token=<YOUR_SESSION_TOKEN>" \\
     -d '{
       "name": "Test Organic Milk",
       "origin": "Oulu Farm",
       "harvestDate": "${new Date(Date.now() - 86400000).toISOString()}"
     }'`);
  console.log('');
  console.log('Expected response:');
  console.log(`{
  "success": true,
  "product": {
    "id": "...",
    "blockchainId": 1,
    "name": "Test Organic Milk",
    "origin": "Oulu Farm",
    "harvestDate": "...",
    "transactionHash": "0x...",
    "qrCodeUrl": "http://localhost:3000/trace/1"
  }
}`);
  console.log('');
  console.log('---');
  console.log('Company Wallet:', company.walletAddress);
  console.log(
    'View on Etherscan:',
    `https://sepolia.etherscan.io/address/${company.walletAddress}`
  );
}

main()
  .catch((error) => {
    console.error('Test setup failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

// Database Seed Script
// Story 2.5: Admin Authentication
// Creates initial PLATFORM_ADMIN user for testing

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma client with PostgreSQL adapter (required for Prisma 7)
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Hash password with bcrypt (10 rounds as per story spec)
  const passwordHash = await bcrypt.hash('admin123', 10);

  // Create or update PLATFORM_ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodtrace.app' },
    update: { passwordHash },
    create: {
      email: 'admin@foodtrace.app',
      passwordHash,
      name: 'Platform Admin',
      role: 'PLATFORM_ADMIN',
      companyId: null, // PLATFORM_ADMIN has no company
    },
  });

  console.log('---');
  console.log('Admin user:');
  console.log(`  Email: ${admin.email}`);
  console.log('  Password: admin123');
  console.log(`  Role: ${admin.role}`);

  // Create test users for DISTRIBUTOR and RETAILER roles
  // (Story 5.4: Required for testing role-based dashboards)
  // Uses existing companies if they exist, otherwise creates new ones
  const testRoles = [
    { domain: 'distributor.test', type: 'DISTRIBUTOR' as const, fallbackName: 'Test Distributor Co' },
    { domain: 'cityretail.test', type: 'RETAILER' as const, fallbackName: 'Test Retail Store' },
  ];

  console.log('---');
  console.log('Test users for role-based dashboards:');

  for (const roleData of testRoles) {
    // Find existing company by domain or create new one
    let company = await prisma.company.findFirst({
      where: { domain: roleData.domain },
    });

    if (!company) {
      // Create new company if none exists with this domain
      company = await prisma.company.create({
        data: {
          name: roleData.fallbackName,
          email: `contact@${roleData.domain}`,
          domain: roleData.domain,
          type: roleData.type,
          status: 'APPROVED',
        },
      });
      console.log(`  Created company: ${company.name}`);
    }

    // Create or update test user with role matching company type
    const user = await prisma.user.upsert({
      where: { email: `test@${roleData.domain}` },
      update: { passwordHash },
      create: {
        email: `test@${roleData.domain}`,
        passwordHash,
        name: `Test ${roleData.type}`,
        role: roleData.type,
        companyId: company.id,
      },
    });

    console.log(`  ${user.role}: test@${roleData.domain} / admin123`);
  }

  console.log('---');
  console.log('Seed complete!');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

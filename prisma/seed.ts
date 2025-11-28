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
    where: { email: 'admin@foodtrace.local' },
    update: { passwordHash },
    create: {
      email: 'admin@foodtrace.local',
      passwordHash,
      name: 'Platform Admin',
      role: 'PLATFORM_ADMIN',
      companyId: null, // PLATFORM_ADMIN has no company
    },
  });

  console.log('Seed complete!');
  console.log('---');
  console.log('Admin user created:');
  console.log(`  Email: ${admin.email}`);
  console.log('  Password: admin123');
  console.log(`  Role: ${admin.role}`);
  console.log('---');
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

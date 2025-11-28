// Prisma configuration for FoodTrace
// Uses .env.local for environment variables
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local instead of default .env
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
    // Note: directUrl removed in Prisma 7 - CLI auto-handles direct connections for migrations
  },
});

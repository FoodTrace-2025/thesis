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
  },
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"), // Direct connection for migrations (bypasses pgBouncer)
  },
});

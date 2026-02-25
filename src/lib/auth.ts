import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/example-db-interaction"; // your drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql", // or "mysql", "sqlite"
  }),
});

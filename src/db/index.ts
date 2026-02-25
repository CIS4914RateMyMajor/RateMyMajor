import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in your environment variables");
}

// Now TS knows connectionString is definitely a string
export const db = drizzle(connectionString);
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // This tells Drizzle to look for any .ts file inside the schema folder
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

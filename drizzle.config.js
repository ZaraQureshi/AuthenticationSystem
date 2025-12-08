import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({
    path: ".env",
});
const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL);
export default defineConfig({
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    dialect: "postgresql"
});
//# sourceMappingURL=drizzle.config.js.map
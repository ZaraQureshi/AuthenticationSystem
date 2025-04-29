import { defineConfig } from 'drizzle-kit';
import { PgSchema } from 'drizzle-orm/pg-core';
import dotenv from 'dotenv';

export default ({
    schema: './drizzle/schema.ts',
    out: './drizzle/migrations',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,

    },
    dialect: "postgresql"
})
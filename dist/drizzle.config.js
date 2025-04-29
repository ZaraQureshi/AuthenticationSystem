export default ({
    schema: './drizzle/schema.ts',
    out: './drizzle/migrations',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
    dialect: "postgresql"
});

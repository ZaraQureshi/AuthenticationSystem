// test-server.ts
import { MongoClient } from "mongodb";
import { createAuthService } from "./src/index.ts";
import { Pool } from "pg";

async function main() {
  // 1. Connect DB
  //   export const connectDB = new Pool({
    //   connectionString: process.env.SUPABASE_DB_URL,
//   ssl: {
  //     rejectUnauthorized: false, // REQUIRED for Supabase
//   },
// });
  const client = new Pool({
    connectionString: "postgresql://postgres.asedatqmopzagndfssba:Auth@Dec2025@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Supabase
  }});
  // await client.connect();
  // const db = client.db("PTHEALTHCARE");
  
  // 2. Create auth service
  // const auth = await createAuthService({
    //   dbType: "mongo",
    //   db: db,
    //   accessSecret: "access-secret",
    //   refreshSecret: "refresh-secret"
    // });
    const db=await client;
     const auth = await createAuthService({
    dbType: "postgres",
    db: db,
    accessSecret: process.env.ACCESS_SECRET!,
    refreshSecret: process.env.REFRESH_SECRET!
    });
  // 3. Call methods directly
  const registerResult = await auth.register({
    username: "zara",
    email: "zara@test.com",
    password: "123456"
  });

  console.log("REGISTER:", registerResult);

  const loginResult = await auth.login({
    email: "zara@test.com",
    password: "123456"
  });

  console.log("LOGIN:", loginResult);
}

main().catch(console.error);

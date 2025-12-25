// test-server.ts
import { MongoClient } from "mongodb";
import { createAuthService } from "./src/index";

async function main() {
  // 1. Connect DB
  const client = new MongoClient("mongodb://localhost:27017/PTHEALTHCARE");
  await client.connect();
  const db = client.db("PTHEALTHCARE");

  // 2. Create auth service
  const auth = await createAuthService({
    dbType: "mongo",
    db: db,
    accessSecret: "access-secret",
    refreshSecret: "refresh-secret"
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

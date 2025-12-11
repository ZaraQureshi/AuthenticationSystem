import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createAuthApp } from "./src/index.ts"; // your main export
import { createSchema } from "./src/db.ts";     // your DB initializer

async function main() {
  // Create DB connection normally
  const { db } = await createSchema({
    DB_TYPE: "mongo",
    DATABASE_URL: process.env.DATABASE_URL,
  });

  const auth = await createAuthApp({
    DB_TYPE: "mongo",
    existingConnection: db,
  });

  const app = new Hono();
  app.route("/auth", auth.getAllUsers());

  console.log("Auth server running → http://localhost:3000/auth");
  serve({ fetch: app.fetch, port: 3000 });
}

main();




```md
# @zaraqdev/auth-service

## Introduction
@zaraqdev/auth-service is a framework-agnostic authentication library for Node.js.
The idea is to install an npm package, that will expose a method which will accept the connection object and a database type.
The npm package will do the rest of the authentication stuff with just an api call.

It provides secure user authentication with JWT and account locking without requiring a separate auth server.

---

## Tech Stack
- TypeScript
- Node.js
- JWT (Access & Refresh Tokens)
- PostgreSQL (Kysely)
- MongoDB (Mongoose)
- tsyringe (Dependency Injection)
- bcrypt

---

## Methods

### createAuthService(config)
Initializes the authentication service.

### auth.register(data)
Registers a new user.
**Input**
{
  username: string;
  email: string;
  password: string;
}

### auth.login(data)
Authenticates a user.
**Input**
{
  email: string;
  password: string;
}
**Returns**
{
 accessToken,
 refreshToken
}

### auth.forgotPassword(token)
Sends email to registered user with the password reset token
**Input**
{
  email: string;
}
**Returns**
{
 message: "If you have registered, you will recieve an email with the reset token"
}

### auth.resetPassword(token,password)
reset the user password
**Input**
{
  resetToken:string;
  password:string;
}
**Returns**
{
 message: "Updated successfully"
}

### auth.sentEmailVerification(email)
Sends email to registered user with the email verification token
**Input**
{
  username: string;
  email: string;
  password: string;
}
**Returns**
{
 message: "If you have registered, you will recieve an email with the reset token"
}

### auth.verifyEmail(emailToken)
verify the user email
**Input**
{
  emailToken:string;
}
**Returns**
{
 message: "Email verified"
}

### auth.refreshToken(token)
Generates a new access token.

### auth.logout(email, token)
Logs out the user.

---
##Configuration Example
const auth = await createAuthService({
  dbType: "postgres",
  db,
  accessSecret: "...",
  refreshSecret: "...",
  security: {
    accountLock: {
      maxAttempts: 5,
      lockDurationMin: 20
    }
  }
});

---
## Usage Example

Postgres example

**Connection to auth:**
import { createAuthService } from "@zaraqdev/auth-service";
import { connectDB } from "./db";
import dotenv from 'dotenv';
dotenv.config();
 
const db= await connectDB();
export const auth = await createAuthService({
  dbType: "postgres",
  db:db,
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!
});

**Connection to db:**
import { Pool } from "pg";
export function connectDB() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // REQUIRED for Supabase
    },
  });
}

MongoDB
**Connection to auth:**
import { connectDB } from "./lib/db.server";
const { createAuthService } = await import("@zaraqdev/auth-service");
const mongooseInstance = await connectDB();


export const auth = await createAuthService({
  dbType: "mongo",
  db: mongooseInstance?.connection.getClient().db("dbname"),
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!
});

**Usage**
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { auth } from "./auth";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
    try {
        const user = await auth.register(req.body);
        return res.status(201).json(user);
    } catch (e: any) {
        return res.status(400).json({ error: e.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const tokens = await auth.login(req.body);
        res.json(tokens);
    } catch (e: any) {
        res.status(401).json({ error: e.message });
    }
});

---
##Contributions
We welcome contributions from the community to improve auth-service.


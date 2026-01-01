<h1>@zaraqdev/auth-service</h1>

<h2>Introduction</h2>
<p>
  <strong>@zaraqdev/auth-service</strong> is a framework-agnostic authentication
  library for Node.js. The idea is to install an npm package that exposes a single
  method accepting a database connection and database type. The package then
  handles all authentication logic internally through simple API calls.
</p>

<p>
  It provides secure user authentication using JWT and account locking without
  requiring a separate authentication server.
</p>

<hr />

<h2>Tech Stack</h2>
<ul>
  <li>TypeScript</li>
  <li>Node.js</li>
  <li>JWT (Access &amp; Refresh Tokens)</li>
  <li>PostgreSQL (Kysely)</li>
  <li>MongoDB (Mongoose)</li>
  <li>tsyringe (Dependency Injection)</li>
  <li>bcrypt</li>
</ul>

<hr />

<h2>Methods</h2>

<h3>createAuthService(config)</h3>
<p>Initializes the authentication service.</p>

<h3>auth.register(data)</h3>
<p>Registers a new user.</p>
<pre><code>{
  username: string;
  email: string;
  password: string;
}</code></pre>

<h3>auth.login(data)</h3>
<p>Authenticates a user.</p>
<pre><code>{
  email: string;
  password: string;
}</code></pre>
<p><strong>Returns</strong></p>
<pre><code>{
  accessToken: string;
  refreshToken: string;
}</code></pre>

<h3>auth.forgotPassword(data)</h3>
<p>Sends a password reset token to the registered email.</p>
<pre><code>{
  email: string;
}</code></pre>
<p><strong>Returns</strong></p>
<pre><code>{
  message: string;
}</code></pre>

<h3>auth.resetPassword(data)</h3>
<p>Resets the user password using a reset token.</p>
<pre><code>{
  resetToken: string;
  password: string;
}</code></pre>
<p><strong>Returns</strong></p>
<pre><code>{
  message: "Updated successfully";
}</code></pre>

<h3>auth.sendEmailVerification(email)</h3>
<p>Sends an email verification token.</p>
<pre><code>{
  email: string;
}</code></pre>

<h3>auth.verifyEmail(data)</h3>
<p>Verifies the user's email.</p>
<pre><code>{
  emailToken: string;
}</code></pre>
<p><strong>Returns</strong></p>
<pre><code>{
  message: "Email verified";
}</code></pre>

<h3>auth.refreshToken(token)</h3>
<p>Generates a new access token using a refresh token.</p>

<h3>auth.logout(email, token)</h3>
<p>Logs out the user and invalidates the session.</p>

<hr />

<h2>Configuration Example</h2>
<pre><code>const auth = await createAuthService({
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
});</code></pre>

<hr />

<h2>Usage Example</h2>

<h3>PostgreSQL</h3>

<p><strong>Auth Setup</strong></p>
<pre><code>import { createAuthService } from "@zaraqdev/auth-service";
import { connectDB } from "./db";
import dotenv from "dotenv";

dotenv.config();

const db = await connectDB();

export const auth = await createAuthService({
  dbType: "postgres",
  db,
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!
});</code></pre>

<p><strong>Database Connection</strong></p>
<pre><code>import { Pool } from "pg";

export function connectDB() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}</code></pre>

<h3>MongoDB</h3>
<pre><code>import { connectDB } from "./lib/db.server";
import { createAuthService } from "@zaraqdev/auth-service";

const mongooseInstance = await connectDB();

export const auth = await createAuthService({
  dbType: "mongo",
  db: mongooseInstance.connection.getClient().db("dbname"),
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!
});</code></pre>

<h3>Express Usage</h3>
<pre><code>import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { auth } from "./auth";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const user = await auth.register(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const tokens = await auth.login(req.body);
    res.json(tokens);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});</code></pre>

<hr />

<h2>Contributions</h2>
<p>
  Contributions are welcome! Feel free to open issues or submit pull requests to
  improve <strong>@zaraqdev/auth-service</strong>.
</p>

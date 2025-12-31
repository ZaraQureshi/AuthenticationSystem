


```md
# @zaraqdev/auth-service

## Introduction
@zaraqdev/auth-service is a framework-agnostic authentication library for Node.js.
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
```ts
{
  username: string;
  email: string;
  password: string;
}

### auth.login(data)
Authenticates a user.
**Input**
```ts
{
  email: string;
  password: string;
}
**Returns**
```ts
{
 accessToken,
 refreshToken
}

### auth.forgotPassword(token)
Sends email to registered user with the password reset token
**Input**
```ts
{
  email: string;
}
**Returns**
```ts
{
 message: "If you have registered, you will recieve an email with the reset token"
}

### auth.resetPassword(token,password)
Sends email to registered user with the password reset token
**Input**
```ts
{
  resetToken:string;
  password:string;
}
**Returns**
```ts
{
 message: "Updated successfully"
}

### auth.refreshToken(token)
Generates a new access token.

### auth.logout(token)
Logs out the user.

---

## Usage Example

```ts
import { createAuthService } from "@zaraqdev/auth-service";

const auth = await createAuthService({
  dbType: "postgres",
  db,
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!
});

This is an experimental auth package made using Hono.
The idea is to install an npm package, that will expose a method which will accept the connection object (if it already exists) and a database type.
The npm package will do the rest of the authentication stuff with just an api call.


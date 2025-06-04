import { z } from "zod";
import { createSchema} from "./db"
import { users } from "./drizzle/schema";
import { and, eq } from "drizzle-orm";
import { refreshToken } from "./contoller";
import {Pool as PgPool} from 'pg';
import { drizzle } from "drizzle-orm/node-postgres";
import { pgSchema } from "drizzle-orm/pg-core";
import { create } from "domain";



export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const logoutSchema = z.object({
  userId: z.number(),
  refreshToken: z.string(),
});

export const purgeExpiredTokensSchema = z.object({
  secret: z.string().min(16),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  userId: z.number(),
  mode: z.string().max(5)
});
export const getUserByEmail = async (email: any) => {
  const db = await createSchema();

  return await db.select().from(users).where(eq(users.email, email));
}

export const getUserByEmailAndId = async (email: string, id: number) => {
  const db = await createSchema();

  return await db.select().from(users).where(and(eq(users.email, email), eq(users.email, email)));
}

export const getUserById = async (id: any) => {
  const db = await createSchema();

  return await db.select().from(users).where(eq(users.id, id));
}

// get jwt expiry time as date from the actual string token
export const getExpiryFromToken = (token: string) => {
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  return new Date(decodedPayload.exp * 1000).toISOString();
}



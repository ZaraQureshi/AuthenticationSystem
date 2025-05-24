import { z } from "zod";
import { db } from "./db"
import { users } from "./drizzle/schema";
import { and, eq } from "drizzle-orm";
import { refreshToken } from "./contoller";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const logoutSchema = z.object({
  userId: z.number(),
  refreshToken: z.string(),
});

export const getUserByEmail = async (email: any) => {
  return await db.select().from(users).where(eq(users.email, email));
}

export const getUserById = async (id: any) => {
  return await db.select().from(users).where(eq(users.id, id));
}

// get jwt expiry time as date from the actual string token
export const getExpiryFromToken = (token: string) => {
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  return new Date(decodedPayload.exp * 1000).toISOString();
}


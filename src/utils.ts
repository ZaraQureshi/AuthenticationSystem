import { z } from "zod";
import { db } from "./db"
import { users } from "./drizzle/schema";
import { and, eq } from "drizzle-orm";

export  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  });

export const getUserByEmail=async (email:any)=>{
    return await db.select().from(users).where(eq(users.email,email));
}
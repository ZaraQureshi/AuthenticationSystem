import { z } from "zod";
import { createSchema } from "./db"
import { users as pgUser } from "./drizzle/schema";
import { users as mysqlUser } from "./drizzle/mysqlSchema";
import { Collection } from "mongoose";
import { and, eq } from "drizzle-orm";
import { refreshToken } from "./contoller";
import { Pool as PgPool } from 'pg';
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

export const getUserByEmail = async (email: any) => {
    const { db, type } = await createSchema();

    if (type === 'postgres') {

        return await db.select().from(pgUser).where(eq(pgUser.email, email));
    } else if (type === 'mysql') {
        return await db.select().from(mysqlUser).where(eq(mysqlUser.email, email));

    }
    else if (type === 'mongo') {
        const user = await db.collection('User').findOne({ email });
        return user ? [user] : [];
    }
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



import { eq } from "drizzle-orm";
import { db } from "./db"
import { tokens } from "./drizzle/schema";
import { getExpiryFromToken } from "./utils";

export const invalidateTokenForLogout = async (userId: number, token: string) => {
    const expiry = getExpiryFromToken(token);

    const existingTokens = await db.select().from(tokens).where(eq(tokens.token, token));
    if (existingTokens.length !== 0) return { message: "Token not found" };

    return await db.insert(tokens).values(
        {
            userId: userId,
            available: false,
            blocked: false,
            token,
            expiryDate: expiry,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    );
}
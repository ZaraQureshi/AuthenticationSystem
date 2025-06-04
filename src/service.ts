import { eq, gte, lte } from "drizzle-orm";
import { createSchema } from "./db"
import { tokens } from "./drizzle/schema";
import { getExpiryFromToken } from "./utils";
import { sendVerificationEmail } from "./services/mailService";

export const invalidateTokenForLogout = async (userId: number, token: string) => {
    const db=await createSchema();
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

export const purgeExpiredTokensFromDB = async (secret: string) => {
    // todo: better security
    const db=await createSchema();

    if (secret !== process.env.PURGE_SECRET) return;

    const expiredTokens = await db
        .delete(tokens)
        .where(lte(tokens.expiryDate, new Date().toISOString()));
    
    const a = 0;
}

export const sendVerificationEmailToUser = async (email: string, token: string) => {
    await sendVerificationEmail(email, token)
}


import { z } from "zod";

import { sign } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const ACCESS_SECRET = process.env.ACCESS_SECRET!;
export const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const registerSchema = z.object({
    email: z.string().email(),
    username:z.string().min(3),
    password: z.string().min(4),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
});

export const logoutSchema = z.object({
    userId: z.number(),
    refreshToken: z.string(),
});

export const purgeExpiredTokensSchema = z.object({
    secret: z.string().min(0),
});
export const generateAccessToken = (user: any) => {
    return sign({ email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
}

export const generateRefreshToken = (user: any) => {

    return sign({ email: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
}




// get jwt expiry time as date from the actual string token
export const getExpiryFromToken = (token: string) => {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return new Date(decodedPayload.exp * 1000).toISOString();
}



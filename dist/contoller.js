//todo- rate limiting
import { Hono } from "hono";
import { sign } from "jsonwebtoken";
import { db } from "./db";
import { users } from "../src/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();
const app = new Hono();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const generateAccessToken = (user) => {
    // if (!ACCESS_SECRET) {
    //     throw new Error("ACCESS_SECRET is not defined");
    // }
    return sign({ userId: user.userId, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
    return sign({ userId: user.userId }, REFRESH_SECRET, { expiresIn: '7d' });
};
// the Context is an object that represents everything related to the current HTTP request and response.
export const registerUser = async (c) => {
    const { email, password, username } = await c.req.json();
    // check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
        return c.json({ message: 'User already exists' }, 409);
    }
    // create user
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.insert(users).values({ email, password, username }).returning();
    if (user.length > 0) {
        return c.json({ message: 'User regsitered successfully' }, 201);
    }
};
export const loginUser = async (c) => {
    const { email, password } = await c.req.json();
    // check if user exists
    const userExists = await db.select().from(users).where(eq(users.email, email));
    if (userExists.length === 0) {
        return c.json({ message: 'User does not exist' }, 404);
    }
    const user = userExists[0];
    // check if password is correct
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return c.json({ message: 'Invalid credentials' }, 401);
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return c.json({ accessToken, refreshToken });
};
console.log("DB URL:", process.env.DATABASE_URL);

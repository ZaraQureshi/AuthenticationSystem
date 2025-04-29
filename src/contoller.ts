//todo- rate limiting
// todo-request throttling
import { Context, Hono } from "hono";
import { sign, verify } from "jsonwebtoken";
import { db } from "./db";
import { users } from "../src/drizzle/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import { log } from "console";
import { access } from "fs";
dotenv.config();
const app = new Hono();
const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

const generateAccessToken = (user: any) => {
    // if (!ACCESS_SECRET) {
    //     throw new Error("ACCESS_SECRET is not defined");
    // }
    return sign({ userId: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
}

const generateRefreshToken = (user: any) => {
    return sign({ userId: user.email }, REFRESH_SECRET, { expiresIn: '7d' });
}

// the Context is an object that represents everything related to the current HTTP request and response.
export const registerUser = async (c: Context) => {
    console.log("register");

    const { email, password, username } = await c.req.json();
    // check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
        return c.json({ message: 'User already exists' }, 409);
    }
    // create user
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = db.insert(users).values({ email, hashedPassword, username }).returning();
    console.log("Promise user:", user);
    const userdata = await user;
    console.log("userdata:", userdata);

    if (userdata.length > 0) {
        return c.json({ message: 'User regsitered successfully' }, 201);
    }
}
export const loginUser = async (c: Context) => {
    const { email, password } = await c.req.json();
    // check if user exists
    const userExists = await db.select().from(users).where(eq(users.email, email));
    if (userExists.length === 0) {
        return c.json({ message: 'User does not exist' }, 404);
    }
    const user = userExists[0];
    // check if password is correct
    const checkPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!checkPassword) {
        return c.json({ message: 'Invalid credentials' }, 401)
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return c.json({ accessToken, refreshToken });
}

export const refreshToken = async (c: Context) => {
    const {refreshToken} = await c.req.json();
    console.log(c.req.json());
    try {
        const payload:any = verify(refreshToken, REFRESH_SECRET) as any;
        console.log(payload.userId);
        
        const newAccessToken=generateAccessToken(payload.userId)
        return c.json({newAccessToken})

    }
    catch (ex) {
        return c.json({"message":"Invalid refresh token"},401)

    }

}

export const ping = async (c: Context) => {
    return c.json({ "message": "pining" })

}
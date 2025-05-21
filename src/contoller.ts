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
import { getUserByEmail, loginSchema } from "./utils";
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
    const existingUser = await getUserByEmail(email);
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
    const body = await c.req.json();
    console.log(body);

    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return c.json({ error: result.error.flatten() }, 400);
    }
    const { email, password } = result.data;
    console.log(result)
    // check if user exists
    const userExists = await getUserByEmail(email);
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
    const { refreshToken } = await c.req.json();
    console.log(c.req.json());
    try {
        const payload: any = verify(refreshToken, REFRESH_SECRET) as any;
        const newAccessToken = generateAccessToken(payload.userId)
        return c.json({ newAccessToken })
    }
    catch (ex) {
        return c.json({ "message": "Invalid refresh token" }, 401)
    }
}

export const forgotPassword = async (c: Context) => {

    const { refreshToken } = await c.req.json();
    console.log(refreshToken)
    const payload: any = verify(refreshToken, REFRESH_SECRET) as any;


    const userFound = await getUserByEmail(payload.userId)
    console.log(userFound.length);

    let resetToken = "";
    if (userFound.length === 1) {
        // Generate a password reset token.
        // Here we simply sign the user's id, but consider adding additional claims or using a separate token.
        console.log(userFound);
        console.log("reseg=Toekn:", sign({ userId: userFound[0].email }, ACCESS_SECRET, { expiresIn: '1h' }));

        resetToken = sign({ userId: userFound[0].email }, ACCESS_SECRET, { expiresIn: '1h' });

        console.log(resetToken)
    }
    // For security, you might want to return the same message even if not found
    console.log(payload.userId)
    return c.json({ message: 'If this email is registered, you will receive a reset link', resetToken });

}
export const resetPassword = async (c: Context) => {
    const { resetToken, newPassword } = await c.req.json();
    if (!resetToken || !newPassword) {
        return c.json({ message: 'Reset token and new password are required.' }, 400);
    }
    try {

        const payload: any = await verify(resetToken, ACCESS_SECRET) as any;

        const existingUser = await getUserByEmail(payload.userId);

        if (existingUser.length === 1) {
            
            const resetPassword = await db.update(users).set({ hashedPassword: newPassword }).where(eq(users.email, existingUser[0].email));
            
            return c.json({ "message": "Password reset successfull" }, 200)
        }
    } catch (error) {
        return c.json({ "message": "Token expired" }, 401)
    }
}
export const ping = async (c: Context) => {
    return c.json({ "message": "pining" })

}
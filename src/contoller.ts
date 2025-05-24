//todo- rate limiting
// todo-request throttling
// todo-identity token
// valiadtion for request token
// email parsing microservice
import { Context, Hono } from "hono";
import { sign, verify } from "jsonwebtoken";
import { db } from "./db";
import { users, tokens } from "../src/drizzle/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import { log } from "console";
import { access } from "fs";
import { getUserByEmail, loginSchema, logoutSchema } from "./utils";
import { invalidateTokenForLogout } from "./service";
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
    const userdata = await user;

    if (userdata.length > 0) {
        return c.json({ message: 'User regsitered successfully' }, 201);
    }
    return c.json({ message: "Could not register." }, 400)
}
export const loginUser = async (c: Context) => {
    const body = await c.req.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return c.json({ error: result.error.flatten() }, 400);
    }
    const { email, password } = result.data;
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
    try {
        const payload: any = verify(refreshToken, REFRESH_SECRET) as any;
        // verify whether the access token is expired or not
        const newAccessToken = generateAccessToken(payload.userId)
        return c.json({ newAccessToken })
    }
    catch (ex) {
        return c.json({ "message": "Invalid refresh token" }, 401)
    }
}

export const forgotPassword = async (c: Context) => {

    const { email } = await c.req.json();

    // no need for refresh token validation, forgot password will be unprotected
    // const payload: any = verify(refreshToken, REFRESH_SECRET) as any;


    const userFound = await getUserByEmail(email)
    // send email to the user
    let resetToken = "";
    if (userFound.length === 1) {

        resetToken = sign({ email }, ACCESS_SECRET, { expiresIn: '1h' });

    }
    // For security, you might want to return the same message even if not found
    return c.json({ message: 'If this email is registered, you will receive a reset link', resetToken });

}

export const resetPassword = async (c: Context) => {
    const { resetToken, newPassword } = await c.req.json();
    if (!resetToken || !newPassword) {
        return c.json({ message: 'Reset token and new password are required.' }, 400);
    }
    try {
        // verify whether it is expired
        const payload: any = await verify(resetToken, ACCESS_SECRET) as any;

        const existingUser = await getUserByEmail(payload.email);

        const hashedNewPassord = await bcrypt.hash(newPassword, 10);

        if (existingUser.length === 1) {

            const resetPassword = await db.update(users).set({ hashedPassword: hashedNewPassord }).where(eq(users.email, existingUser[0].email));

            return c.json({ "message": "Password reset successfull" }, 200)
        }
    } catch (error) {
        return c.json({ "message": "Token expired" }, 401)
    }
}

export const sentEmailVerification=async (c:Context)=>{
    const {email}= await c.req.json();
    const EmailToken= await sign({email},ACCESS_SECRET,{expiresIn:'1h'});
    // send a link in email to user with the verifyEmailToken
    return c.json({message:"Email sent to user"})
}
export const verifyEmail=async (c:Context)=>{
    const {emailToken}=await c.req.json();
    const verifyEmailToken= await verify(emailToken,ACCESS_SECRET);
    if(verifyEmailToken){
        return c.json({message:"Emailverified"},200)
    }
    return c.json({message:"Not verified"},400)
}


export const logout = async (c: Context) => {
    const result = logoutSchema.safeParse(await c.req.json());
    if (!result.success) return c.json({ error: result.error.flatten() }, 400);
    const { userId, refreshToken } = result.data;

    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length > 0) await invalidateTokenForLogout(userId, refreshToken);

    return c.json({ "message": "Logged out successfully" }, 200)
}

export const ping = async (c: Context) => {
    return c.json({ "message": "pining" })
}
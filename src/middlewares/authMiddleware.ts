import { Context } from "hono"
import { getUserByEmail } from "../utils"
import { bearerAuth } from 'hono/bearer-auth'
import { verify } from "jsonwebtoken";
import { AuthError } from "../errors";
import { boolean } from "drizzle-orm/gel-core";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export const emailVerification = async (c: Context) => {

    const { email } = await c.req.json();
    const user = await getUserByEmail(email).then(res => res[0]);
    console.log(user);

    const isVerified = user.isVerified;
    console.log(isVerified);

    if (isVerified) {
        return c.json({ message: "Email authenticated" }, 200)
    }
    return c.json({ message: "Email authentication required" }, 400)

}

export const authenticateJwt = async (c: Context, next: Function) => {
    var jwtToken: string = c.req.header('Authorization')!;
    console.log(jwtToken);
    if (!jwtToken) return c.json({ message: "token not found" }, 400);
    if (!verifyJwt(jwtToken)) return c.json({ message: "invalid token" }, 400);
    await next();
}

export const authenticateEmailConfirmation = async (c: Context, next: Function) => {
    var jwtToken: string = c.req.query('token')!;
    if (!jwtToken) return c.json({ message: "token not found" }, 400);
    if (!verifyJwt(jwtToken)) return c.json({ message: "invalid token" }, 400);
    await next();
}

function verifyJwt(token: string) {
    let result: boolean = false;
    try {
        token = token.replace('Bearer ', '');
        const verifyResult: any = verify(token, ACCESS_SECRET) as any;
        result = true;
    } catch (e) {
        console.log(e);
    }
    return result;
}

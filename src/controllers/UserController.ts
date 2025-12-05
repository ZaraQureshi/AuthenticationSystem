import { inject, injectable } from "tsyringe";
import { UserService } from "../service/UserService";
import { Context } from "hono";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { ACCESS_SECRET, generateAccessToken, purgeExpiredTokensSchema, REFRESH_SECRET, registerSchema } from "../utility/utils";
import { AuthError } from "../errors";
import { migrate } from "drizzle-orm/node-postgres/migrator";
@injectable()
export class UserController {
    constructor(@inject(UserService) private userService: UserService
    ) {

    }

    getAllUsers = async (c: Context) => {
        try {
            const users = await this.userService.GetAllUsers();
            return c.json(users, 200);
        } catch (e) {
            console.error(e);
            return c.json({ message: 'Failed to fetch users' }, 500);
        }
    };

    login = async (c: Context) => {
        try {
            const login = await this.userService.Login(c);
            return c.json({ message: login })
        } catch (e:any) {
            console.error(e);
            return c.json({ message: e.message }, 401); }
    }
    register = async (c: Context) => {
        const result = registerSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json({ error: result.error.flatten() }, 400);
        }

        const { username, email, password } = result.data;
        try {
            const registeredUser = await this.userService.Register(username, email, password);
            return c.json(registeredUser, 201);
        } catch (e:any) {
            console.error(e);
            return c.json({message:e.message}, 500);
        }
    };
    refreshToken = async (c: Context) => {
        const { refreshToken } = await c.req.json();
        try {
            const payload = verify(refreshToken, REFRESH_SECRET);
            if (typeof payload === 'object' && payload && 'email' in payload) {
                const accessToken = generateAccessToken(payload as JwtPayload);
                return c.json({ accessToken });
            }
            return c.json({ message: 'Invalid refresh token payload' }, 401);
        } catch (ex) {
            console.error(ex);
            return c.json({ message: 'Invalid refresh token' }, 401);
        }
    };

    forgotPassword = async (c: Context) => {
        const { email } = await c.req.json();
        try {
            const user = await this.userService.GetUserByEmail(email);
            if (user.length === 1) {
                const resetToken = sign({ email }, ACCESS_SECRET, { expiresIn: '1h' })
                return c.json({ message: "If you have registered, you will recieve an email", resetToken });
            }
            return c.json({ message: "Email does not exist" })
        } catch (e) {
            console.error(e);
            return c.json({ message: 'Failed to process request' }, 500);
        }
    }

    resetPassword = async (c: Context) => {
        const { resetToken, password } = await c.req.json();
        // if(!resetToken||!password){
        //     return c.json({message:"ResetToken and password are required"},400);

        // }
        try {
            const payload = verify(resetToken, ACCESS_SECRET);
            if (typeof payload === 'object' && payload && 'email' in payload) {
                const email = (payload as JwtPayload).email as string;
                const user = await this.userService.GetUserByEmail(email);
                if (user.length === 1) {
                    console.log('User fetched:', { id: user.id, email: user.email });
                    const updatedUser = await this.userService.UpdatePassword(email, password);
                    if (updatedUser) {
                        return c.json({ message: "Updated successfully" }, 200)
                    }
                }
                return c.json({ message: "Something went wrong" }, 404)
            }
            return c.json({ message: "Token expired or invalid" }, 401)
        } catch (ex) {
            console.error(ex);
            return c.json({ message: "Token expired or invalid" }, 401)
        }

    }

    sentEmailVerification = async (c: Context) => {
        const { email } = await c.req.json();
        const user = await this.userService.GetUserByEmail(email);
        if (user.length === 1) {
            const verificationLink = sign({ email }, ACCESS_SECRET, { expiresIn: '1h' });
            // send verification link to email
            return c.json({ message: "If you have registered, you will recieve an email", verificationLink });

        }
        return c.json({ message: "Something went wrong" }, 404)
    }

    verifyEmail = async (c: Context) => {
        const { emailToken } = await c.req.json();
        try {
            const payload = verify(emailToken, ACCESS_SECRET);
            if (typeof payload === 'object' && payload && 'email' in payload) {
                return c.json({ message: "Email verified" }, 200)
            }
            return c.json({ message: "Not verified" }, 400)
        } catch (ex) {
            console.error(ex);
            return c.json({ message: "Not verified" }, 400)
        }

    }

    logout = async (c: Context) => {
        const { email, refreshToken } = await c.req.json();
        const user = await this.userService.GetUserByEmail(email);

        if (!user) {
            return c.json({ message: 'User not found' }, 404);
        }

        await this.userService.InvalidateTokenForLogout(user.id, refreshToken);
        return c.json({ message: 'Logged out successfully' }, 200);
    };

    purgeExpiredTokens = async (c: Context) => {
        const result = purgeExpiredTokensSchema.safeParse(await c.req.json());
        if (!result.success) return c.json({ error: result.error.flatten() }, 400);
        const { secret } = result.data;

        await this.userService.PurgeExpiredTokensFromDB(secret);
        throw new AuthError();

        return c.json({ "message": "Complete" }, 200)
    }

    onboardUser = async (c: Context) => {

        console.log("onboard")
        const { dbType, connectionString } = await c.req.json();

        try {
            // const db = await createSchema();


            const migrated = await this.userService.MigrateDB();
            if (migrated) {

                return c.json({ message: 'Schema created successfully' });
            }
        } catch (err: any) {
            return c.json({ error: err.message }, 500);
        }
    };


}
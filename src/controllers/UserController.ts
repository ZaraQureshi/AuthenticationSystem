import { inject, injectable } from "tsyringe";
import { UserService } from "../service/UserService.ts";
// import { sign, verify, JwtPayload } from "jsonwebtoken";
import { generateAccessToken, purgeExpiredTokensSchema, registerSchema } from "../utility/utils.ts";
//import { AuthError } from "../utility/errors";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import bcrypt from "bcryptjs";
// import { verify } from "jsonwebtoken";
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

@injectable()
export class UserController {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject("AccessSecret") private accessSecret: string,
        @inject("RefreshSecret") private refreshSecret: string
    ) { }

    getAllUsers = async () => {
        try {
            const users = await this.userService.GetAllUsers();
            return users;
        } catch (e) {
            throw new Error('Failed to fetch users');
        }
    };

    login = async ({ email, password }: { email: string; password: string }) => {
        try {
            const result = await this.userService.Login(email, password);
            return result;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
    register = async ({ username, email, password }: { username: string; email: string; password: string }) => {
        const result = registerSchema.safeParse({ username, email, password });
        if (!result.success) {
            throw new Error(JSON.stringify(result.error.flatten()));
        }

        try {
            const registeredUser = await this.userService.Register(username, email, password);
            return registeredUser;
        } catch (e: any) {
            throw new Error(e);
        }
    };
    
    refreshToken = async (refreshToken: string) => {
        try {
            const payload = verify(refreshToken, this.refreshSecret);
            if (typeof payload === 'object' && payload && 'email' in payload) {
                const accessToken = generateAccessToken(payload as jwt.JwtPayload, this.accessSecret);
                return { accessToken };
            }
            throw new Error('Invalid refresh token payload');
        } catch (ex) {
            throw new Error('Invalid refresh token');
        }
    };

    forgotPassword = async (email:string) => {
        try {
            const user = await this.userService.GetUserByEmail(email);
            console.log(user);
            if (user.length === 1) {
                const resetToken = sign({ email }, this.accessSecret, { expiresIn: '1h' })
                return { message: "If you have registered, you will recieve an email", resetToken };
            }
            return { message: "Email does not exist" };
        } catch (e) {
            console.error(e);
            return { message: 'Failed to process request' };
        }
    }

    resetPassword = async ({ resetToken, password }: { resetToken: string; password: string }) => {
        console.log("Reset password:", password);
        // if(!resetToken||!password){
        //     return c.json({message:"ResetToken and password are required"},400);

        // }
        try {
            const payload = verify(resetToken, this.accessSecret);
            if (typeof payload === 'object' && payload && 'email' in payload) {
                const email = (payload as jwt.JwtPayload).email as string;
                const user = await this.userService.GetUserByEmail(email);

                if (user.length === 1) {

                    const isSamePassword = await bcrypt.compare(password, user[0].hashedPassword);
                    if (isSamePassword) {
                        console.log("Same password");
                        return { message: "New password cannot be same as old password" }
                    }
                    const updatedUser = await this.userService.UpdatePassword(email, password);
                    if (updatedUser) {
                        return { message: "Updated successfully" }
                    }
                }
                return { message: "Something went wrong" }
            }
            return { message: "Token expired or invalid" }
        } catch (ex) {
            console.error(ex);
            return { message: "Token expired or invalid" }
        }

    }

    sentEmailVerification = async (email: string) => {
        const user = await this.userService.GetUserByEmail(email);
        if (user.length === 1) {
            const verificationLink = sign({ email }, this.accessSecret, { expiresIn: '1h' });
            // send verification link to email
            return { message: "If you have registered, you will recieve an email", verificationLink };
        }
        return { message: "Something went wrong" }
    }

    verifyEmail = async (emailToken: string) => {
        try {
            const payload = verify(emailToken, this.accessSecret);
            if (typeof payload === 'object' && payload && 'email' in payload) {
                return { message: "Email verified" }
            }
            return { message: "Not verified" }
        } catch (ex) {
            console.error(ex);
            return { message: "Not verified" }
        }

    }

    logout = async (email: string, refreshToken: string) => {
        console.log("Logout email:", email);
        const user = await this.userService.GetUserByEmail(email);
        console.log("User found for logout:", user);
        if (!user) {
            return { message: 'User not found' };
        }
        try {

            const tokenInvalidated = await this.userService.InvalidateTokenForLogout(user.id, refreshToken);

            if (tokenInvalidated) {

                return { message: 'Logged out successfully' };
            }
        } catch (e) {
            console.error(e);
            return { message: 'Failed to logout' };
        }
    };

    purgeExpiredTokens = async (secret: string) => {
        try {
            const tokensPurged = await this.userService.PurgeExpiredTokensFromDB(secret);
            if (tokensPurged) {
                return { message: "Complete" };
            }
        } catch (e) {
            throw new Error();
        }
    }

    onboardUser = async () => {
        try {
            const migrated = await this.userService.MigrateDB();
            if (migrated) {
                return { message: 'Schema created successfully' };
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    };


}
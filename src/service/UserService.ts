import { IUserRepository } from "../repository/IUserRepository";
import { inject, injectable } from 'tsyringe';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, getExpiryFromToken } from "../utility/utils";
import { UserDTO } from "../model/User";
import { TokenDTO } from "../model/Token";
import { AccountLockService } from "./AccountLockService";
import { RateLimiter } from "../utility/RateLimiter";
//import { AuthError } from "../utility/errors";

@injectable()
export class UserService {
    constructor(
        @inject("IUserRepository") private userRepo: IUserRepository,
        @inject("AccessSecret") private accessSecret: string,
        @inject("RefreshSecret") private refreshSecret: string,
        private accountLock: AccountLockService,
        // private rateLimiterByEmail:RateLimiter
    ) { }
    async GetAllUsers() {
        const user = await this.userRepo.GetAllUsers();
        if (!user) throw new Error('User not found');
        // do password check etc.
        return user;
    }

    async Login(email: string, password: string) {
        // 1. Rate limiting (FAST, Redis)

        // await this.rateLimiterByEmail.hit(`login:email:${email}`);

        // 2. Fetch user
        const user = await this.userRepo.GetUserByEmail(email);

        if (!user) {
            throw new Error("Invalid email or password");
                }
        console.log("User found",user);
        // 3. Account lock check
        const checkBlock=await this.accountLock.isLocked(user[0].email)
        console.log("Account lock check:",checkBlock);
        if (checkBlock) {
            throw new Error("Account temporarily locked");
        }
console.log("Account not locked",user[0].password);
        // 4. Password check
        console.log("Comparing passwords",await bcrypt.compare(password, user[0].password));
        const valid = await bcrypt.compare(password, user[0].password);
console.log("Password valid:",valid);
        if (!valid) {
            console.log("Recording failure for",user[0].email);
            await this.accountLock.recordFailure(user[0].email);
            console.log("Failure recorded");
            throw new Error("Invalid email or password");
        }
console.log("Password correct");
        // 5. Success
        await this.accountLock.recordSuccess(user[0].email);
        console.log("Recorded success for",user[0].email);
        const accessToken = generateAccessToken(user[0], this.accessSecret);
        const refreshToken = generateRefreshToken(user[0], this.refreshSecret);

        return { accessToken, refreshToken };

    }

    Register = async (username: string, email: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: UserDTO = { username, email, role: 'user', password: hashedPassword, isBlocked: false, isVerified: false };
        try {
            const existingUser = await this.GetUserByEmail(user.email);

            if (existingUser.length > 0) {
                throw new Error("User already exists");
            }

            const registeredUser = this.userRepo.InsertUser(user)
            return registeredUser;
        } catch (e) {
            throw new Error(e as any);
        }
    }
    GetUserByEmail = async (email: string) => {
        try {
            const user = await this.userRepo.GetUserByEmail(email);
            return user;
        }
        catch (e) {
            throw new Error(e as any);
        }
    }
    UpdatePassword = async (email: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await this.userRepo.UpdatePassword(email, hashedPassword);
        return updatedUser;
    }
    InvalidateTokenForLogout = async (userId: number, token: string) => {
        const expiry = getExpiryFromToken(token);
        const existingTokens = await this.userRepo.GetByToken(token);

        if (existingTokens.length === 0) return { message: "Token not found" };
        const tokens: TokenDTO = {
            userId: userId,
            available: false,
            blocked: true,
            token,
            expiryDate: expiry,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return await this.userRepo.InsertToken(tokens);

    }
    PurgeExpiredTokensFromDB = async (secret: string) => {
        // todo: better security

        if (secret !== process.env.PURGE_SECRET)
            throw new Error("Unauthorized to purge tokens");

        try {
            const deletedToken = await this.userRepo.DeleteToken();
            return deletedToken;
        } catch (e) {
            throw new Error("Failed to purge tokens");
        }

    }
   

}
import { Context } from "hono";
import { IUserRepository } from "../repository/IUserRepository";
import { inject, injectable } from 'tsyringe';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, getExpiryFromToken } from "../utility/utils";
import { UserDTO } from "../model/User";
import { TokenDTO } from "../model/Token";
import { any } from "zod";
import logger from "../utility/logger";
import { AuthError } from "../errors";

@injectable()
export class UserService {
    constructor(@inject("IUserRepository") private userRepo: IUserRepository) { }

    async GetAllUsers() {
        const user = await this.userRepo.GetAllUsers();
        if (!user) throw new Error('User not found');
        // do password check etc.
        return user;
    }

    async Login(c: Context) {
        const { email, password } = await c.req.json();
        const userExists = await this.userRepo.GetUserByEmail(email)
        console.log(userExists);
        if (userExists.length === 0) {
            return c.json({ message: 'User does not exist' }, 404);
        }
        const user = userExists[0];
        // check if password is correct
        const checkPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!checkPassword) {
            throw new AuthError('Invalid credentials');
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

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
            throw new AuthError(e as any);
        }
    }
    UpdatePassword = async (email: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await this.userRepo.UpdatePassword(email, hashedPassword);
        return updatedUser;
    }
    InvalidateTokenForLogout = async (userId: number, token: string) => {
        const expiry = getExpiryFromToken(token);
        console.log("Expiry date:", expiry);
        const existingTokens = await this.userRepo.GetByToken(token);
        console.log("Existing tokens:", existingTokens);

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
        console.log("Purge secret:", secret);
        console.log("Env purge secret:", process.env.PURGE_SECRET);
        if (secret !== process.env.PURGE_SECRET) 
            console.error("Invalid purge secret");
        else{
            console.log("Purge secret validated");
        }
        try{
            const deletedToken=await this.userRepo.DeleteToken();
            console.log("Deleted tokens:", deletedToken);
            return deletedToken; 
        }catch(e){
            throw new AuthError("Failed to purge tokens")
            ;
        }

    }
    MigrateDB = async () => {
        return await this.userRepo.MigrateDB();
    }

}
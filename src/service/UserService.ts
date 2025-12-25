import { IUserRepository } from "../repository/IUserRepository";
import { inject, injectable } from 'tsyringe';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, getExpiryFromToken } from "../utility/utils";
import { UserDTO } from "../model/User";
import { TokenDTO } from "../model/Token";
//import { AuthError } from "../utility/errors";

@injectable()
export class UserService {
    constructor(
        @inject("IUserRepository") private userRepo: IUserRepository,
        @inject("AccessSecret") private accessSecret: string,
        @inject("RefreshSecret") private refreshSecret: string
    ) { }

    async GetAllUsers() {
        const user = await this.userRepo.GetAllUsers();
        if (!user) throw new Error('User not found');
        // do password check etc.
        return user;
    }

    async Login(email: string, password: string) {
        const userExists = await this.userRepo.GetUserByEmail(email)
        if (userExists.length === 0) {
            throw new Error('User does not exist');
        }
        const user = userExists[0];
        // check if password is correct
        const checkPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!checkPassword) {
            throw new Error('Invalid credentials');
        }
        const accessToken = generateAccessToken(user, this.accessSecret);
        const refreshToken = generateRefreshToken(user, this.refreshSecret);

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
    MigrateDB = async () => {
        return await this.userRepo.MigrateDB();
    }

}
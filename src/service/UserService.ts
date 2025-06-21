import { Context } from "hono";
import { IUserRepository } from "../repository/IUserRepository";
import { inject, injectable } from 'tsyringe';
import bcrypt from "bcryptjs/umd/types";
import { generateAccessToken, generateRefreshToken } from "../utils";

@injectable()
export class UserService {
    constructor(@inject('IUserRepository') private userRepo: IUserRepository) { }

    async GetAllUsers() {
        const user = await this.userRepo.GetAllUsers();
        if (!user) throw new Error('User not found');
        // do password check etc.
        return user;
    }

    async Login(c: Context) {
        const { email, password } = await c.req.json();
        const userExists = await this.userRepo.GetUserByEmail(email)
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

}
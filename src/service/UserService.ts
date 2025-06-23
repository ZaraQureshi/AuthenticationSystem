import { Context } from "hono";
import { IUserRepository } from "../repository/IUserRepository";
import { inject, injectable } from 'tsyringe';
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils";
import { UserDTO } from "../model/User";

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

        return { accessToken, refreshToken };
    }

    Register = async (username: string, email: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: UserDTO = { username, email,role: 'user', password: hashedPassword,isBlocked:false,isVerified:false };
        try {

            const registeredUser = this.userRepo.InsertUser(user)
            return registeredUser;
        } catch (e) {
            console.log(e)
        }
    }
    GetUserByEmail=async(email:string)=>{
        const user=await this.userRepo.GetUserByEmail(email);
        return user;
    }
}
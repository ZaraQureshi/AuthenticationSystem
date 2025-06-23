import { inject, injectable } from "tsyringe";
import { UserService } from "../service/UserService";
import { Context } from "hono";
import { sign, verify } from "jsonwebtoken";
import { ACCESS_SECRET, generateAccessToken, REFRESH_SECRET } from "../utils";
@injectable()
export class UserController {
    constructor(@inject('UserService') private userService: UserService
    ) {

    }

    getAllUsers = async () => {
        try {
            const users = await this.userService.GetAllUsers();
            console.log(users)
        }
        catch (e) {
            console.log(e)
        }
    }
    login = async (c: Context) => {
        try {
            const login = await this.userService.Login(c);
            return c.json({ message: login })
        } catch (e) {
            console.log(e)

        }
    }
    register = async (c: Context) => {
        const { username, email, password } = await c.req.json();
        try {
            const registeredUser = await this.userService.Register(username, email, password);

        } catch (e) {
            console.log(e);
        }
    }
    refreshToken = async (c: Context) => {
        const { refreshToken } = await c.req.json();
        try {
            const payload = verify(refreshToken, REFRESH_SECRET);
            const accessToken = generateAccessToken(payload);
            return c.json({ accessToken })
        }
        catch (ex) {
            return c.json({ "message": "Invalid refresh token" }, 401)
        }
    }

    forgotPassword = async (c: Context) => {
        const { email } = await c.req.json();
        try {
            const user = await this.userService.GetUserByEmail(email);
            if (user.length === 1) {
                const resetToken = sign({ email }, ACCESS_SECRET, { expiresIn: '1h' })
                return c.json({ message: "If you have registered, you will recieve an email", resetToken });
            }
            return c.json({message:"Email does not exist"})
        } catch (e) {
            console.log(e)
        }
    }

}
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
            return c.json({ message: "Invalid credentials" })
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
            return c.json({ message: "Email does not exist" })
        } catch (e) {
            console.log(e)
        }
    }

    resetPassword = async (c: Context) => {
        const { resetToken, password } = await c.req.json();
        // if(!resetToken||!password){
        //     return c.json({message:"ResetToken and password are required"},400);

        // }
        const payload = await verify(resetToken, ACCESS_SECRET);
        if (payload) {
            const user = await this.userService.GetUserByEmail(payload.email);
            if (user.length === 1) {

                const updatedUser = await this.userService.UpdatePassword(payload.email, password);
                if (updatedUser) {
                    return c.json({ message: "Updated successfully" }, 200)
                }
            }
            return c.json({ message: "Something went wrong" }, 404)

        }
        return c.json({ message: "Token expired" })

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
        const payload = verify(emailToken, ACCESS_SECRET);
        if (payload) {
            return c.json({ message: "Emailverified" }, 200)
        }
        return c.json({ message: "Not verified" }, 400)

    } 

    logout=async(c:Context)=>{
        const {email,refreshToken}=await c.req.json();
        const user = await this.userService.GetUserByEmail(email);
            if (user.length > 0) await this.userService.InvalidateTokenForLogout(email, refreshToken);
        
            return c.json({ "message": "Logged out successfully" }, 200)
    }

}
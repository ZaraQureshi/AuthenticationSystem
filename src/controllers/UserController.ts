import { inject, injectable } from "tsyringe";
import { UserService } from "../service/UserService";
import { Context } from "hono";
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
}
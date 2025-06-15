import { IUserRepository } from "../repository/IUserRepository";

export class UserService{
    constructor(private userRepo: IUserRepository) {}

    async getAllUsers() {
        const user = await this.userRepo.GetAllUsers();
        if (!user) throw new Error('User not found');
        // do password check etc.
        return user;
    }
}
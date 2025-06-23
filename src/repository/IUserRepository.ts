import { injectable } from "tsyringe";
import { UserDTO } from "../model/User";


export interface IUserRepository {
    GetAllUsers(): Promise<any>;
    InsertUser(user: UserDTO): Promise<any>;
    GetUserByEmail(email:string):Promise<any>
}
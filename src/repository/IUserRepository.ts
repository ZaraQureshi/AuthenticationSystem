import { injectable } from "tsyringe";
import { UserDTO } from "../model/User";
import { TokenDTO } from "../model/Token";


export interface IUserRepository {
    GetAllUsers(): Promise<any>;
    InsertUser(user: UserDTO): Promise<any>;
    GetUserByEmail(email:string):Promise<any>;
    UpdatePassword(email:string,password:string):Promise<any>;
    GetByToken(token:string):Promise<any>;
    InsertToken(token:TokenDTO):Promise<any>;
    DeleteToken():Promise<any>;
    MigrateDB():Promise<any>;

}
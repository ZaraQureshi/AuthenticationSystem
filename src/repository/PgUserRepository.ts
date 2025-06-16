import { injectable } from "tsyringe";
import { users } from "../drizzle/schema";
import { UserDTO } from "../model/User";
import { IUserRepository } from "./IUserRepository";

@injectable()
export class PgUserRepository implements IUserRepository{
    constructor(private db: any) {}
    async InsertUser(user:UserDTO){
       return await this.db.insert(users).values({ user }).returning();
    }

    async GetAllUsers(){
        return await this.db.select().from(users);
    }
}
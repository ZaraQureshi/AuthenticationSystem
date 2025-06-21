import { inject, injectable } from "tsyringe";
import { users } from "../drizzle/schema";
import { UserDTO } from "../model/User";
import { IUserRepository } from "./IUserRepository";
import { eq } from "drizzle-orm";

@injectable()
export class PgUserRepository implements IUserRepository{
    constructor(@inject('Database') private db: any) {}
    async InsertUser(user:UserDTO){
       return await this.db.insert(users).values({ user }).returning();
    }

    async GetAllUsers(){
        return await this.db.select().from(users);
    }

    async GetUserByEmail(email: string): Promise<any> {
        return await this.db.select().from(users).where(eq(users.email,email))
    }
}
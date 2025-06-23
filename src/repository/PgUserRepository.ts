import { inject, injectable } from "tsyringe";
import { users } from "../drizzle/schema";
import { UserDTO } from "../model/User";
import { IUserRepository } from "./IUserRepository";
import { eq } from "drizzle-orm";

@injectable()
export class PgUserRepository implements IUserRepository{
    constructor(@inject('Database') private db: any) {}
    async InsertUser(user:UserDTO){
       return await this.db.insert(users).values({
        username: user.username,
        email: user.email,
        hashedPassword: user.password, // Use hashedPassword
        role: user.role || 'user', // Default role
        isBlocked: user.isBlocked || false, // Default: not blocked
        isVerified: user.isVerified || false, // Default: not verified
    }).returning();
    }

    async GetAllUsers(){
        return await this.db.select().from(users);
    }

    async GetUserByEmail(email: string): Promise<any> {
        return await this.db.select().from(users).where(eq(users.email,email))
    }

    
}
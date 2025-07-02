import { inject, injectable } from "tsyringe";
import { tokens, users } from "../drizzle/schema";
import { UserDTO } from "../model/User";
import { IUserRepository } from "./IUserRepository";
import { eq, lte } from "drizzle-orm";
import { TokenDTO } from "../model/Token";
import { migrate } from "drizzle-orm/node-postgres/migrator";

@injectable()
export class PgUserRepository implements IUserRepository {
    constructor(@inject('Database') private db: any) { }
    async InsertUser(user: UserDTO) {
        return await this.db.insert(users).values({
            username: user.username,
            email: user.email,
            hashedPassword: user.password, // Use hashedPassword
            role: user.role || 'user', // Default role
            isBlocked: user.isBlocked || false, // Default: not blocked
            isVerified: user.isVerified || false, // Default: not verified
        }).returning();
    }

    async GetAllUsers() {
        return await this.db.select().from(users);
    }

    async GetUserByEmail(email: string): Promise<any> {
        return await this.db.select().from(users).where(eq(users.email, email))
    }
    async UpdatePassword(email: string, password: string): Promise<any> {
        return await this.db.update(users).set({ hashedPassword: password }).where(eq(users.email, email));
    }

    async InsertToken(token: TokenDTO) {
        return await this.db.insert(tokens).values(
            {
                userId: token.userId,
                available: false,
                blocked: false,
                token,
                expiryDate: token.expiryDate,
                createdAt: token.createdAt,
                updatedAt: token.updatedAt,
            }
        )
    }

    async GetByToken(token: string): Promise<any> {
        return await this.db.select().from(tokens).where(eq(tokens.token, token))

    }

    async DeleteToken(): Promise<any> {
        return await this.db
            .delete(tokens)
            .where(lte(tokens.expiryDate, new Date().toISOString()));
    }

    async MigrateDB():Promise<any>{
        await migrate(this.db, { migrationsFolder: 'src/drizzle/migrations' });
    }
}
import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { Database } from "../model/Database";
import { IUserRepository } from "./IUserRepository.ts";
import { UserDTO } from "../model/User.ts";
import { TokenDTO } from "../model/Token.ts";
import { Pool } from "pg";

@injectable()
export class PgUserRepository implements IUserRepository {
    constructor(
        @inject("Database") private db: Pool
    ) { }
    GetAllUsers(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    UpdatePassword(email: string, password: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    GetByToken(token: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    InsertToken(token: TokenDTO): Promise<any> {
        throw new Error("Method not implemented.");
    }
    DeleteToken(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    MigrateDB(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    // GetAllUsers() {
    //     return this.db
    //         .selectFrom("users")
    //         .selectAll()
    //         .execute();
    // }

    GetUserByEmail(email: string) {
        return this.db.query(
            `SELECT * FROM users WHERE email = '${email}'`
        )
    }

    InsertUser(user: UserDTO) {
        console.log("Inserting user:", user);
        return this.db.query(`insert into users (username, email, password, role, isBlocked, isVerified) values
            ('${user.username}', '${user.email}', '${user.password}', '${user.role}', ${user.isBlocked}, ${user.isVerified}) returning *`);
        // return this.db
        //     .insertInto("users")
        //     .values({
        //         username: user.username,
        //         email: user.email,
        //         password: user.password,
        //         role: user.role,
        //         isBlocked: user.isBlocked,
        //         isVerified: user.isVerified,
        //     })
        //     .returningAll()
        //     .executeTakeFirst();
    }

    // UpdatePassword(email: string, hashedPassword: string) {
    //     return this.db
    //         .updateTable("users")
    //         .set({ password: hashedPassword })
    //         .where("email", "=", email)
    //         .executeTakeFirst();
    // }

    // GetByToken(token: string) {
    //     return this.db
    //         .selectFrom("tokens")
    //         .selectAll()
    //         .where("token", "=", token)
    //         .execute();
    // }

    // InsertToken(token: TokenDTO) {
    //     return this.db
    //         .insertInto("tokens")
    //         .values(token)
    //         .executeTakeFirst();
    // }

    // DeleteToken() {
    //     return this.db
    //         .deleteFrom("tokens")
    //         .where("expiryDate", "<=", new Date().toISOString())
    //         .execute();
    // }

    // async MigrateDB() {
    //     // optional – usually done outside auth packages
    //     return true;
    // }
}

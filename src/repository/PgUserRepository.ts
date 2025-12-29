import { inject, injectable } from "tsyringe";
import { Kysely } from "kysely";
import { Database } from "../model/Database";
import { IUserRepository } from "./IUserRepository";
import { UserDTO } from "../model/User";
import { TokenDTO } from "../model/Token";

@injectable()
export class PgUserRepository implements IUserRepository {
  constructor(
    @inject("Database") private db: Kysely<Database>
  ) {}

  async GetAllUsers() {
    return await this.db
      .selectFrom("users")
      .selectAll()
      .execute();
  }

  async GetUserByEmail(email: string) {
    return await this.db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .execute();
  }

  async InsertUser(user: UserDTO) {
    return await this.db
      .insertInto("users")
      .values({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        isBlocked: user.isBlocked,
        isVerified: user.isVerified,
      })
      .returning("id")
      .executeTakeFirst();
  }

  UpdatePassword(email: string, hashedPassword: string) {
    return this.db
      .updateTable("users")
      .set({ password: hashedPassword })
      .where("email", "=", email)
      .executeTakeFirst();
  }

  GetByToken(token: string) {
    return this.db
      .selectFrom("tokens")
      .selectAll()
      .where("token", "=", token)
      .execute();
  }

  InsertToken(token: TokenDTO) {
    return this.db
      .insertInto("tokens")
      .values(token)
      .executeTakeFirst();
  }

  DeleteToken() {
    return this.db
      .deleteFrom("tokens")
      .where("expiryDate", "<=", new Date().toISOString())
      .execute();
  }

  async MigrateDB() {
    // optional – usually done outside auth packages
    return true;
  }
}

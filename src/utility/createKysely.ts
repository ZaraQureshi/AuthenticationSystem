// db/createKysely.ts
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "../model/Database";

export function createKysely(pool: Pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });
}

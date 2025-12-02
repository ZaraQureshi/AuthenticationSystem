import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as pgSchema from '../src/drizzle/schema';
import * as mysqlSchema from '../src/drizzle/mysqlSchema'; // example
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { MySqlDatabase } from 'drizzle-orm/mysql2';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleMySQL } from 'drizzle-orm/mysql2';
import { connect as connectMongo } from 'mongoose';
import { MongoClient } from "mongodb";

dotenv.config();

const DB_TYPE = process.env.DB_TYPE!;
const DATABASE_URL = process.env.DATABASE_URL!;
if(DB_TYPE==='mongo'){

  const mongo = new MongoClient(DATABASE_URL);
}

export const createSchema = async () => {
  const dbType = process.env.DB_TYPE;
  const connectionString = process.env.DATABASE_URL!;
  let db;
  if (dbType === 'postgres') {

    const pool = new Pool({ connectionString });
    db = drizzlePg(pool, { schema: { users: pgSchema.users, tokens: pgSchema.tokens } }) as NodePgDatabase<typeof pgSchema>;
    return { db, type: 'postgres' as const };
  } else if (dbType === 'mysql') {
    const { drizzle } = await import('drizzle-orm/mysql2');
    const mysql = await import('mysql2/promise');
    // const { mysqlSchema } = await import('../src/drizzle/mysqlSchema'); // adjust path if needed

    const pool = await mysql.createPool({ uri: connectionString });
    db = drizzleMySQL(pool, { schema: { users: mysqlSchema.users, tokens: mysqlSchema.tokens }, mode: "default" });
    return { db, type: 'mysql' as const };
  }else if(dbType==="mongodb"){
    // await mongo.connect();
    // db = mongo.db();
    return { db, type: 'mongo' as const }
  }
   else {
    throw new Error('Unsupported DB type');
  }
};
export type SupportedDB =
  | { db: ReturnType<typeof drizzlePg>; type: 'postgres' }
  | { db: ReturnType<typeof drizzleMySQL>; type: 'mysql' }
  | { db: ReturnType<MongoClient['db']>; type: 'mongo' };



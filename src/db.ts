import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as pgSchema from '../src/drizzle/schema';
import * as mysqlSchema from '../src/drizzle/mysqlSchema'; // example
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_TYPE=process.env.DB_TYPE!;
const DATABASE_URL=process.env.DATABASE_URL!;

export const createSchema= async()=>{
  let dbType=DB_TYPE;
  let connectionString=DATABASE_URL
  if(dbType='postgres'){
      let pool=new Pool({connectionString})
      return drizzle(pool,{schema:pgSchema});
  }else if (dbType === 'mysql') {
    const connection = await mysql.createConnection(connectionString);
    return drizzle(connection, { schema: mysqlSchema });
  } else {
    throw new Error('Unsupported DB type');
  }
}


 
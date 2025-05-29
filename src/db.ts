import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as pgSchema from '../src/drizzle/schema';
import * as mysqlSchema from '../src/drizzle/mysqlSchema'; // example
import mysql from 'mysql2/promise';


import dotenv from 'dotenv';
dotenv.config();

export const createSchema=async (dbType:string,connectionString:string)=>{
  let createDb;
  if(dbType='postgres'){
      let pool=new Pool({connectionString})
      createDb=drizzle(pool,{schema:pgSchema});
  }else if (dbType === 'mysql') {
    const connection = await mysql.createConnection(connectionString);
    createDb = drizzle(connection, { schema: mysqlSchema });
  } else {
    throw new Error('Unsupported DB type');
  }
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

});

// export const db = drizzle(pool, { schema });

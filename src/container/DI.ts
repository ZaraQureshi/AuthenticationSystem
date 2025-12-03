import 'reflect-metadata'; // 👈 Must be at the top

import { container } from 'tsyringe';
import { PgUserRepository } from '../repository/PgUserRepository';
import { UserService } from '../service/UserService';
import { IUserRepository } from '../repository/IUserRepository';
import { UserController } from '../controllers/UserController';
import { createSchema } from '../db';
import { MongoUserRepository } from '../repository/MongoUserRepository';

export async function initializeDI() {
    const { db, type } = await createSchema();
    const dbType = type;
    console.log("DB Type in DI:", dbType);
    if (dbType === 'postgres') {
        console.log("Registering PgUserRepository for Postgres");
        container.registerSingleton<IUserRepository>("IUserRepository",PgUserRepository);
    }
    // else if (dbType === 'mysql') {
    //     container.registerSingleton<IUserRepository>("IUserRepository",PgUserRepository);
    // }
    else if (dbType == 'mongo') {
                console.log("Registering PgUserRepository for mongo");

        // You would create and register a MongoUserRepository here
        container.registerSingleton<IUserRepository>("IUserRepository",MongoUserRepository);
    }
    else {
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }

 container.registerSingleton(UserService);
    container.registerSingleton(UserController);
    container.register('Database', { useValue: db }); // 👈 Register the database
}


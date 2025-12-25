import 'reflect-metadata'; // 👈 Must be at the top

import { container } from 'tsyringe';
import { PgUserRepository } from '../repository/PgUserRepository';
import { UserService } from '../service/UserService';
import { IUserRepository } from '../repository/IUserRepository';
import { UserController } from '../controllers/UserController';
// import { createSchema } from '../db';
// import { MysqlUserRepository } from '../repository/MysqlUserRepository';
import { MongoUserRepository } from '../repository/MongoUserRepository';

export async function initializeDI(dbType: string, db: any, accessSecret: string, refreshSecret: string) {
    container.register("Database", { useValue: db });
    container.register("AccessSecret", { useValue: accessSecret });
    container.register("RefreshSecret", { useValue: refreshSecret });
    if (dbType === 'postgres') {
        container.registerSingleton<IUserRepository>("IUserRepository", PgUserRepository);
    } else if (dbType === 'mysql') {
        // Assuming MysqlUserRepository exists
        // container.registerSingleton<IUserRepository>("IUserRepository", MysqlUserRepository);
    } else if (dbType === 'mongo') {
        container.registerSingleton<IUserRepository>("IUserRepository", MongoUserRepository);
    } else {
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }

    container.registerSingleton(UserService);
    container.registerSingleton(UserController);
}


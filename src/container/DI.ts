import 'reflect-metadata'; // 👈 Must be at the top

import { container } from 'tsyringe';
import { PgUserRepository } from '../repository/PgUserRepository';
import { UserService } from '../service/UserService';
import { IUserRepository } from '../repository/IUserRepository';
import { UserController } from '../controllers/UserController';
// import { createSchema } from '../db';
// import { MysqlUserRepository } from '../repository/MysqlUserRepository';
import { MongoUserRepository } from '../repository/MongoUserRepository';
import { createKysely } from '../utility/createKysely';
import { DEFAULT_ACCOUNT_LOCK, DEFAULT_RATE_LIMITS } from '../utility/defaults';
import { AuthConfig } from '..';
import { AccountLockService } from '../service/AccountLockService';
import { RedisRateLimiter } from '../utility/RateLimiter';

export async function initializeDI(dbType: string, db: any, accessSecret: string, refreshSecret: string, security?: AuthConfig["security"]) {
    container.register("Database", { useValue: db });
    container.register("AccessSecret", { useValue: accessSecret });
    container.register("RefreshSecret", { useValue: refreshSecret });
    //Account Lock config
    const accountLockConfig = {
        ...DEFAULT_ACCOUNT_LOCK,
        ...security?.accountLock,
    };

    container.register("AccountLockConfig", {
        useValue: accountLockConfig,
    });

    //Rate limit config
    const rateLimitConfig = {
        ...DEFAULT_RATE_LIMITS,
        ...security?.rateLimit,
    };

    container.register("RateLimitConfig", {
        useValue: rateLimitConfig,
    });

    if (dbType === 'postgres') {
        const kysely = createKysely(db);
        container.register("Database", { useValue: kysely });

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

    container.registerSingleton(AccountLockService);
    container.registerSingleton(RedisRateLimiter);

}


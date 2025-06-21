import 'reflect-metadata'; // 👈 Must be at the top

import { container } from 'tsyringe';
import { PgUserRepository } from '../repository/PgUserRepository';
import { UserService } from '../service/UserService';
import { IUserRepository } from '../repository/IUserRepository';
import { UserController } from '../controllers/UserController';
import { createSchema } from '../db';

export async function initializeDI() {
    const { db, type } = await createSchema();

    const dbType = type;
    if (dbType === 'postgres') {
        container.register<IUserRepository>('IUserRepository', {
            useClass: PgUserRepository,
        });
    } else {
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }

    container.register('UserService', { useClass: UserService });
    container.register('UserController', { useClass: UserController });
    container.register('Database', { useValue: db }); // 👈 Register the database
}

// Call the initialization function
initializeDI().catch((err) => {
    console.error('Failed to initialize dependency injection:', err);
    process.exit(1); // Exit the process if DI initialization fails
});
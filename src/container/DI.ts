import 'reflect-metadata'; // 👈 Must be at the top

import { container } from 'tsyringe';
import { PgUserRepository } from '../repository/PgUserRepository';
import { UserService } from '../service/UserService';
import { IUserRepository } from '../repository/IUserRepository';
import { UserController } from '../controllers/UserController';

const dbType=process.env.DB_TYPE;
if (dbType === 'postgres') {
    container.register<IUserRepository>('IUserRepository', {
      useClass: PgUserRepository,
    });
  }
container.register('UserService', { useClass: UserService });
container.register('UserController', { useClass: UserController });

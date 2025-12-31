import "reflect-metadata";
import { initializeDI } from "./container/DI";
import { container } from "tsyringe";
import { UserController } from "./controllers/UserController";

export interface AuthConfig {
    dbType: 'postgres' | 'mysql' | 'mongo';
    db: any; // Drizzle DB instance
    accessSecret: string;
    refreshSecret: string;
    purgeSecret?: string; // Optional for purging
    security?: {
        accountLock?: {
            maxAttempts?: number;
            lockDurationMin?: number;
        };
    };
}

export async function createAuthService(config: AuthConfig) {
    await initializeDI(config.dbType, config.db, config.accessSecret, config.refreshSecret);
    const userController = container.resolve(UserController);
    return {
        register: userController.register.bind(userController),
        login: userController.login.bind(userController),
        refreshToken: userController.refreshToken.bind(userController),
        forgotPassword: userController.forgotPassword.bind(userController),
        resetPassword: userController.resetPassword.bind(userController),
        sentEmailVerification: userController.sentEmailVerification.bind(userController),
        verifyEmail: userController.verifyEmail.bind(userController),
        purgeExpiredTokens: userController.purgeExpiredTokens.bind(userController),
        logout: userController.logout.bind(userController),
        getAllUsers: userController.getAllUsers.bind(userController),
    };
}

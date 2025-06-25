import { Hono } from 'hono';
import { initializeDI } from './container/DI'; // Import the DI initialization function

import './container/DI.ts'; // <-- Import this BEFORE resolving from container
import { container } from 'tsyringe';

import { registerUser, ping, loginUser, refreshToken, forgotPassword, resetPassword, purgeExpiredTokens, logout, onboardUser } from '../src/contoller';
import { emailVerification } from './middlewares/authMiddleware';
import { UserController } from './controllers/UserController';

const routes = new Hono();
let userController;
export const initializeRoutes = async () => {
    try {
        // Wait for DI initialization to complete
        await initializeDI;

        // Resolve the UserController after DI is initialized
    userController = container.resolve(UserController);

        // Define routes that depend on UserController
        routes.get('/users', userController.getAllUsers);
        routes.post('/login', userController.login);
        routes.post('/register', userController.register);
        routes.post('/refresh-token', userController.refreshToken);
        routes.post('/forgot-password', userController.forgotPassword);
        routes.post('/reset-password', userController.resetPassword);
        routes.post('/verify-email',userController.verifyEmail);
        routes.post('/sent-email-verification',userController.sentEmailVerification);
    } catch (err) {
        console.error('Failed to initialize routes:', err);
        process.exit(1); // Exit the process if initialization fails
    }
};

// const userController = container.resolve(UserController);
// routes.get('/users', userController.getAllUsers);

routes.post('/logout', logout);

routes.post('/purge-expired-tokens', purgeExpiredTokens);
routes.post('/onboard', onboardUser);
// routes.get('/users', userController.getAllUsers);

export default routes;
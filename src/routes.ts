import { Hono } from 'hono';
import { register } from 'module';
import { registerUser, ping, loginUser, refreshToken, forgotPassword, resetPassword, purgeExpiredTokens, logout, onboardUser, verifyEmail, confirmEmail } from '../src/contoller';
import { authenticateEmailConfirmation, authenticateJwt, emailVerification } from './middlewares/authMiddleware';
import { bearerAuth } from 'hono/bearer-auth';
const routes = new Hono();

routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.post('/logout', logout);
routes.post('/refresh-token', refreshToken);
routes.post('/forgot-password', emailVerification, forgotPassword);
routes.post('/reset-password', resetPassword);
routes.post('/verify-email', verifyEmail);
routes.get('/confirm-email', authenticateEmailConfirmation, confirmEmail);

routes.post('/purge-expired-tokens', purgeExpiredTokens);
routes.post('/onboard', onboardUser);
routes.get('/ping', ping);

export default routes;
import { Hono } from 'hono';
import { register } from 'module';
import { registerUser,ping,loginUser,refreshToken,forgotPassword, resetPassword, purgeExpiredTokens, logout } from '../src/contoller';
import { emailVerification } from './middlewares/authMiddleware';
 const routes = new Hono();

routes.post('/register',registerUser);
routes.post('/login',loginUser);
routes.post('/logout',logout);
routes.post('/refresh-token',refreshToken);
routes.post('/forgot-password',emailVerification,forgotPassword);
routes.post('/reset-password',resetPassword);
routes.post('/verify-email');

routes.post('/purge-expired-tokens', purgeExpiredTokens);

routes.get('/ping', ping);

export default routes;
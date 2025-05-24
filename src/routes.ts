import { Hono } from 'hono';
import { register } from 'module';
import { registerUser, ping, loginUser, refreshToken, forgotPassword, resetPassword, logout } from '../src/contoller';
const routes = new Hono();

routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.post('/logout', logout);
routes.post('/refresh-token', refreshToken);
routes.post('/forgot-password', forgotPassword);
routes.post('/reset-password', resetPassword);
routes.post('/verify-email');
routes.get('/ping', ping);
export default routes;
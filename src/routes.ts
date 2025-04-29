import { Hono } from 'hono';
import { register } from 'module';
import { registerUser,ping,loginUser,refreshToken } from '../src/contoller';
 const routes = new Hono();

routes.post('/register',registerUser);
routes.post('/login',loginUser);
routes.post('/logout');
routes.post('/refresh-token',refreshToken);
routes.post('/forgot-password');
routes.post('/reset-password');
routes.post('/verify-email');
routes.get('/ping',ping);
export default routes;
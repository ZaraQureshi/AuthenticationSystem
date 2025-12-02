import { Context, Hono } from "hono";
import routes, { initializeRoutes } from "./routes";
import dotenv from 'dotenv';

import { errorMiddleware } from "./middlewares/errorMiddleware"
dotenv.config();
const app = new Hono();
(async () => {
    await initializeRoutes();
    app.route("/api", routes);
    app.onError(errorMiddleware);
})();
export default app;

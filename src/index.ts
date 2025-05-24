import { Context, Hono } from "hono";
import routes from "./routes";
import dotenv from 'dotenv';
import { errorMiddleware } from "./middlewares/errorMiddleware"
dotenv.config();
const app = new Hono();
app.route("/api", routes);
app.onError(errorMiddleware);
export default app;

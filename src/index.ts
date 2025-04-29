import { Hono } from "hono";
import routes from "./routes";
import dotenv from 'dotenv';
dotenv.config();
const app=new Hono();
app.route("/api",routes);
export default app;

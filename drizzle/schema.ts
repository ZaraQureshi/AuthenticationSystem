import { pgTable,text,serial} from "drizzle-orm/pg-core"

export const users=pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role:text("role").notNull().default("user"),
})
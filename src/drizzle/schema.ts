import { pgTable,text,serial} from "drizzle-orm/pg-core"

export const users=pgTable("User", {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    hashedPassword: text("password").notNull(),
    role:text("role").notNull().default("user"),
})
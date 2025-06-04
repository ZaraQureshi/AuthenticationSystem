import { pgTable, text, serial, boolean, bigint } from "drizzle-orm/pg-core"

export const users = pgTable("User", {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    hashedPassword: text("password").notNull(),
    role:text("role").notNull().default("user"),
    isVerified:boolean("isVerified").notNull().default(false),
    isBlocked:boolean("isBlocked").notNull().default(false)
})

export const tokens = pgTable("Token", {
    id: serial("id").primaryKey(),
    userId: bigint({ mode: 'number' }).notNull(),
    token: text("token").notNull(),
    available: boolean("available").notNull().notNull(),
    blocked: boolean("blocked").notNull(),
    expiryDate: text("expiryDate").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
})
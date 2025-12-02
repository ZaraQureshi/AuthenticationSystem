import { pgTable, text, serial, boolean, bigint, bigserial } from "drizzle-orm/pg-core"

export const users = pgTable("User", {
    id: bigserial({ mode: 'number' }).primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    hashedPassword: text("password").notNull(),
    role:text("role").notNull().default("user"),
    isVerified:text("isVerified").notNull(),
    isBlocked:boolean("isBlocked").notNull()
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

// export const pgSchema = {
//     users,
//     tokens,
//   };
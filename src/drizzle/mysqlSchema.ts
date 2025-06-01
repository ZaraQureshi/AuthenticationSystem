import { mysqlTable, varchar, serial, datetime, text, bigint, boolean } from 'drizzle-orm/mysql-core';



export const users = mysqlTable('User', {
    id: serial('id').primaryKey(),  // Auto-incremented integer
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull(),
    hashedPassword: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).default('user'),
    isVerified: text("isVerified").notNull(),
    isBlocked: boolean("isBlocked").notNull()

});
export const tokens = mysqlTable("Token", {
    id: serial("id").primaryKey(), // MySQL supports serial (auto_increment)
    userId: bigint("userId", { mode: 'number' }).notNull(),
    token: text("token").notNull(),
    available: boolean("available").notNull(),
    blocked: boolean("blocked").notNull(),
    expiryDate: text("expiryDate").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
});

// export const mysqlSchema = {
//     users,
//     tokens,
//   };
import { mysqlTable, varchar, serial, datetime, text } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),  // Auto-incremented integer
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  emailVerified: datetime('email_verified', { mode: 'string' })
  
});

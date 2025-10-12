import { pgTable, text, timestamp, uuid, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull(),
  password: text().notNull(), // Will be hashed with bcrypt
  name: text().notNull(),
  
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
}, (table) => ({
  emailUnique: unique().on(table.email),
}));

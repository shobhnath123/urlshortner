import { pgTable, uuid,varchar,text,timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './user.model.js';

export const urlsTable = pgTable('urls', {
  id: uuid('id').primaryKey().defaultRandom(),

  shortUrl: varchar('code', { length: 155 }).notNull().unique(),
  targetURL: varchar('target_url', { length: 255 }).notNull(),
  userId: uuid('user_id').notNull().references(() => usersTable.id).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate().notNull(),
});
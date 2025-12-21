import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { db } from '../db/index.js';
import { uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './user.model.js';

export const urlsTable = pgTable('urls',{
    id: uuid().primaryKey().defaultRandom(),
    shortCode: varchar('code',{length:100}).notNull().unique(),
    targetURL: text('target_url').notNull(),

    userId: uuid('user_id').references(()=>usersTable.id).notNull(), //foriegn key to join with user table and url table with on the basis of id 

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
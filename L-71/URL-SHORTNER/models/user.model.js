
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { db } from '../db/index.js';
import { uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users',{
    id: uuid().primaryKey().defaultRandom(),
    firstname: varchar('first_name',{length:50}).notNull(),
    lastname: varchar('last_name',{length:50}),
    email: varchar({length:255}).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),

});
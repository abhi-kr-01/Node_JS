import { timestamp } from 'drizzle-orm/gel-core';
import { uuid, pgTable, varchar, text } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users',{
    id : uuid().primaryKey().defaultRandom(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),   // for hasing
});

//session creation

export const userSession = pgTable('user_session',{
    id: uuid().primaryKey().defaultRandom(),
    userid: uuid().references(() => userTable.id).notNull(),  // this is foreign key
    createdAt: timestamp().defaultNow().notNull(),
});
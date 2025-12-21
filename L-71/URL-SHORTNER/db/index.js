import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL);
export default db;

//this file is basically for connevtion purposes
//we are exporting db object to use it in other files
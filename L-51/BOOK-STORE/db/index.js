const  { drizzle } = require('drizzle-orm/node-postgres');

const db = drizzle(process.env.DATABASE_URL);  //db_url in drizzle

module.exports = db;
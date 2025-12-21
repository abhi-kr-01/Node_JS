const {drizzle} = require("drizzle-orm/node-postgres");
const {Pool} = require("pg");

const pool = new Pool({
    connectionString:"postgres://postgres:admin@localhost:5432/mydb"
})

//postgrs://<username>:<password>@<host>:<port>/<db_name>  format of url of db
const db = drizzle(pool);

module.exports = db;
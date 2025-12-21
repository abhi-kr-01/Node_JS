const { defineConfig } = require('drizzle-kit');
//drizzle-orm -> send or rec data from db
//drizzle-kit -> send your schema UI from your db

const config = defineConfig
(
    {
        dialect:'postgresql',
        out:'./drizzle',
        schema:'./DRIZZLE/schema.js',
        dbCredentials:{
            url:"postgres://postgres:admin@localhost:5432/mydb",
        }
    }
)

module.exports = config;
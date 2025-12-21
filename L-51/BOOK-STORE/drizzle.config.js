require('dotenv/config');

const {defineConfig} = require('drizzle-kit');

const config = defineConfig({
    out: './drizzle',
    schema: './models/index.js',   //this tie our project has fragmented schema what should we do
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});

module.exports = config;

// o, we import the complete directory of schema the is models
// and make file in models that is index.js and import both schema in that file
const {pgTable ,uuid , varchar ,text, index} = require('drizzle-orm/pg-core');
const { sql } =require('drizzle-orm');
const authorTable = require('./author.model');
//varchar have fixed length but text can be very long
//creating Table Schema
 const booksTable = pgTable("books",{
    id: uuid().primaryKey().defaultRandom(),
    titile: varchar({length:100}).notNull(),
    description: text(),
    authorID: uuid().references(()=>authorTable.id).notNull(),
},(table)=>({
    searchIndexOnTable: index("title_index").using('gin',
        sql`to_tsvector('english',${table.titile})`
    ),
})
);

module.exports =  booksTable ;
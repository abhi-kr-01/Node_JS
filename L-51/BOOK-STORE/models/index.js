//here in our project there are two schema that is book and author so how we connect it within single model 
// for send it in drizzle.config.js/config/schema:''  .Due to this we decided to make this index.js file for 
//connect both of them

 const booksTable = require('./book.model');
 const authorTable = require('./author.model');

module.exports = {
    booksTable,
    authorTable,
};
const booksTable = require('../models/book.model');
const authorTable = require('../models/author.model');
const db = require('../db');
const { sql } = require('drizzle-orm');
const {eq} = require('drizzle-orm'); //eq = equal to

///writing somethings and getting somethoing is asynchronous process  
//bcz db return "promise"; so we use async -> to handle promise

exports.getAllBooks = async function(req,res){
    //searching from db
    const search = req.query.search;

    // if(search){
    //     const books = await db.select().from(booksTable).where(ilike(booksTable.title,`%${search}%`));
    //     return res.json(books);
    // }
    if(search){
        const books = await db
        .select()
        .from(booksTable)
        .where(sql`to_tsvector('english',${booksTable.titile}) @@ to_tsquery('english',${search})`);
        return res.json(books);
    }

    //returning all books 
    const books = await db.select().from(booksTable);

    return res.json(books);

};

exports.getBookById = async function (req,res){
    const id = req.params.id;

    const [book] = await db.select().from(booksTable)
    .where((table) => eq(table.id,id))
    .leftJoin(authorTable,eq(booksTable.authorID,authorTable.id))
    .limit(1);

    if(!book){
        return res.status(404).json({error:`Book with id ${id} does not exists!`});
    }

    return res.json(book);
}

exports.createBook = async function (req,res){
    const {title,description,authorId,} = req.body;

    if(!title || ! title==="")
        return res.status(400).json({error: "title is required"});

    //now we have to insert
    const [result] = await db.insert(booksTable)
    .values({title,description,authorId})
    .returning({
        id: booksTable.id,
    });

    return res.status(201).json({message : "Book created success", id: result.id});
};

exports.deleteBookById = async function(req,res){
    const id = req.params.id;

    await db.delete(booksTable).where(eq(booksTable.id,id));

    return res.json({message:"book deleted succesfully"});
};
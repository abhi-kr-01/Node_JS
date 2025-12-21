const booksTable = require('../models/book.model');
const authorTable = require('../models/author.model');
const db = require('../db');
const {eq} = require('drizzle-orm');

exports.getAllAuthor = async function (req,res){
    const author = await db.
    select()
    .from(authorTable);

    return res.json(author);
}

exports.getAuthorById = async function( req,res){
    const id = req.params;

    const [author] = await db.
    select()
    .from(authorTable)
    .where(eq(authorTable.id,id));

    if(!author){
        return res.json({error:`Author with ${id} doen not Exist`});
    }

    return res.json(author);
}

exports.createAuthor = async function (req,res){
    const {firstName,lastName,email} = req.body.params;

    const [result] = await db
    .insert(authorTable)
    .values({
        firstName,
        lastName,
        email,
    }).returning({
        id:authorTable.id
    });

    return res.json({message:'Author created successfully',id:result.id});
}

exports.getAllBooksById = async function (req,res){
    const id = req.prams.id;

    const books = await db
    .select().from(authorTable)
    .where(eq(booksTable.authorID,authorTable.id));

    return res.json(books);
}
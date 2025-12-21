const Book = require('../models/book');
//models === database

exports.getAllBooks = function(req,res){
    res.json(Book);
}

exports.getBookById = function(req,res){
    const id = parseInt(req.params.id);

    if(isNaN(id)) 
        return res.status(400).json({error:'id must me integer'});

    const book = Book.find((e) => e.id === id);

    if(!book){
        return res.status(400).
        json({error:`Book with ${id} does not exists!`});
    }

    return res.json(Book);
}

exports.createBook = function(req,res){
    const {title,author} = req.body;

    if(!title || title == "") 
        return res.status(400).json({'error':'title is required'});

    if(!author || author == "")
        return res.status(400).json({'error':'Author is required'});

    const id = Book.length+1;
    const book = {id,title,author};

    Book.push(book);
    return res.status(201).json({message:'Book Stored succesfully',id});
}

exports.deleteBookById = function(req,res){
    const id = parseInt(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({error:`id must be integer type`});
    }

    const indexToDelete = Book.findIndex((e)=> e.id === id);

    if(indexToDelete < 0){
        return res.status(404).json({error:`Book with id: ${id} doen't exist`});
    }

    Book.splice(indexToDelete,1);
    return res.status(200).json({message:`Book with id: ${id} is deleted succeesfully`});
}
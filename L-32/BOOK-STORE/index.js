const express = require('express');

const app = express();

const PORT = 8000;

// let us assume in db

const Book = [
    {id: 1, title:'Book one',author:"Author one"},
    {id: 2,title:'Book two',author:'Author two'}
];

//Middleware(plugin)
app.use(express.json());

// customise midlleware

// app.use(function(req,res,next){
//     console.log('i am midlleware a');
// })  --> it will holding back all the next routes/other midlleware

app.use(function(req,res,next){
    console.log("i am mwB");
    next();
});  // it will call another midlleware or routes 

// app.use(function(req,res,next){
//     console.llog("i am mwc");
//     return req.json({message:"Hey, no further rotes will come b/c of me"});
// })

// api
app.get('/books',(req,res)=>{
    res.setHeader('x-name',"Abhi");  // it set custom header to the client;
    res.json(Book);  //it send array of book into json format
});

app.get('/books/:id',(req,res)=>{
    const id = req.params.id;   //this id is string 
    const book = Book.find((e)=>e.id == id);  //here check id

    if(isNaN(id)) return res.status(400).json({'error':`You Book id: ${id} should be a number`});

    if(!book) return res.status(404).json({'error':`Your Book ${id} is not found`});
    else return res.status(201).json(Book[id-1]);
});

app.post('/books',(req,res)=>{
    
    const {title,author} = req.body;

    if(!title || title == "") 
        return res.status(400).json({'error':'title is required'});

    if(!author || author == "")
        return res.status(400).json({'error':'Author is required'});

    const id = Book.length+1;
    const book = {id,title,author};

    Book.push(book);
    return res.status(201).json({message:'Book Stored succesfully',id});
});

app.delete('/books/:id',(req,res)=>{

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
});

app.listen(PORT,()=> console.log(`your server is running at ${PORT}`));
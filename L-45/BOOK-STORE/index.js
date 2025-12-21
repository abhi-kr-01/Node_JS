const express = require('express');
const bookRoutes = require('./routes/book.routes');
const {middleware} = require('./middlewares/middleware');


const app = new express();

// const Book = [
//     {id: 1, title:'Book one',author:"Author one"},
//     {id: 2,title:'Book two',author:'Author two'}
// ];


//middleware
app.use(express.json());
app.use(middleware);

//routes


// app.use('/',bookRoutes);
app.use('/books',bookRoutes);  // all rotes which has /book come at this routes and
//call it then goes to bookRoutes and recognise that route


// server running
app.listen(8000,()=> console.log("your server is running at port : 8000"));
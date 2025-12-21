require('dotenv/config');  // it load all data of .env file

const express = require('express');

const {loggerMiddleware} = require('./middleware/logger');

const bookRouter = require('./routes/book.routes.');
const authorRouter = require('./routes/author.route');

const app = express();
const PORT= 8000;


//MiddleWarePlugins
app.use(express.json());
app.use(loggerMiddleware);

//Routes
app.use("/books",bookRouter);
app.use("/authors",authorRouter);

app.listen(PORT,()=> console.log(`http server is running on PORT ${PORT}`));
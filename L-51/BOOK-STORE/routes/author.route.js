const {express,params} = require('express');
const authorTable = require('../models/author.model');
const db = require('../db');
const {eq} = require('drizzle-orm'); //eq(para1,para2) => check both are equal or not
const booksTable = require('../models/book.model');
const controllers = require('../controlllers/author.controller')

const router = express.Router();

router.get('/',controllers.getAllAuthor)


router.get('/:id', controllers.getAuthorById)

router.post('/',controllers.createAuthor);

router.get('/:id/books', controllers.getAllBooksById);

// router.delete('/:id', async (req,res) => {

// })

module.exports = router;